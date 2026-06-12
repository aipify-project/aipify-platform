import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      contribution_type?: string;
      title?: string;
      summary?: string;
      industry_tag?: string;
    };

    if (!body.contribution_type || !body.title || !body.summary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("submit_knowledge_exchange_contribution", {
      p_contribution_type: body.contribution_type,
      p_title: body.title,
      p_summary: body.summary,
      p_industry_tag: body.industry_tag ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ contribution_id: data });
  } catch {
    return NextResponse.json({ error: "Failed to submit contribution" }, { status: 500 });
  }
}
