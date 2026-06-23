"use client";

import Link from "next/link";
import { useOptionalCompanionExperience } from "./CompanionExperienceProvider";
import { useOptionalUnifiedNotificationFeed } from "@/components/presence/UnifiedNotificationFeedProvider";
import type { PresenceNotification } from "@/lib/presence/notification-state";

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

export function CompanionReplyReadyToast() {
  const companion = useOptionalCompanionExperience();
  const feed = useOptionalUnifiedNotificationFeed();
  const labels = companion?.labels;
  const toast = feed?.toastNotification ?? null;

  if (!toast || !labels || !feed) return null;

  const href = toast.action_href ?? undefined;
  const conversationId = parseConversationId(toast);

  async function dismiss(notificationId: string) {
    await feed!.dismissNotification(notificationId);
  }

  function openReply(notification: PresenceNotification) {
    const conversationId = parseConversationId(notification);
    const href = notification.action_href ?? undefined;

    if (companion && conversationId) {
      companion.openDrawerWithConversation(conversationId);
      void feed!.markNotificationRead(notification.id);
      feed!.suppressToast(notification.id);
      return;
    }

    if (href) {
      void feed!.openNotification(notification);
      return;
    }

    void dismiss(notification.id);
  }

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
                onClick={() => {
                  void feed!.markNotificationRead(toast.id);
                  feed!.suppressToast(toast.id);
                }}
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
