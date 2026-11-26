import { NextResponse } from "next/server";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";
import {
  PARTNERS_AVATAR_MAX_BYTES,
  buildPartnersAvatarPointer,
  buildPartnersAvatarStoragePath,
  detectPartnersAvatarMime,
  validatePartnersAvatarBytes,
} from "@/lib/partners-portal/avatar";
import { COMPANION_ATTACHMENT_STORAGE_BUCKET } from "@/lib/companion-runtime/artifact-context/constants";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Partners portal profile photo (own account only).
 * - Gate: same seller-portal access as the `/partners` layout.
 * - Bytes: private Storage under `partner-avatars/{auth user}/avatar`.
 * - Auth `user_metadata.avatar_url`: short same-origin pointer (keeps session tokens small).
 * Never accepts a target user id from the client; never returns storage paths or secrets.
 */

const BUCKET = COMPANION_ATTACHMENT_STORAGE_BUCKET;
// Multipart overhead allowance on top of the image cap.
const MAX_REQUEST_BYTES = PARTNERS_AVATAR_MAX_BYTES + 64 * 1024;

const NO_STORE = { "Cache-Control": "no-store" } as const;

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
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

/** Serves the signed-in partner's own photo — no user id parameter, so no cross-seller reads. */
export async function GET() {
  const gate = await requirePartnersPortalApiAccess();
  if (!gate.ok) return gate.response;

  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.storage
      .from(BUCKET)
      .download(buildPartnersAvatarStoragePath(gate.access.userId));
    if (error || !data) return fail("not_found", 404);

    const bytes = new Uint8Array(await data.arrayBuffer());
    const mime = detectPartnersAvatarMime(bytes);
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
  const gate = await requirePartnersPortalApiAccess();
  if (!gate.ok) return gate.response;

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
  const validation = validatePartnersAvatarBytes(bytes, file.type);
  if (!validation.ok) {
    return fail(validation.code, validation.code === "too_large" ? 413 : 400);
  }

  const userId = gate.access.userId;
  try {
    const admin = createServiceRoleClient();
    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(buildPartnersAvatarStoragePath(userId), bytes, {
        contentType: validation.mime,
        upsert: true,
        cacheControl: "300",
      });
    if (uploadError) return fail("storage_unavailable", 503);
  } catch {
    return fail("storage_unavailable", 503);
  }

  const pointer = buildPartnersAvatarPointer();
  if (!(await writeAvatarPointer(userId, pointer))) return fail("profile_unavailable", 503);

  // Best-effort Core sync pointer — Storage + auth metadata remain source of truth.
  try {
    await callCspRpc(gate.access.supabase, "csp_set_partner_avatar_url", {
      p_avatar_url: pointer,
    });
  } catch {
    // Non-blocking: upload already succeeded.
  }

  return NextResponse.json({ ok: true, hasAvatar: true, avatarUrl: pointer }, { headers: NO_STORE });
}

export async function DELETE() {
  const gate = await requirePartnersPortalApiAccess();
  if (!gate.ok) return gate.response;

  const userId = gate.access.userId;
  try {
    const admin = createServiceRoleClient();
    const { error } = await admin.storage.from(BUCKET).remove([buildPartnersAvatarStoragePath(userId)]);
    if (error) return fail("storage_unavailable", 503);
  } catch {
    return fail("storage_unavailable", 503);
  }

  if (!(await writeAvatarPointer(userId, null))) return fail("profile_unavailable", 503);

  try {
    await callCspRpc(gate.access.supabase, "csp_set_partner_avatar_url", {
      p_avatar_url: null,
    });
  } catch {
    // Non-blocking.
  }

  return NextResponse.json({ ok: true, hasAvatar: false, avatarUrl: null }, { headers: NO_STORE });
}
