"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AipifyOrb } from "@/components/branding";
import type { MemoryDraft } from "@/lib/assistant-memory/conversation";
import type { EventDraft } from "@/lib/context-engine/types";
import type { GoalDraft } from "@/lib/goals-dreams-engine/types";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AssistantChatPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    confirm: string;
    decline: string;
    viewMemories: string;
    viewLife: string;
    viewRelationships: string;
    viewIdentity: string;
    viewContext: string;
    viewCalendars: string;
    confirmEvent: string;
    confirmGoal: string;
    confirmFocus: string;
    viewGoals: string;
    viewAttention: string;
    viewDecisions: string;
    proactiveTitle: string;
    loading: string;
    orbLabel: string;
  };
  proactiveSuggestions?: Array<{ id: string; message: string }>;
};

export function AssistantChatPanel({
  labels,
  proactiveSuggestions = [],
}: AssistantChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingDraft, setPendingDraft] = useState<MemoryDraft | null>(null);
  const [pendingEvent, setPendingEvent] = useState<EventDraft | null>(null);
  const [pendingGoal, setPendingGoal] = useState<GoalDraft | null>(null);
  const [pendingFocus, setPendingFocus] = useState<{
    title: string;
    session_type: string;
    ends_at_hint: string | null;
  } | null>(null);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, pendingDraft, pendingEvent, pendingGoal, pendingFocus, scrollToEnd]);

  async function sendMessage(
    text: string,
    confirmMemory = false,
    confirmEvent = false,
    confirmGoal = false,
    confirmFocus = false
  ) {
    if (!text.trim() && !confirmMemory && !confirmEvent && !confirmGoal && !confirmFocus) return;
    setSending(true);

    if (!confirmMemory && !confirmEvent && !confirmGoal && !confirmFocus) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: text.trim() },
      ]);
      setInput("");
    }

    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        confirmFocus && pendingFocus
          ? { confirmFocus: true, focusProposal: pendingFocus }
          : confirmGoal && pendingGoal
          ? { confirmGoal: true, goalDraft: pendingGoal }
          : confirmEvent && pendingEvent
          ? { confirmEvent: true, eventDraft: pendingEvent }
          : confirmMemory && pendingDraft
            ? {
                confirmMemory: true,
                memoryDraft: {
                  category: pendingDraft.category,
                  title: pendingDraft.title,
                  summary: pendingDraft.summary,
                  event_date: pendingDraft.event_date,
                  intent_key: pendingDraft.intent,
                  reminder_offsets: pendingDraft.reminder_offsets,
                  recurrence: pendingDraft.recurrence,
                  source: "explicit",
                  confidence_level: pendingDraft.confidence_level,
                  person_name: pendingDraft.person_name,
                  relationship: pendingDraft.relationship,
                },
              }
            : { message: text }
      ),
    });

    const data = await res.json();
    setSending(false);

    if (data.reply) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: data.reply },
      ]);
    }

    if (data.saved) {
      setPendingDraft(null);
      setPendingEvent(null);
      setPendingGoal(null);
      setPendingFocus(null);
      return;
    }

    if (data.focusProposal) {
      setPendingFocus(data.focusProposal as typeof pendingFocus);
      setPendingDraft(null);
      setPendingEvent(null);
      setPendingGoal(null);
    } else if (data.goalDraft) {
      setPendingGoal(data.goalDraft as GoalDraft);
      setPendingDraft(null);
      setPendingEvent(null);
      setPendingFocus(null);
    } else if (data.eventDraft) {
      setPendingEvent(data.eventDraft as EventDraft);
      setPendingDraft(null);
      setPendingGoal(null);
      setPendingFocus(null);
    } else if (data.memoryDraft) {
      setPendingDraft(data.memoryDraft as MemoryDraft);
      setPendingEvent(null);
      setPendingGoal(null);
      setPendingFocus(null);
    } else if (!confirmMemory && !confirmEvent && !confirmGoal && !confirmFocus) {
      setPendingDraft(null);
      setPendingEvent(null);
      setPendingGoal(null);
      setPendingFocus(null);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <AipifyOrb
          size={40}
          status="online"
          title={labels.orbLabel}
          aria-label={labels.orbLabel}
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="text-sm text-gray-600">{labels.subtitle}</p>
        </div>
      </div>

      {proactiveSuggestions.length > 0 && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
            {labels.proactiveTitle}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-indigo-900">
            {proactiveSuggestions.map((item) => (
              <li key={item.id}>{item.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex min-h-[320px] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-sm text-gray-500">{labels.subtitle}</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {pendingFocus && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="font-medium text-gray-900">{pendingFocus.title}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => void sendMessage("", false, false, false, true)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
                >
                  {labels.confirmFocus}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingFocus(null)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700"
                >
                  {labels.decline}
                </button>
              </div>
            </div>
          )}
          {pendingGoal && !pendingFocus && (
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm">
              <p className="font-medium text-gray-900">{pendingGoal.title}</p>
              {pendingGoal.needs_clarification && pendingGoal.clarification_question && (
                <p className="mt-1 text-gray-600">{pendingGoal.clarification_question}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {!pendingGoal.needs_clarification && (
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => void sendMessage("", false, false, true)}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
                  >
                    {labels.confirmGoal}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPendingGoal(null)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700"
                >
                  {labels.decline}
                </button>
              </div>
            </div>
          )}
          {pendingEvent && !pendingGoal && !pendingFocus && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm">
              <p className="font-medium text-gray-900">{pendingEvent.title}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => void sendMessage("", false, true)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
                >
                  {labels.confirmEvent}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingEvent(null)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700"
                >
                  {labels.decline}
                </button>
              </div>
            </div>
          )}
          {pendingDraft && !pendingEvent && !pendingGoal && !pendingFocus && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
              <p className="font-medium text-gray-900">{pendingDraft.title}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => void sendMessage("", true)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
                >
                  {labels.confirm}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDraft(null)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700"
                >
                  {labels.decline}
                </button>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="flex gap-2 border-t border-gray-100 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={labels.placeholder}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {sending ? labels.loading : labels.send}
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/app/assistant/decisions" className="text-sm text-indigo-600 hover:underline">
          {labels.viewDecisions}
        </Link>
        <Link href="/app/assistant/attention" className="text-sm text-indigo-600 hover:underline">
          {labels.viewAttention}
        </Link>
        <Link href="/app/assistant/goals" className="text-sm text-indigo-600 hover:underline">
          {labels.viewGoals}
        </Link>
        <Link href="/app/assistant/context" className="text-sm text-indigo-600 hover:underline">
          {labels.viewContext}
        </Link>
        <Link href="/app/assistant/calendars" className="text-sm text-indigo-600 hover:underline">
          {labels.viewCalendars}
        </Link>
        <Link href="/app/assistant/identity" className="text-sm text-indigo-600 hover:underline">
          {labels.viewIdentity}
        </Link>
        <Link href="/app/assistant/relationships" className="text-sm text-indigo-600 hover:underline">
          {labels.viewRelationships}
        </Link>
        <Link href="/app/assistant/life" className="text-sm text-indigo-600 hover:underline">
          {labels.viewLife}
        </Link>
        <Link href="/app/assistant/memory" className="text-sm text-indigo-600 hover:underline">
          {labels.viewMemories}
        </Link>
      </div>
    </div>
  );
}
