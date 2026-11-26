import { NextResponse } from "next/server";
import {
  CUSTOMER_AVATAR_MAX_BYTES,
  buildCustomerAvatarPointer,
  buildCustomerAvatarStoragePath,
  detectCustomerAvatarMime,
  validateCustomerAvatarBytes,
} from "@/lib/app/account-profile/avatar";
import { COMPANION_ATTACHMENT_STORAGE_BUCKET } from "@/lib/companion-runtime/artifact-context/constants";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Customer APP profile photo (own account only).
 * - Gate: signed-in APP user via createClient().auth.getUser()
 * - Bytes: private Storage under `customer-avatars/{auth user}/avatar`
 * - Auth `user_metadata.avatar_url`: short same-origin pointer
 * Never accepts a target user id from the client.
 */

const BUCKET = COMPANION_ATTACHMENT_STORAGE_BUCKET;
const MAX_REQUEST_BYTES = CUSTOMER_AVATAR_MAX_BYTES + 64 * 1024;
const NO_STORE = { "Cache-Control": "no-store" } as const;

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

async function requireAuthUserId(): Promise<{ userId: string } | { response: NextResponse }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { response: fail("unauthorized", 401) };
  return { userId: user.id };
}

async function writeAvatarPointer(userId: string, pointer: string | null): Promise<boolean> {
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data?.user) return false;
    const metadata = { ...(data.user.user_metadata ?? {}) } as Record<string, unknown>;
    if (pointer) metadata.avatar_url = pointer;
    else delete metadata.avatar_url;
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      user_metadata: metadata,
    });
    return !updateError;
  } catch {
    return false;
  }
}

export async function GET() {
  const gate = await requireAuthUserId();
  if ("response" in gate) return gate.response;

  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.storage
      .from(BUCKET)
      .download(buildCustomerAvatarStoragePath(gate.userId));
    if (error || !data) return fail("not_found", 404);

    const bytes = new Uint8Array(await data.arrayBuffer());
    const mime = detectCustomerAvatarMime(bytes);
    if (!mime) return fail("not_found", 404);

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Length": String(bytes.length),
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
      },
    });
  } catch {
    return fail("unavailable", 503);
  }
}

export async function POST(request: Request) {
  const gate = await requireAuthUserId();
  if ("response" in gate) return gate.response;

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return fail("too_large", 413);
  }

  let file: FormDataEntryValue | null = null;
  try {
    const form = await request.formData();
    file = form.get("file");
  } catch {
    return fail("invalid_request", 400);
  }
  if (!(file instanceof File)) return fail("invalid_request", 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const validation = validateCustomerAvatarBytes(bytes, file.type);
  if (!validation.ok) {
    return fail(validation.code, validation.code === "too_large" ? 413 : 400);
  }

  try {
    const admin = createServiceRoleClient();
    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(buildCustomerAvatarStoragePath(gate.userId), bytes, {
        contentType: validation.mime,
        upsert: true,
        cacheControl: "300",
      });
    if (uploadError) return fail("storage_unavailable", 503);
  } catch {
    return fail("storage_unavailable", 503);
  }

  const pointer = buildCustomerAvatarPointer();
  if (!(await writeAvatarPointer(gate.userId, pointer))) return fail("profile_unavailable", 503);

  return NextResponse.json({ ok: true, hasAvatar: true, avatarUrl: pointer }, { headers: NO_STORE });
}

export async function DELETE() {
  const gate = await requireAuthUserId();
  if ("response" in gate) return gate.response;

  try {
    const admin = createServiceRoleClient();
    const { error } = await admin.storage
      .from(BUCKET)
      .remove([buildCustomerAvatarStoragePath(gate.userId)]);
    if (error) return fail("storage_unavailable", 503);
  } catch {
    return fail("storage_unavailable", 503);
  }

  if (!(await writeAvatarPointer(gate.userId, null))) return fail("profile_unavailable", 503);

  return NextResponse.json({ ok: true, hasAvatar: false, avatarUrl: null }, { headers: NO_STORE });
}
