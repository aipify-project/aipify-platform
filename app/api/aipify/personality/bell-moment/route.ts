import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBellMoment } from "@/lib/aipify/personality";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_playful_bell_moment", {
      p_context: searchParams.get("context") ?? "task_complete",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const moment = parseBellMoment(data);
    if (!moment) return NextResponse.json({ moment: null });
    return NextResponse.json({ moment });
  } catch {
    return NextResponse.json({ error: "Failed to get bell moment" }, { status: 500 });
  }
}
