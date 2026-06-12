import { NextResponse } from "next/server";
import { parseWisdomEngineExport } from "@/lib/aipify/wisdom-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { format?: string };
    const { data, error } = await supabase.rpc("export_wisdom_engine_report", {
      p_format: body.format ?? "json",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseWisdomEngineExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export report" }, { status: 500 });
  }
}
