import { NextResponse } from "next/server";
import { parseFirstDayExperienceCenter } from "@/lib/first-day-experience";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_first_day_experience_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseFirstDayExperienceCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load First Day Experience" }, { status: 500 });
  }
}
