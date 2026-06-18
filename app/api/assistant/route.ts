import { NextResponse } from "next/server";
import { buildAssistantTurn } from "@/lib/assistant-memory/conversation";
import {
  DEVELOPER_LOW_CONFIDENCE_NOTE,
  isAipifyKnowledgeQuestion,
  isDeveloperKnowledgeQuestion,
  parseKnowledgeAnswer,
} from "@/lib/aipify/knowledge";
import { adaptReplyToIdentity } from "@/lib/identity-engine/adapt";
import { parseIdentityCenter } from "@/lib/identity-engine/parse";
import { adaptReplyToBrandIdentity } from "@/lib/internal-language-model/brand-identity";
import {
  adaptReplyToLearningJourney,
  detectLearningCapabilityQuestion,
  getLearningJourneyResponse,
} from "@/lib/internal-language-model/learning-journey-vocabulary";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Dictionary } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";

function adaptFinalReply(
  reply: string,
  identity: ReturnType<typeof parseIdentityCenter>,
  options?: {
    userMessage?: string;
    confidenceLevel?: "high" | "medium" | "low";
  }
): string {
  const useJourneyResponse =
    options?.userMessage &&
    detectLearningCapabilityQuestion(options.userMessage) &&
    options.confidenceLevel === "low";

  const base = useJourneyResponse ? getLearningJourneyResponse() : reply;
  const branded = adaptReplyToBrandIdentity(base);
  const journeyAdjusted = adaptReplyToLearningJourney(branded);
  return identity.profile
    ? adaptReplyToIdentity(journeyAdjusted, identity.profile, identity.user_name)
    : journeyAdjusted;
}

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
      confirmFocus?: boolean;
      focusProposal?: {
        title: string;
        session_type?: string;
        ends_at_hint?: string | null;
      };
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

    if (body.confirmFocus && body.focusProposal?.title) {
      const endsAt = body.focusProposal.ends_at_hint === "noon"
        ? new Date(new Date().setHours(12, 0, 0, 0)).toISOString()
        : body.focusProposal.ends_at_hint === "evening"
          ? new Date(new Date().setHours(18, 0, 0, 0)).toISOString()
          : null;

      const { data, error } = await supabase.rpc("activate_focus_mode", {
        p_title: body.focusProposal.title,
        p_session_type: body.focusProposal.session_type ?? "deep_work",
        p_ends_at: endsAt,
        p_linked_goal_id: null,
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      return NextResponse.json({
        reply:
          "Focus mode is on. Non-essential interruptions are reduced — your time is protected.",
        focusSessionId: data,
        saved: true,
      });
    }

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

    const locale = await getLocale();
    const dictionary = await getCustomerAppDictionaryForSplits(locale, ["companion", "core", "dashboard"]);
    const t = createTranslator(dictionary.customerApp as Dictionary);

    const useDeveloperKnowledge = isDeveloperKnowledgeQuestion(message);
    const useKnowledgeCenter = useDeveloperKnowledge || isAipifyKnowledgeQuestion(message);

    if (useKnowledgeCenter) {
      const { data: knowledgeAnswer, error: knowledgeError } = await supabase.rpc(
        useDeveloperKnowledge ? "retrieve_developer_knowledge_answer" : "retrieve_knowledge_answer",
        {
          p_query: message,
          p_language: "en",
          p_visibility_context: "authenticated",
          p_source_type: useDeveloperKnowledge ? "developer_assistant" : "admin_chat",
        }
      );

      if (!knowledgeError && knowledgeAnswer) {
        const parsed = parseKnowledgeAnswer(knowledgeAnswer);
        if (parsed.answered && parsed.answer) {
          const { data: identityCenter } = await supabase.rpc("get_customer_identity_center");
          const identity = parseIdentityCenter(identityCenter);
          const confidenceLevel = parsed.confidence_score >= 0.65 ? "high" : "medium";
          const reply = adaptFinalReply(parsed.answer, identity, {
            userMessage: message,
            confidenceLevel,
          });

          return NextResponse.json({
            reply,
            intent: useDeveloperKnowledge ? "developer" : "general",
            confidence_level: confidenceLevel,
            knowledge_center: true,
            developer_knowledge: useDeveloperKnowledge,
            articles_used: parsed.articles_used,
            created_gap_id: parsed.created_gap_id,
          });
        }

        if (parsed.fallback_message) {
          const { data: identityCenter } = await supabase.rpc("get_customer_identity_center");
          const identity = parseIdentityCenter(identityCenter);
          const rawReply = parsed.answer
            ? `${parsed.answer}\n\n${parsed.fallback_message}`
            : parsed.fallback_message;
          const reply = adaptFinalReply(rawReply, identity, {
            userMessage: message,
            confidenceLevel: "low",
          });

          const lowConfidenceReply =
            useDeveloperKnowledge && parsed.should_escalate
              ? `${reply}\n\n${DEVELOPER_LOW_CONFIDENCE_NOTE}`
              : reply;

          return NextResponse.json({
            reply: lowConfidenceReply,
            intent: useDeveloperKnowledge ? "developer" : "general",
            confidence_level: "low",
            knowledge_center: true,
            developer_knowledge: useDeveloperKnowledge,
            created_gap_id: parsed.created_gap_id,
            should_escalate: parsed.should_escalate,
          });
        }
      }
    }

    const turn = buildAssistantTurn(message, askBeforeRemembering, { translate: t });

    const { data: identityCenter } = await supabase.rpc("get_customer_identity_center");
    const identity = parseIdentityCenter(identityCenter);
    const reply = adaptFinalReply(turn.reply, identity, {
      userMessage: message,
      confidenceLevel: turn.confidence_level,
    });

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
      suggestAttentionDashboard: turn.suggestAttentionDashboard ?? false,
      focusProposal: turn.focusProposal ?? null,
      suggestDecisionsDashboard: turn.suggestDecisionsDashboard ?? false,
      decisionGuidance: turn.decisionGuidance ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Assistant request failed" }, { status: 500 });
  }
}
