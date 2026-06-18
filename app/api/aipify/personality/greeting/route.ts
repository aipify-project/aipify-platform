import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePersonalityMessage } from "@/lib/aipify/personality/parse";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("generate_warm_greeting", {
      p_task_count: Number(searchParams.get("task_count") ?? 3),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePersonalityMessage(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate greeting" }, { status: 500 });
  }
}
