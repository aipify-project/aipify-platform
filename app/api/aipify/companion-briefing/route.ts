import { NextResponse } from "next/server";
import {
  isCompanionBriefingContext,
  parseCompanionContextBriefing,
} from "@/lib/aipify/briefing";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context") ?? "home";

    if (!isCompanionBriefingContext(context)) {
      return NextResponse.json({ error: "Invalid briefing context" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_context_briefing", {
      p_context: context,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(parseCompanionContextBriefing(data));
  } catch {
    return NextResponse.json({ error: "Failed to load companion briefing" }, { status: 500 });
  }
}
