"use client";

import type { ReactNode } from "react";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";

type NotificationPreferenceToggleCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onLabel: string;
  offLabel: string;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
  footer?: ReactNode;
  testId?: string;
};

export function NotificationPreferenceToggleCard({
  icon,
  title,
  description,
  enabled,
  onLabel,
  offLabel,
  onToggle,
  disabled = false,
  footer,
  testId,
}: NotificationPreferenceToggleCardProps) {
  return (
    <article
      className="flex h-full flex-col rounded-xl border border-aipify-border bg-white p-4 shadow-sm"
      data-testid={testId}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aipify-surface-muted text-aipify-companion"
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-aipify-text">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-aipify-text-secondary">{description}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`${title}: ${enabled ? onLabel : offLabel}`}
                disabled={disabled}
                onClick={() => onToggle(!enabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aipify-companion disabled:cursor-not-allowed disabled:opacity-50 ${
                  enabled ? "bg-aipify-companion" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                    enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <AipifyStatusBadge
                kind={enabled ? "verified" : "not_allowed"}
                label={enabled ? onLabel : offLabel}
              />
            </div>
          </div>
        </div>
      </div>
      {footer ? <div className="mt-4 border-t border-aipify-border pt-4">{footer}</div> : null}
    </article>
  );
}
