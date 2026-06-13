import { NextResponse } from "next/server";
import { parsePrintJob } from "@/lib/print-output";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json().catch(() => ({}))) as { printer_id?: string };
    const { data, error } = await supabase.rpc("confirm_aipify_print_job", {
      p_job_id: id,
      p_printer_id: body.printer_id ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePrintJob(data));
  } catch {
    return NextResponse.json({ error: "Failed to confirm print job" }, { status: 500 });
  }
}
