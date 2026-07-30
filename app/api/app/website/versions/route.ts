import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";

const headers = { "Cache-Control": "no-store" };

/** GET ?versionId=<uuid> returns full manifest + preview detail; otherwise lists versions. */
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
    const versionId = url.searchParams.get("versionId");

    if (versionId) {
      const { data, error } = await supabase.rpc("get_customer_website_version_detail", {
        p_version_id: versionId,
      });
      if (error) {
        const mapped = mapKompisOperatorRpcError(error.message);
        return NextResponse.json(
          { error: "Unable to load website version.", code: mapped.code },
          { status: mapped.status, headers },
        );
      }
      return NextResponse.json({ version: data }, { headers });
    }

    const limitParam = Number(url.searchParams.get("limit") ?? 20);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;
    const { data, error } = await supabase.rpc("get_customer_website_versions", { p_limit: limit });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to load website versions.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    return NextResponse.json(data, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to load website versions.", code: "unknown" }, { status: 500, headers });
  }
}
