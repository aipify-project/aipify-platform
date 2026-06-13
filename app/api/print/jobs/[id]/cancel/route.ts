import { NextResponse } from "next/server";
import { parsePrintJob } from "@/lib/print-output";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("cancel_aipify_print_job", { p_job_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePrintJob(data));
  } catch {
    return NextResponse.json({ error: "Failed to cancel print job" }, { status: 500 });
  }
}
