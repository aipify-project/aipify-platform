import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ACTION_RPC: Record<string, { fn: string; bodyKeys?: string[] }> = {
  start: { fn: "start_installation", bodyKeys: ["system_type", "domain"] },
  advance: { fn: "advance_install_step", bodyKeys: ["step"] },
  discover: { fn: "run_install_discovery" },
  "approve-permissions": { fn: "approve_install_permissions", bodyKeys: ["permission_keys"] },
  "accept-recommendations": { fn: "accept_install_recommendations", bodyKeys: ["recommendation_ids"] },
  complete: { fn: "complete_installation" },
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  try {
    const { action } = await params;
    const config = ACTION_RPC[action];
    if (!config) return NextResponse.json({ error: "Unknown action" }, { status: 404 });

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const rpcParams: Record<string, unknown> = {};
    if (action === "start") {
      rpcParams.p_system_type = body.system_type ?? null;
      rpcParams.p_domain = body.domain ?? null;
    } else if (action === "advance") {
      rpcParams.p_step = body.step ?? null;
    } else if (action === "approve-permissions") {
      rpcParams.p_permission_keys = body.permission_keys ?? null;
    } else if (action === "accept-recommendations") {
      rpcParams.p_recommendation_ids = body.recommendation_ids ?? null;
    }

    const { data, error } = await supabase.rpc(config.fn, rpcParams);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? {});
  } catch {
    return NextResponse.json({ error: "Install action failed" }, { status: 500 });
  }
}
