import { NextResponse } from "next/server";
import type { ApprovalDecisionType } from "@/lib/action-center-approval";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type DecisionBody = {
  decision?: ApprovalDecisionType;
  comment?: string;
  delegate_to?: string;
  conditions?: Record<string, unknown>;
};

const NOTIFICATION_MAP: Partial<
  Record<ApprovalDecisionType, { title: string; priority: string; event: string }>
> = {
  approve: { title: "Action approved", priority: "medium", event: "approval_completed" },
  approve_with_conditions: { title: "Action approved with conditions", priority: "medium", event: "approval_completed" },
  reject: { title: "Action rejected", priority: "high", event: "approval_completed" },
  delegate_review: { title: "Action delegated for review", priority: "medium", event: "action_delegated" },
  escalate: { title: "Action escalated", priority: "high", event: "action_escalated" },
  require_executive_oversight: { title: "Executive oversight required", priority: "high", event: "executive_oversight" },
  request_information: { title: "Additional information requested", priority: "medium", event: "approval_info_requested" },
  return_for_clarification: { title: "Action returned for clarification", priority: "medium", event: "returned_for_clarification" },
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as DecisionBody;
    if (!body.decision) {
      return NextResponse.json({ error: "decision required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_action_center_approval_decision", {
      p_action_id: id,
      p_decision: body.decision,
      p_comment: body.comment ?? null,
      p_delegate_to: body.delegate_to ?? null,
      p_conditions: body.conditions ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const notify = NOTIFICATION_MAP[body.decision];
    if (notify) {
      await supabase.rpc("send_notification", {
        p_user_id: null,
        p_category: "action_required",
        p_priority: notify.priority,
        p_title: notify.title,
        p_message: body.comment ?? null,
        p_action_url: `/app/action-center`,
        p_recommended_action: "Review in Action Center",
        p_delivery_channels: ["in_app", "dashboard"],
        p_metadata: { action_id: id, event: notify.event, decision: body.decision },
      });
    }

    return NextResponse.json(data ?? { recorded: true });
  } catch {
    return NextResponse.json({ error: "Failed to record approval decision" }, { status: 500 });
  }
}
