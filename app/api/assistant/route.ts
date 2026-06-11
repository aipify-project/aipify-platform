import { NextResponse } from "next/server";
import { buildAssistantTurn } from "@/lib/assistant-memory/conversation";
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

    return NextResponse.json({
      reply: turn.reply,
      intent: turn.intent,
      memory_intent: turn.memory_intent,
      memoryDraft: turn.memoryDraft,
      followUpOptions: turn.followUpOptions,
      askBeforeRemembering: turn.askBeforeRemembering,
      confidence_level: turn.confidence_level,
      suggestLifeDashboard: turn.suggestLifeDashboard ?? false,
    });
  } catch {
    return NextResponse.json({ error: "Assistant request failed" }, { status: 500 });
  }
}
