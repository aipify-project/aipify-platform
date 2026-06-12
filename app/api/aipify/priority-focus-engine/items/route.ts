import { NextResponse } from "next/server";
import { parsePriorityFocusItems } from "@/lib/aipify/priority-focus-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "active";
    const priorityLevel = searchParams.get("priority_level");
    const { data, error } = await supabase.rpc("list_priority_focus_items", {
      p_status: status,
      p_priority_level: priorityLevel ? Number(priorityLevel) : null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePriorityFocusItems(data));
  } catch {
    return NextResponse.json({ error: "Failed to list items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      item_id?: string;
      dimension?: string;
      priority_level?: number;
      title?: string;
      summary?: string;
      status?: string;
      due_hint?: string;
      metadata?: Record<string, unknown>;
    };

    if (body.action === "update") {
      if (!body.item_id) {
        return NextResponse.json({ error: "item_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_priority_focus_item", {
        p_item_id: body.item_id,
        p_payload: {
          dimension: body.dimension,
          priority_level: body.priority_level,
          title: body.title,
          summary: body.summary,
          status: body.status,
          due_hint: body.due_hint,
          metadata: body.metadata ?? {},
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.title || !body.summary) {
      return NextResponse.json({ error: "title and summary required" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("create_priority_focus_item", {
      p_payload: {
        dimension: body.dimension ?? "operational",
        priority_level: body.priority_level ?? 3,
        title: body.title,
        summary: body.summary,
        status: body.status ?? "active",
        due_hint: body.due_hint,
        metadata: body.metadata ?? {},
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process item action" }, { status: 500 });
  }
}
