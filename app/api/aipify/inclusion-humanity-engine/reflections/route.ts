import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      reflection_id?: string;
      action?: "acknowledge" | "dismiss";
    };
    if (!body.reflection_id) {
      return NextResponse.json({ error: "reflection_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("acknowledge_inclusion_reflection", {
      p_reflection_id: body.reflection_id,
      p_action: body.action ?? "acknowledge",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update reflection" }, { status: 500 });
  }
}
