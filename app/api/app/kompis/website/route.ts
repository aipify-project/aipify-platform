import { NextResponse } from "next/server";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { buildAuthoritativeWebsiteWorkspaceView } from "@/lib/kompis-operator/website-workspace-view";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };

export async function GET() {
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

    const view = await buildAuthoritativeWebsiteWorkspaceView(supabase);
    if (!view.context.organizationId) {
      return NextResponse.json(
        { error: "Website operations are not available.", code: "kompis_unavailable" },
        { status: 403, headers },
      );
    }

    const rate = await assertKompisOperatorRateLimit({
      supabase,
      userId: user.id,
      organizationId: view.context.organizationId,
      kind: "plan",
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests.", code: "rate_limited", resetInSeconds: rate.resetInSeconds ?? 60 },
        { status: 429, headers },
      );
    }

    return NextResponse.json(
      {
        authoritative: true,
        context: view.context,
        runtime: view.runtime,
        pages: view.drafts,
        drafts: view.drafts,
        seo: {
          findingCount: view.seoFindings.length,
          findings: view.seoFindings,
        },
        quality: { findingCount: view.qualityFindingCount },
        locales: view.localeCoverage,
        publish: view.publish,
        actions: view.actions,
        consistency: view.consistency,
        tools: view.tools,
      },
      { headers },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const mapped = mapKompisOperatorRpcError(message);
    return NextResponse.json(
      { error: "Unable to load website operations.", code: mapped.code },
      { status: mapped.status, headers },
    );
  }
}
