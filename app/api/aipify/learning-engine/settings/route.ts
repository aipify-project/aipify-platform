import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseLearningEngineSettings } from "@/lib/aipify/learning-engine/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_learning_engine_settings");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseLearningEngineSettings(data));
  } catch {
    return NextResponse.json({ error: "Failed to load learning settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("update_learning_engine_settings", {
      p_settings: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseLearningEngineSettings(data));
  } catch {
    return NextResponse.json({ error: "Failed to update learning settings" }, { status: 500 });
  }
}
