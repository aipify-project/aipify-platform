import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_business_dna_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const center = data as { knowledge?: unknown[]; knowledge_sources?: unknown[] };
    return NextResponse.json({
      knowledge: center.knowledge ?? [],
      sources: center.knowledge_sources ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Knowledge request failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      category?: string;
      question?: string;
      answer?: string;
      source?: string;
      language?: string;
      approved?: boolean;
    };

    if (!body.category || !body.question || !body.answer) {
      return NextResponse.json({ error: "category, question, and answer required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_support_knowledge_item", {
      p_category: body.category,
      p_question: body.question,
      p_answer: body.answer,
      p_source: body.source ?? "manual",
      p_language: body.language ?? "en",
      p_approved: body.approved ?? false,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data, created: true });
  } catch {
    return NextResponse.json({ error: "Knowledge create failed" }, { status: 500 });
  }
}
