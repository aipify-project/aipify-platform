import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_employee_knowledge_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const center = data as { knowledge_items?: unknown[]; sources?: unknown[] };
    return NextResponse.json({
      knowledge: center.knowledge_items ?? [],
      sources: center.sources ?? [],
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
      title?: string;
      content?: string;
      steps?: unknown[];
      source_type?: string;
      source_reference?: string;
      confidence_score?: number;
      approved?: boolean;
    };

    if (!body.category || !body.title || !body.content) {
      return NextResponse.json({ error: "category, title, and content required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_employee_knowledge_item", {
      p_category: body.category,
      p_title: body.title,
      p_content: body.content,
      p_steps: body.steps ?? [],
      p_source_type: body.source_type ?? "manual",
      p_source_reference: body.source_reference ?? null,
      p_confidence_score: body.confidence_score ?? 50,
      p_approved: body.approved ?? false,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data, created: true });
  } catch {
    return NextResponse.json({ error: "Knowledge create failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action?: string; id?: string };

    if (body.action === "approve" && body.id) {
      const { data, error } = await supabase.rpc("approve_employee_knowledge_item", {
        p_item_id: body.id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Knowledge update failed" }, { status: 500 });
  }
}
