import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseQualityIncidents } from "@/lib/aipify/quality/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_quality_image_issues");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseQualityIncidents(data));
  } catch {
    return NextResponse.json({ error: "Failed to load image issues" }, { status: 500 });
  }
}
