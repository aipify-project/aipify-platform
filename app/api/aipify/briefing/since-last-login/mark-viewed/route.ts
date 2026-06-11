import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { markBriefingViewedJob } from "@/lib/aipify/briefing/jobs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const summaryId = (body as { summary_id?: string }).summary_id;

    const fetcher = async (rpc: string, params: Record<string, unknown>) => {
      const { data, error } = await supabase.rpc(rpc, params);
      if (error) throw new Error(error.message);
      return data;
    };

    const data = await markBriefingViewedJob(fetcher, summaryId);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to mark viewed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
