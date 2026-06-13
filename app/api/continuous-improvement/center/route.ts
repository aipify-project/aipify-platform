import { NextResponse } from "next/server";
import { parseContinuousImprovementCenter } from "@/lib/continuous-improvement-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_continuous_improvement_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseContinuousImprovementCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Continuous Improvement Center" }, { status: 500 });
  }
}
