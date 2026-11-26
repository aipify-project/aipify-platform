import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const NO_STORE = { "Cache-Control": "no-store" } as const;
const FULL_NAME_MAX = 120;
const PHONE_MAX = 40;

type PatchBody = {
  fullName?: string;
  phone?: string;
};

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

/**
 * Update the signed-in customer's personal name and phone.
 * Identity is taken from the session — never from a client-supplied user id.
 * Email changes stay on the existing verification flow (not handled here).
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fail("unauthorized", 401);

    let body: PatchBody;
    try {
      body = (await request.json()) as PatchBody;
    } catch {
      return fail("invalid_request", 400);
    }

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim().slice(0, FULL_NAME_MAX) : undefined;
    const phone =
      typeof body.phone === "string" ? body.phone.trim().slice(0, PHONE_MAX) : undefined;

    if (fullName === undefined && phone === undefined) {
      return fail("nothing_to_update", 400);
    }
    if (fullName !== undefined && fullName.length < 1) {
      return fail("full_name_required", 400);
    }

    const admin = createServiceRoleClient();

    if (fullName !== undefined) {
      const { error: usersError } = await admin
        .from("users")
        .update({ full_name: fullName })
        .eq("auth_user_id", user.id);
      if (usersError) return fail("profile_unavailable", 503);

      const { data: authUser, error: getError } = await admin.auth.admin.getUserById(user.id);
      if (getError || !authUser?.user) return fail("profile_unavailable", 503);
      const metadata = {
        ...(authUser.user.user_metadata ?? {}),
        full_name: fullName,
      } as Record<string, unknown>;
      const { error: metaError } = await admin.auth.admin.updateUserById(user.id, {
        user_metadata: metadata,
      });
      if (metaError) return fail("profile_unavailable", 503);
    }

    if (phone !== undefined) {
      // Empty string clears phone; non-empty updates. Never invent a number.
      const { error: phoneError } = await admin.auth.admin.updateUserById(user.id, {
        phone: phone.length > 0 ? phone : undefined,
      });
      if (phoneError) {
        // Some projects disable phone column updates — fall back to metadata only.
        const { data: authUser } = await admin.auth.admin.getUserById(user.id);
        if (!authUser?.user) return fail("profile_unavailable", 503);
        const metadata = {
          ...(authUser.user.user_metadata ?? {}),
          phone: phone.length > 0 ? phone : null,
        } as Record<string, unknown>;
        if (phone.length === 0) delete metadata.phone;
        const { error: metaError } = await admin.auth.admin.updateUserById(user.id, {
          user_metadata: metadata,
        });
        if (metaError) return fail("profile_unavailable", 503);
      }
    }

    return NextResponse.json(
      {
        ok: true,
        fullName: fullName ?? null,
        phone: phone ?? null,
      },
      { headers: NO_STORE },
    );
  } catch {
    return fail("unavailable", 503);
  }
}
