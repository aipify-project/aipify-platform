import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as {
      phrase_key?: string;
      language?: string;
      variables?: Record<string, string>;
    };
    if (!body.phrase_key) {
      return NextResponse.json({ error: "phrase_key required" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("render_assistant_phrase", {
      p_phrase_key: body.phrase_key,
      p_language: body.language ?? "en",
      p_variables: body.variables ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ text: data });
  } catch {
    return NextResponse.json({ error: "Failed to render phrase" }, { status: 500 });
  }
}
