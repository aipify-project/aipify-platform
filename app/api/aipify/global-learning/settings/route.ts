import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseGlobalLearningSettings } from "@/lib/aipify/global-learning";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_global_learning_settings");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGlobalLearningSettings(data));
  } catch {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("update_global_learning_settings", { p_patch: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGlobalLearningSettings(data));
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
