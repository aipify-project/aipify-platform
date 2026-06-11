import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { memory_id?: string };
    if (!body.memory_id) {
      return NextResponse.json({ error: "memory_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("postpone_life_reminder", {
      p_memory_id: body.memory_id,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Postpone failed" }, { status: 500 });
  }
}
