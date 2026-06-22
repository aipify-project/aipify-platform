"use client";

import type { CompanionChatMessage, CompanionExperienceLabels } from "@/lib/app/companion/types";
import Link from "next/link";
import { CompanionIcon } from "./CompanionIcon";
import { CompanionAnswerFeedback } from "./CompanionAnswerFeedback";
import { CompanionIntegrationStatusCard } from "./CompanionIntegrationStatusCard";
import { CompanionPlatformSnapshotCard } from "./CompanionPlatformSnapshotCard";

function ctaClassName(variant?: "primary" | "secondary"): string {
  const base = "inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-colors";
  if (variant === "primary") {
    return `${base} bg-aipify-companion text-white hover:bg-violet-700`;
  }
  if (variant === "secondary") {
    return `${base} border border-aipify-border bg-white text-aipify-text hover:bg-aipify-surface-muted`;
  }
  return `${base} bg-violet-50 text-aipify-companion hover:bg-violet-100`;
}

type CompanionChatProps = {
  messages: CompanionChatMessage[];
  loading: boolean;
  labels: CompanionExperienceLabels;
  spacious?: boolean;
  conversationId: string;
  locale: string;
  pathname: string;
  canConfirmOrg: boolean;
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
  onMessageFeedback,
  onEscalate,
}: CompanionChatProps) {
  if (messages.length === 0 && !loading) return null;

  return (
    <section className={spacious ? "space-y-6" : "mt-6 space-y-4"} aria-live="polite">
      {messages.map((msg) =>
        msg.role === "user" ? (
          <div key={msg.id} className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-slate-100 px-4 py-3 text-sm text-aipify-text">
              {msg.content}
            </div>
          </div>
        ) : (
          <div key={msg.id} className="flex items-start gap-3">
            <CompanionIcon size={32} availabilityRing ariaLabel={labels.ariaCompanionAvailable} className="mt-1 shrink-0" />
            <div
              className={`max-w-[90%] rounded-2xl rounded-bl-md border border-violet-100 bg-white shadow-sm ${
                spacious ? "px-5 py-4" : "px-4 py-3"
              }`}
            >
              {(() => {
                const hideIntro =
                  Boolean(msg.integrationStatusCard || msg.platformSnapshotCard) &&
                  msg.directAnswer ===
                    (msg.integrationStatusCard?.labels.cardSupporting ??
                      msg.platformSnapshotCard?.labels.cardSupporting);
                if (hideIntro || !msg.directAnswer) return null;
                return <p className="text-sm text-aipify-text">{msg.directAnswer}</p>;
              })()}
              {!msg.directAnswer && !msg.integrationStatusCard && !msg.platformSnapshotCard ? (
                <p className="text-sm text-aipify-text">{msg.content}</p>
              ) : null}
              {msg.platformSnapshotCard ? (
                <CompanionPlatformSnapshotCard card={msg.platformSnapshotCard} locale={locale} />
              ) : null}
              {msg.integrationStatusCard ? (
                <CompanionIntegrationStatusCard card={msg.integrationStatusCard} locale={locale} />
              ) : null}
              {msg.explanation ? (
                <p className="mt-2 text-sm text-aipify-text-secondary">{msg.explanation}</p>
              ) : null}
              {msg.steps && msg.steps.length > 0 ? (
                <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-aipify-text-secondary">
                  {msg.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              ) : null}
              {msg.ctas && msg.ctas.length > 0 ? (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {msg.ctas.map((cta) => (
                    <Link
                      key={cta.href + cta.label}
                      href={cta.href}
                      className={`${ctaClassName(cta.variant)} w-full sm:w-auto`}
                    >
                      {cta.label}
                    </Link>
                  ))}
                </div>
              ) : null}
              <CompanionAnswerFeedback
                labels={labels}
                conversationId={conversationId}
                messageId={msg.id}
                question={msg.question ?? ""}
                answerSummary={msg.directAnswer ?? msg.integrationStatusCard?.labels.cardSupporting ?? msg.content}
                sources={msg.sources ?? []}
                routeContext={pathname}
                locale={locale}
                canConfirmOrg={canConfirmOrg}
                orgConfirmEligible={msg.orgConfirmEligible}
                orgConfirmBlockedReason={msg.orgConfirmBlockedReason}
                initialFeedback={msg.feedback ?? null}
                showSupportEscalation={msg.showSupportEscalation}
                hideSourcesToggle={Boolean(msg.integrationStatusCard || msg.platformSnapshotCard)}
                onFeedback={(feedback) => {
                  if (feedback) onMessageFeedback?.(msg.id, feedback);
                }}
                onEscalate={onEscalate}
              />
            </div>
          </div>
        ),
      )}

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
