import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      prompt_id?: string;
      action?: "explore" | "dismiss";
    };
    if (!body.prompt_id) {
      return NextResponse.json({ error: "prompt_id required" }, { status: 400 });
    }

    const rpc =
      body.action === "dismiss" ? "dismiss_discovery_prompt" : "explore_discovery_prompt";
    const { data, error } = await supabase.rpc(rpc, {
      p_prompt_id: body.prompt_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
  }
}
