import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePersonalityMessage } from "@/lib/aipify/personality/parse";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      context?: string;
      template_key?: string;
      variables?: Record<string, unknown>;
    };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("render_personality_message", {
      p_context: body.context ?? "greeting",
      p_template_key: body.template_key ?? "greeting.morning",
      p_variables: body.variables ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePersonalityMessage(data));
  } catch {
    return NextResponse.json({ error: "Failed to render message" }, { status: 500 });
  }
}
