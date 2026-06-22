"use client";

import type { CompanionChatMessage, CompanionExperienceLabels } from "@/lib/app/companion/types";
import { CompanionIcon } from "./CompanionIcon";
import { CompanionChatMessageItem } from "./CompanionChatMessageItem";

type CompanionChatProps = {
  messages: CompanionChatMessage[];
  loading: boolean;
  labels: CompanionExperienceLabels;
  spacious?: boolean;
  conversationId: string;
  locale: string;
  pathname: string;
  canConfirmOrg: boolean;
  /** Optional per-surface override for companionUserMessageCardV1 — default follows Core policy (off). */
  userMessageCardV1?: boolean;
  onMessageFeedback?: (
    messageId: string,
    feedback: Exclude<CompanionChatMessage["feedback"], null | undefined>,
  ) => void;
  onEscalate?: () => void;
};

export function CompanionChat({
  messages,
  loading,
  labels,
  spacious,
  conversationId,
  locale,
  pathname,
  canConfirmOrg,
  userMessageCardV1,
  onMessageFeedback,
  onEscalate,
}: CompanionChatProps) {
  if (messages.length === 0 && !loading) return null;

  return (
    <section className={spacious ? "space-y-6" : "mt-6 space-y-4"} aria-live="polite">
      {messages.map((msg) => (
        <CompanionChatMessageItem
          key={msg.id}
          msg={msg}
          labels={labels}
          spacious={spacious}
          conversationId={conversationId}
          locale={locale}
          pathname={pathname}
          canConfirmOrg={canConfirmOrg}
          userMessageCardV1={userMessageCardV1}
          onMessageFeedback={onMessageFeedback}
          onEscalate={onEscalate}
        />
      ))}

      {loading ? (
        <div className="flex items-start gap-3">
          <CompanionIcon size={32} availabilityRing ariaLabel={labels.ariaCompanionAvailable} className="mt-1 shrink-0" />
          <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3">
            <span className="sr-only">{labels.verifiedContext}</span>
            <div className="flex gap-1" aria-hidden="true">
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
