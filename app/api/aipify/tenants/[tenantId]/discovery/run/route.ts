import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runInitialDiscoveryJob } from "@/lib/aipify/pilot/jobs";

export async function POST(
  request: Request,
  context: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const runType = (body as { run_type?: string }).run_type ?? "manual_rescan";

    const fetcher = async (rpc: string, params: Record<string, unknown>) => {
      const { data, error } = await supabase.rpc(rpc, params);
      if (error) throw new Error(error.message);
      return data;
    };

    const data = await runInitialDiscoveryJob(
      fetcher,
      tenantId,
      runType as "initial_install" | "manual_rescan" | "scheduled_scan"
    );
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Discovery failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
