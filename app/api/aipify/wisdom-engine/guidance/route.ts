import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      prompt_id?: string;
      action?: "review" | "dismiss";
    };
    if (!body.prompt_id) {
      return NextResponse.json({ error: "prompt_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("review_wisdom_guidance_prompt", {
      p_prompt_id: body.prompt_id,
      p_action: body.action ?? "review",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to review guidance prompt" }, { status: 500 });
  }
}
