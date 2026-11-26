import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { isCspPartnerId } from "@/lib/certified-sales-partner/partner-admin-detail";
import { COMPANION_ATTACHMENT_STORAGE_BUCKET } from "@/lib/companion-runtime/artifact-context/constants";
import { buildPartnersAvatarStoragePath, detectPartnersAvatarMime } from "@/lib/partners-portal/avatar";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const NOT_FOUND = () => new NextResponse(null, { status: 404, headers: { "Cache-Control": "no-store" } });

/**
 * Platform Admin view of a seller's profile photo (GET only, read-only).
 * The seller portal stores the photo in private Storage and serves it only to the signed-in seller;
 * this route lets a verified Platform Admin read one seller's photo by partner id.
 */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const { id } = await context.params;
    if (!isCspPartnerId(id)) return NOT_FOUND();

    const admin = createServiceRoleClient();
    const { data: partner, error } = await admin
      .from("csp_partner_profiles")
      .select("auth_user_id")
      .eq("id", id)
      .maybeSingle();
    const authUserId = (partner as { auth_user_id?: unknown } | null)?.auth_user_id;
    if (error || typeof authUserId !== "string" || !authUserId) return NOT_FOUND();

    const { data, error: downloadError } = await admin.storage
      .from(COMPANION_ATTACHMENT_STORAGE_BUCKET)
      .download(buildPartnersAvatarStoragePath(authUserId));
    if (downloadError || !data) return NOT_FOUND();

    const bytes = new Uint8Array(await data.arrayBuffer());
    const mime = detectPartnersAvatarMime(bytes);
    if (!mime) return NOT_FOUND();

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
    return new NextResponse(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
