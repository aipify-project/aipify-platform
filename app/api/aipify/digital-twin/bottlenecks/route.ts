import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBottleneckResult } from "@/lib/aipify/digital-twin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("detect_digital_twin_bottlenecks");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBottleneckResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to detect bottlenecks" }, { status: 500 });
  }
}
