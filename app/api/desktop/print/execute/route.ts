import { NextResponse } from "next/server";
import { parsePrintJob } from "@/lib/print-output";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const jobId = body.job_id as string;
    await supabase.rpc("confirm_aipify_print_job", {
      p_job_id: jobId,
      p_printer_id: body.printer_id ?? null,
    });
    const status = body.simulate_failure ? "failed" : "completed";
    const { data, error } = await supabase.rpc("report_desktop_print_status", {
      p_job_id: jobId,
      p_status: status,
      p_error_summary: body.error_summary ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePrintJob(data));
  } catch {
    return NextResponse.json({ error: "Failed to execute desktop print job" }, { status: 500 });
  }
}
