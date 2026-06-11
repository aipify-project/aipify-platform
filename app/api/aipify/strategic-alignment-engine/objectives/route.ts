import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      objective_id?: string;
      objective_name?: string;
      description?: string;
      owner_user_id?: string;
      priority?: string;
      status?: string;
      target_date?: string;
      link_type?: string;
      linked_entity_id?: string;
      metadata?: Record<string, unknown>;
    };

    if (body.action === "update") {
      if (!body.objective_id) {
        return NextResponse.json({ error: "objective_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_strategic_objective", {
        p_objective_id: body.objective_id,
        p_objective_name: body.objective_name ?? null,
        p_description: body.description ?? null,
        p_owner_user_id: body.owner_user_id ?? null,
        p_priority: body.priority ?? null,
        p_status: body.status ?? null,
        p_target_date: body.target_date ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "link") {
      if (!body.objective_id || !body.link_type || !body.linked_entity_id) {
        return NextResponse.json(
          { error: "objective_id, link_type, and linked_entity_id required" },
          { status: 400 }
        );
      }
      const { data, error } = await supabase.rpc("link_objective_entity", {
        p_objective_id: body.objective_id,
        p_link_type: body.link_type,
        p_linked_entity_id: body.linked_entity_id,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.objective_name) {
      return NextResponse.json({ error: "objective_name required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_strategic_objective", {
      p_objective_name: body.objective_name,
      p_description: body.description ?? null,
      p_owner_user_id: body.owner_user_id ?? null,
      p_priority: body.priority ?? "medium",
      p_status: body.status ?? "planned",
      p_target_date: body.target_date ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process objective action" }, { status: 500 });
  }
}
