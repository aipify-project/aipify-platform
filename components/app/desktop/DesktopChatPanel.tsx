"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { parseDesktopChatHistory, type DesktopChatMessage } from "@/lib/aipify/desktop";

type DesktopChatPanelProps = {
  labels: Record<string, string>;
  enabled?: boolean;
};

export function DesktopChatPanel({ labels, enabled = true }: DesktopChatPanelProps) {
  const [messages, setMessages] = useState<DesktopChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/desktop/chat");
    if (res.ok) setMessages(parseDesktopChatHistory(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || sending || !enabled) return;
    setSending(true);
    const res = await fetch("/api/aipify/desktop/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input.trim() }),
    });
    if (res.ok) {
      setInput("");
      await refresh();
    }
    setSending(false);
  }

  if (!enabled) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500">
        {labels.disabled}
      </section>
    );
  }

  return (
    <section className="flex flex-col rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold">{labels.title}</h2>
        <p className="text-xs text-gray-500">{labels.hint}</p>
      </div>
      <div className="max-h-80 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.empty}</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block max-w-[85%] rounded-lg px-3 py-2 ${
                  m.role === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.content}
                {m.action_href ? (
                  <Link href={m.action_href} className="mt-1 block text-xs underline">
                    {labels.openLink}
                  </Link>
                ) : null}
              </span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 border-t border-gray-100 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void send()}
          placeholder={labels.placeholder}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          disabled={sending}
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={sending || !input.trim()}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {labels.send}
        </button>
      </div>
    </section>
  );
}
