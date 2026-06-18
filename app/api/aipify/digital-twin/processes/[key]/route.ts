import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseProcessDetail } from "@/lib/aipify/digital-twin/parse";

type RouteContext = { params: Promise<{ key: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { key } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_digital_twin_process", { p_process_key: key });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const detail = parseProcessDetail(data);
    if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to load process" }, { status: 500 });
  }
}
