import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseWorkstyleGreeting } from "@/lib/aipify/workstyle";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("generate_workstyle_desktop_greeting");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseWorkstyleGreeting(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate greeting" }, { status: 500 });
  }
}
