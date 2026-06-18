import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePilotDashboard } from "@/lib/aipify/pilot/parse";
import { UNONIGHT_PILOT_SLUG } from "@/lib/aipify/integrations/unonight";
import { runInitialDiscoveryJob } from "@/lib/aipify/pilot/jobs";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: statusData, error: statusError } = await supabase.rpc("get_pilot_install_status", {
      p_slug: UNONIGHT_PILOT_SLUG,
    });
    if (statusError) return NextResponse.json({ error: statusError.message }, { status: 400 });

    const tenantId = (statusData as { profile?: { tenant_id?: string } })?.profile?.tenant_id;
    if (!tenantId) {
      return NextResponse.json({ error: "Unonight tenant not provisioned yet" }, { status: 400 });
    }

    const fetcher = async (rpc: string, params: Record<string, unknown>) => {
      const { data, error } = await supabase.rpc(rpc, params);
      if (error) throw new Error(error.message);
      return data;
    };

    const data = await runInitialDiscoveryJob(fetcher, tenantId, "initial_install");
    const parsed = data as { dashboard?: unknown };
    return NextResponse.json({
      ...(data as Record<string, unknown>),
      dashboard: parsed.dashboard ? parsePilotDashboard(parsed.dashboard) : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Discovery failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
