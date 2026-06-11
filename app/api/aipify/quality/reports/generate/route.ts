import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateGuardianReportJob } from "@/lib/aipify/quality/jobs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const reportType = (body as { report_type?: string }).report_type ?? "admin_summary";

    const fetcher = async (rpc: string, params: Record<string, unknown>) => {
      const { data, error } = await supabase.rpc(rpc, params);
      if (error) throw new Error(error.message);
      return data;
    };

    const data = await generateGuardianReportJob(fetcher, reportType);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Report generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
