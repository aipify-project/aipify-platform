import { NextResponse } from "next/server";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { resolveKompisWebsiteContext } from "@/lib/kompis-operator/website-context";
import {
  buildWebsiteContentQualityAudit,
  buildWebsiteLocaleCoverage,
  buildWebsiteSeoAudit,
  listWebsiteDraftPages,
} from "@/lib/kompis-operator/website-ops";
import { KOMPIS_OPERATOR_TOOL_REGISTRY } from "@/lib/kompis-operator/tools-registry";
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

    const context = await resolveKompisWebsiteContext(supabase);
    if (!context.organizationId) {
      return NextResponse.json(
        { error: "Website operations are not available.", code: "kompis_unavailable" },
        { status: 403, headers },
      );
    }

    const rate = await assertKompisOperatorRateLimit({
      supabase,
      userId: user.id,
      organizationId: context.organizationId,
      kind: "plan",
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests.", code: "rate_limited", resetInSeconds: rate.resetInSeconds ?? 60 },
        { status: 429, headers },
      );
    }

    const listed = await listWebsiteDraftPages(supabase, 50);
    const seo = buildWebsiteSeoAudit({ context, pages: listed.pages });
    const quality = buildWebsiteContentQualityAudit(listed.pages);
    const locales = buildWebsiteLocaleCoverage(listed.pages);
    const websiteTools = KOMPIS_OPERATOR_TOOL_REGISTRY.filter((tool) => tool.category === "website");

    return NextResponse.json(
      {
        context,
        pages: listed.pages,
        seo,
        quality,
        locales,
        tools: {
          available: websiteTools.filter((tool) => tool.available).map((tool) => ({
            key: tool.key,
            version: tool.version,
            riskClass: tool.riskClass,
            kind: tool.kind,
          })),
          unavailable: websiteTools
            .filter((tool) => !tool.available)
            .map((tool) => ({
              key: tool.key,
              version: tool.version,
              reason: tool.unavailableReason ?? "unavailable",
            })),
        },
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
