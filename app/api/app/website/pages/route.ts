import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";

const headers = { "Cache-Control": "no-store" };

/** GET ?pageId=<uuid> returns one page with revisions; otherwise lists pages (default limit 50). */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const rate = await assertKompisOperatorRateLimit({
      supabase,
      userId: user.id,
      organizationId: access.context.organization_id ?? "unknown",
      kind: "plan",
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests.", code: "rate_limited", resetInSeconds: rate.resetInSeconds ?? 60 },
        { status: 429, headers },
      );
    }

    const url = new URL(request.url);
    const pageId = url.searchParams.get("pageId");

    if (pageId) {
      const { data, error } = await supabase.rpc("get_customer_website_page_detail", { p_page_id: pageId });
      if (error) {
        const mapped = mapKompisOperatorRpcError(error.message);
        return NextResponse.json(
          { error: "Unable to load website page.", code: mapped.code },
          { status: mapped.status, headers },
        );
      }
      return NextResponse.json({ page: data }, { headers });
    }

    const limitParam = Number(url.searchParams.get("limit") ?? 50);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;
    const { data, error } = await supabase.rpc("get_customer_website_pages", { p_limit: limit });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to load website pages.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    return NextResponse.json(data, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to load website pages.", code: "unknown" }, { status: 500, headers });
  }
}
