"use client";

import { formatAttachmentByteSize } from "@/lib/app/companion/attachments";
import type { CompanionChatAttachmentSummary, CompanionExperienceLabels } from "@/lib/app/companion/types";
import { CompanionUserMessageIdentityIcon } from "./CompanionUserMessageIdentityIcon";

type CompanionUserMessageCardProps = {
  messageId: string;
  content: string;
  attachments?: CompanionChatAttachmentSummary[];
  labels: CompanionExperienceLabels;
  spacious?: boolean;
};

/** Frozen Core user-message card — lighter than assistant cards; no feedback controls. */
export function CompanionUserMessageCard({
  messageId,
  content,
  attachments,
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
          {attachments && attachments.length > 0 ? (
            <ul className="mb-3 flex flex-col gap-2">
              {attachments.map((attachment) => (
                <li
                  key={attachment.attachment_id}
                  className="flex items-center gap-2 rounded-lg border border-aipify-border bg-white p-2"
                >
                  {attachment.preview_url && attachment.category === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={attachment.preview_url}
                      alt={labels.attachments.previewAlt.replace("{filename}", attachment.filename)}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-violet-50 text-[10px] font-semibold text-violet-700">
                      {attachment.category.toUpperCase().slice(0, 3)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-aipify-text">{attachment.filename}</p>
                    <p className="text-[11px] text-aipify-text-muted">
                      {formatAttachmentByteSize(attachment.byte_size)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
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
