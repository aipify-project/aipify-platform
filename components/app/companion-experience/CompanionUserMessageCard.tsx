"use client";

import type { CompanionExperienceLabels } from "@/lib/app/companion/types";
import { CompanionUserMessageIdentityIcon } from "./CompanionUserMessageIdentityIcon";

type CompanionUserMessageCardProps = {
  messageId: string;
  content: string;
  labels: CompanionExperienceLabels;
  spacious?: boolean;
};

/** Frozen Core user-message card — lighter than assistant cards; no feedback controls. */
export function CompanionUserMessageCard({
  messageId,
  content,
  labels,
  spacious,
}: CompanionUserMessageCardProps) {
  return (
    <article
      aria-labelledby={`companion-user-message-${messageId}`}
      className="flex max-w-full justify-end"
    >
      <div className="flex max-w-[min(100%,42rem)] items-start justify-end gap-3">
        <div
          className={`min-w-0 flex-1 rounded-2xl rounded-br-md border border-aipify-border bg-aipify-surface-muted shadow-sm ${
            spacious ? "px-5 py-4" : "px-4 py-3"
          }`}
        >
          <p
            id={`companion-user-message-${messageId}`}
            className="whitespace-pre-line text-sm leading-relaxed text-aipify-text"
          >
            {content}
          </p>
          <span className="sr-only">{labels.ariaUserMessage}</span>
        </div>
        <CompanionUserMessageIdentityIcon
          className="mt-1"
          ariaLabel={labels.ariaUserMessageIdentity}
        />
      </div>
    </article>
  );
}
