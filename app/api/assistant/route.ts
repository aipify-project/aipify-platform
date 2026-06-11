import { NextResponse } from "next/server";
import { buildAssistantTurn } from "@/lib/assistant-memory/conversation";
import { adaptReplyToIdentity } from "@/lib/identity-engine/adapt";
import { parseIdentityCenter } from "@/lib/identity-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      message?: string;
      confirmMemory?: boolean;
      confirmEvent?: boolean;
      confirmGoal?: boolean;
      goalDraft?: {
        title: string;
        description?: string;
        why_matters?: string;
        category?: string;
        timeframe?: string;
        accountability_level?: string;
      };
      eventDraft?: {
        title: string;
        description?: string;
        event_type?: string;
        calendar_purpose?: string;
        starts_at?: string | null;
        all_day?: boolean;
        connection_id?: string | null;
      };
      memoryDraft?: {
        category: string;
        title: string;
        summary: string;
        event_date?: string | null;
        intent_key?: string;
        reminder_offsets?: string[];
        recurrence?: string | null;
        source?: string;
        confidence_level?: "high" | "medium" | "low";
        person_name?: string | null;
        relationship?: string | null;
      };
    };

    if (body.confirmGoal && body.goalDraft?.title) {
      const draft = body.goalDraft;
      const { data, error } = await supabase.rpc("create_user_goal", {
        p_title: draft.title,
        p_description: draft.description ?? draft.title,
        p_why_matters: draft.why_matters ?? "",
        p_category: draft.category ?? "personal_development",
        p_timeframe: draft.timeframe ?? "medium_term",
        p_accountability_level: draft.accountability_level ?? null,
        p_target_date: null,
        p_auto_milestones: true,
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      return NextResponse.json({
        reply:
          "Your goal is set with milestones to guide you. Open your Goals dashboard anytime — no pressure, your pace.",
        goalId: data,
        saved: true,
      });
    }

    if (body.confirmEvent && body.eventDraft?.title) {
      const draft = body.eventDraft;
      const { data, error } = await supabase.rpc("create_calendar_event", {
        p_title: draft.title,
        p_description: draft.description ?? draft.title,
        p_event_type: draft.event_type ?? "appointment",
        p_calendar_purpose: draft.calendar_purpose ?? "personal",
        p_starts_at: draft.starts_at ?? null,
        p_all_day: draft.all_day ?? false,
        p_connection_id: draft.connection_id ?? null,
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      return NextResponse.json({
        reply: "Added to your calendar. I'll keep it in sync with your context.",
        eventId: data,
        saved: true,
      });
    }

    if (body.confirmMemory && body.memoryDraft) {
      const draft = body.memoryDraft;
      const { data, error } = await supabase.rpc("record_assistant_memory", {
        p_category: draft.category,
        p_title: draft.title,
        p_summary: draft.summary,
        p_event_date: draft.event_date ?? null,
        p_intent_key: draft.intent_key ?? "remember",
        p_reminder_offsets: draft.reminder_offsets ?? [],
        p_recurrence: draft.recurrence ?? null,
        p_source: draft.source ?? "explicit",
        p_confidence_score:
          draft.confidence_level === "high"
            ? 90
            : draft.confidence_level === "medium"
              ? 60
              : 30,
        p_person_name: draft.person_name ?? null,
        p_relationship: draft.relationship ?? null,
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      return NextResponse.json({
        reply: "Saved. I'll help you remember what matters.",
        memoryId: data,
        saved: true,
      });
    }

    const { data: center } = await supabase.rpc("get_customer_assistant_center");
    const askBeforeRemembering =
      typeof center?.ask_before_remembering === "boolean"
        ? center.ask_before_remembering
        : true;

    const message = String(body.message ?? "").trim();
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const turn = buildAssistantTurn(message, askBeforeRemembering);

    const { data: identityCenter } = await supabase.rpc("get_customer_identity_center");
    const identity = parseIdentityCenter(identityCenter);
    const reply =
      identity.profile
        ? adaptReplyToIdentity(turn.reply, identity.profile, identity.user_name)
        : turn.reply;

    return NextResponse.json({
      reply,
      intent: turn.intent,
      memory_intent: turn.memory_intent,
      memoryDraft: turn.memoryDraft,
      followUpOptions: turn.followUpOptions,
      askBeforeRemembering: turn.askBeforeRemembering,
      confidence_level: turn.confidence_level,
      suggestLifeDashboard: turn.suggestLifeDashboard ?? false,
      suggestContextDashboard: turn.suggestContextDashboard ?? false,
      eventDraft: turn.eventDraft ?? null,
      schedulingFollowUp: turn.schedulingFollowUp,
      goalDraft: turn.goalDraft ?? null,
      suggestGoalsDashboard: turn.suggestGoalsDashboard ?? false,
      goalFollowUp: turn.goalFollowUp,
    });
  } catch {
    return NextResponse.json({ error: "Assistant request failed" }, { status: 500 });
  }
}
