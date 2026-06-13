import { NextResponse } from "next/server";
import { parsePrintJob } from "@/lib/print-output";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_print_output_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const center = data as { recent_jobs?: unknown[] };
    return NextResponse.json({ jobs: center?.recent_jobs ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to list print jobs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { data, error } = await supabase.rpc("create_aipify_print_job", { p_payload: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePrintJob(data));
  } catch {
    return NextResponse.json({ error: "Failed to create print job" }, { status: 500 });
  }
}
