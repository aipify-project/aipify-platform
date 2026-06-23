"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import { useOptionalCompanionExperience } from "./CompanionExperienceProvider";

type CompanionReplyReadyToastProps = {
  pollMs?: number;
};

function parseConversationId(notification: PresenceNotification): string | null {
  const href = notification.action_href ?? "";
  if (!href) return null;
  try {
    const url = new URL(href, "https://aipify.local");
    return url.searchParams.get("conversation");
  } catch {
    const match = href.match(/[?&]conversation=([^&]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}

export function CompanionReplyReadyToast({ pollMs = 12000 }: CompanionReplyReadyToastProps) {
  const companion = useOptionalCompanionExperience();
  const labels = companion?.labels;
  const [toast, setToast] = useState<PresenceNotification | null>(null);
  const seenRef = useRef<Set<string>>(new Set());

  const poll = useCallback(async () => {
    const res = await fetch("/api/presence/notifications?limit=10&unread_only=true");
    if (!res.ok) return;
    const data = (await res.json()) as {
      notifications?: PresenceNotification[];
    };
    const candidates = (data.notifications ?? []).filter(
      (item) => item.event_type === "companion_reply_ready" && !item.read_at,
    );
    const next = candidates.find((item) => !seenRef.current.has(item.id));
    if (next) {
      seenRef.current.add(next.id);
      setToast(next);
    }
  }, []);

  useEffect(() => {
    void poll();
    const id = window.setInterval(() => void poll(), pollMs);
    return () => window.clearInterval(id);
  }, [poll, pollMs]);

  async function dismiss(notificationId: string) {
    await fetch(`/api/presence/notifications/${notificationId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "dismiss" }),
    });
    setToast(null);
  }

  function openReply(notification: PresenceNotification) {
    const conversationId = parseConversationId(notification);
    const href = notification.action_href ?? undefined;

    if (companion && conversationId) {
      companion.openDrawerWithConversation(conversationId);
    } else if (href) {
      window.location.assign(href);
    }

    void dismiss(notification.id);
  }

  if (!toast || !labels) return null;

  const href = toast.action_href ?? undefined;
  const conversationId = parseConversationId(toast);

  return (
    <div
      className="pointer-events-none fixed bottom-20 right-4 z-[60] flex max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto rounded-xl border border-violet-200 bg-white p-4 shadow-lg ring-1 ring-violet-100">
        <p className="text-sm font-semibold text-aipify-text">{toast.title}</p>
        {toast.body ? (
          <p className="mt-1 line-clamp-2 text-sm text-aipify-text-secondary">{toast.body}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {href ? (
            companion && conversationId ? (
              <button
                type="button"
                onClick={() => openReply(toast)}
                className="rounded-lg bg-aipify-companion px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
              >
                {labels.replyToast.viewReply}
              </button>
            ) : (
              <Link
                href={href}
                onClick={() => void dismiss(toast.id)}
                className="rounded-lg bg-aipify-companion px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
              >
                {labels.replyToast.openConversation}
              </Link>
            )
          ) : null}
          <button
            type="button"
            onClick={() => void dismiss(toast.id)}
            className="rounded-lg border border-aipify-border px-3 py-1.5 text-xs text-aipify-text-secondary hover:bg-aipify-surface-muted"
          >
            {labels.replyToast.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
