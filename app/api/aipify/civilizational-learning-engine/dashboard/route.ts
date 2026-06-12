import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCivilizationalLearningDashboard } from "@/lib/aipify/civilizational-learning-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_civilizational_learning_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCivilizationalLearningDashboard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load Civilizational Learning dashboard" },
      { status: 500 },
    );
  }
}
