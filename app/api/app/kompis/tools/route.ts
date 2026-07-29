import { NextResponse } from "next/server";
import { KOMPIS_OPERATOR_TOOL_REGISTRY, listAvailableKompisOperatorTools } from "@/lib/kompis-operator/tools-registry";
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

    return NextResponse.json(
      {
        available: listAvailableKompisOperatorTools().map((tool) => ({
          key: tool.key,
          version: tool.version,
          category: tool.category,
          riskClass: tool.riskClass,
          kind: tool.kind,
          requiresApproval: tool.requiresApproval,
        })),
        unavailable: KOMPIS_OPERATOR_TOOL_REGISTRY.filter((tool) => !tool.available).map((tool) => ({
          key: tool.key,
          version: tool.version,
          reason: tool.unavailableReason ?? "unavailable",
        })),
      },
      { headers },
    );
  } catch {
    return NextResponse.json({ error: "Unable to load tools.", code: "unknown" }, { status: 500, headers });
  }
}
