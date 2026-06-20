import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Profile badge scaffold — returns achievement badges when certifications.view is available. */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    const { data, error } = await supabase.rpc("get_user_achievement_badges", {
      p_user_id: userId,
    });
    if (error) {
      const lower = error.message.toLowerCase();
      if (lower.includes("permission denied: certifications.view")) {
        return NextResponse.json([]);
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Failed to load badges" }, { status: 500 });
  }
}
