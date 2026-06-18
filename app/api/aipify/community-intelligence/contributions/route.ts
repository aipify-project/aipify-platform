import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommunityActionResult } from "@/lib/aipify/community-intelligence/parse";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { type?: string; title?: string; description?: string };
    if (!body.type || !body.title || !body.description) {
      return NextResponse.json({ error: "type, title, and description are required" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("submit_community_contribution", {
      p_type: body.type,
      p_title: body.title,
      p_description: body.description,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommunityActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to submit contribution" }, { status: 500 });
  }
}
