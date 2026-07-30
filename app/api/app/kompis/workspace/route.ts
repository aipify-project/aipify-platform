import { NextResponse } from "next/server";
import { buildKompisAiReadiness, getKompisAiRuntimeStatus } from "@/lib/kompis-operator/ai-runtime";
import { mapKompisOperatorRpcError, parseWorkspace } from "@/lib/kompis-operator/parse";
import { listAvailableKompisOperatorTools, KOMPIS_OPERATOR_TOOL_REGISTRY } from "@/lib/kompis-operator/tools-registry";
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

    const { data, error } = await supabase.rpc("get_app_kompis_operator_workspace");
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to load Kompis workspace.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    const parsed = parseWorkspace(data);
    if (!parsed) {
      return NextResponse.json({ error: "Unable to load Kompis workspace.", code: "unknown" }, { status: 500, headers });
    }
    let providerState: Record<string, unknown> = {};
    const stateRes = await supabase.rpc("get_app_kompis_ai_provider_state");
    if (!stateRes.error && stateRes.data && typeof stateRes.data === "object") {
      providerState = stateRes.data as Record<string, unknown>;
    }
    const runtime = getKompisAiRuntimeStatus(providerState);
    return NextResponse.json(
      {
        ...parsed,
        ai: runtime,
        readiness: buildKompisAiReadiness(providerState),
        tools: {
          available: listAvailableKompisOperatorTools().map((tool) => ({
            key: tool.key,
            version: tool.version,
            category: tool.category,
            riskClass: tool.riskClass,
            kind: tool.kind,
          })),
          unavailable: KOMPIS_OPERATOR_TOOL_REGISTRY.filter((tool) => !tool.available).map((tool) => ({
            key: tool.key,
            version: tool.version,
            reason: tool.unavailableReason ?? "unavailable",
          })),
        },
      },
      { headers },
    );
  } catch {
    return NextResponse.json({ error: "Unable to load Kompis workspace.", code: "unknown" }, { status: 500, headers });
  }
}
