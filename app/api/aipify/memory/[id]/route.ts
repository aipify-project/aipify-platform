import { NextResponse } from "next/server";
import {
  parseCompanionMemoryDetail,
  parseCompanionMemoryAction,
} from "@/lib/aipify/companion-memory-engine/parse";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_memory", { p_memory_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCompanionMemoryDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load memory" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title?: string;
      summary?: string;
      content?: string;
      category?: string;
      memory_type?: string;
      memory_scope?: string;
      department?: string;
      confidence?: string;
      approval_status?: string;
      reason?: string;
    };

    const { data, error } = await supabase.rpc("update_companion_memory", {
      p_memory_id:       id,
      p_title:           body.title           ?? null,
      p_summary:         body.summary         ?? null,
      p_content:         body.content         ?? null,
      p_category:        body.category        ?? null,
      p_memory_type:     body.memory_type     ?? null,
      p_memory_scope:    body.memory_scope    ?? null,
      p_department:      body.department      ?? null,
      p_confidence:      body.confidence      ?? null,
      p_approval_status: body.approval_status ?? null,
      p_reason:          body.reason          ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parseCompanionMemoryAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to update memory" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("delete_companion_memory", { p_memory_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parseCompanionMemoryAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to delete memory" }, { status: 500 });
  }
}
