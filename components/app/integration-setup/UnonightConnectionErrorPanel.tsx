"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { UnonightConnectionErrorPanelLabels } from "@/lib/unonight/connection/error-panel";

type UnonightConnectionErrorPanelProps = {
  labels: UnonightConnectionErrorPanelLabels;
  onRetry?: () => void;
  retryDisabled?: boolean;
};

export function UnonightConnectionErrorPanel({
  labels,
  onRetry,
  retryDisabled,
}: UnonightConnectionErrorPanelProps) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50/60 p-5"
      role="alert"
      aria-labelledby="unonight-connection-error-title"
    >
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h3 id="unonight-connection-error-title" className="font-semibold text-red-900">
              {labels.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-red-800">{labels.body}</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {onRetry ? (
              <button
                type="button"
                disabled={retryDisabled}
                onClick={onRetry}
                className={`rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${AppPremiumShell.focusRing}`}
              >
                {labels.retry}
              </button>
            ) : null}
            <button
              type="button"
              className={`rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-900 ${AppPremiumShell.focusRing}`}
              onClick={() => {
                const apiKeyInput = document.getElementById("api-key-input");
                apiKeyInput?.focus();
                apiKeyInput?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              {labels.updateKey}
            </button>
            <Link
              href={labels.openUnonightAdminHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-900 ${AppPremiumShell.focusRing}`}
            >
              {labels.openUnonightAdmin}
            </Link>
            <Link
              href={labels.backToIntegrationsHref}
              className={`text-sm font-medium text-red-800 underline-offset-2 hover:underline ${AppPremiumShell.focusRing}`}
            >
              {labels.backToIntegrations}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
