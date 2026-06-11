import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      initiative_id?: string;
      milestone_id?: string;
      user_id?: string;
      learning_path_id?: string;
      due_at?: string;
      metric_type?: string;
      metric_value?: number;
      metric_metadata?: Record<string, unknown>;
      affected_users?: unknown[];
      affected_teams?: unknown[];
      training_requirements?: unknown[];
      communication_needs?: unknown[];
      operational_risks?: unknown[];
    };

    if (body.action === "impact_assessment") {
      if (!body.initiative_id) return NextResponse.json({ error: "initiative_id required" }, { status: 400 });
      const { data, error } = await supabase.rpc("record_change_impact_assessment", {
        p_initiative_id: body.initiative_id,
        p_affected_users: body.affected_users ?? [],
        p_affected_teams: body.affected_teams ?? [],
        p_training_requirements: body.training_requirements ?? [],
        p_communication_needs: body.communication_needs ?? [],
        p_operational_risks: body.operational_risks ?? [],
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "adoption_metric") {
      if (!body.initiative_id || !body.metric_type) {
        return NextResponse.json({ error: "initiative_id and metric_type required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_adoption_metrics", {
        p_initiative_id: body.initiative_id,
        p_metric_type: body.metric_type,
        p_metric_value: body.metric_value ?? 0,
        p_metric_metadata: body.metric_metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "complete_milestone") {
      if (!body.milestone_id) return NextResponse.json({ error: "milestone_id required" }, { status: 400 });
      const { data, error } = await supabase.rpc("complete_change_milestone", {
        p_milestone_id: body.milestone_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "assign_training") {
      if (!body.initiative_id || !body.user_id) {
        return NextResponse.json({ error: "initiative_id and user_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("assign_change_training", {
        p_initiative_id: body.initiative_id,
        p_user_id: body.user_id,
        p_learning_path_id: body.learning_path_id ?? null,
        p_due_at: body.due_at ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process review action" }, { status: 500 });
  }
}
