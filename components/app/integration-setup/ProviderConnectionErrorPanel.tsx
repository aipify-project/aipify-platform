"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { ProviderConnectionErrorPanelLabels } from "@/lib/app-portal/integrations/provider-contract";

type ProviderConnectionErrorPanelProps = {
  labels: ProviderConnectionErrorPanelLabels;
  onRetry?: () => void;
  onUpdateKey?: () => void;
  retryDisabled?: boolean;
  updateKeyDisabled?: boolean;
  variant?: "error" | "rotation";
};

export function ProviderConnectionErrorPanel({
  labels,
  onRetry,
  onUpdateKey,
  retryDisabled,
  updateKeyDisabled,
  variant = "error",
}: ProviderConnectionErrorPanelProps) {
  const isRotation = variant === "rotation";
  const shell = isRotation
    ? "rounded-2xl border border-amber-200/90 bg-amber-50/70 p-5 dark:border-amber-500/30 dark:bg-amber-950/30"
    : "rounded-2xl border border-red-200 bg-red-50/60 p-5 dark:border-red-500/30 dark:bg-red-950/30";
  const titleClass = isRotation
    ? "font-semibold text-amber-950 dark:text-amber-100"
    : "font-semibold text-red-900 dark:text-red-100";
  const bodyClass = isRotation
    ? "mt-1 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/85"
    : "mt-1 text-sm leading-relaxed text-red-800 dark:text-red-100/85";
  const iconClass = isRotation
    ? "mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
    : "mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400";
  const secondaryBtn =
    "rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2.5 text-sm font-medium text-aipify-text disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div
      className={shell}
      role="alert"
      aria-labelledby="provider-connection-error-title"
      aria-live="polite"
    >
      <div className="flex gap-3">
        <AlertTriangle className={iconClass} aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <h3 id="provider-connection-error-title" className={titleClass}>
              {labels.title}
            </h3>
            <p className={bodyClass}>{labels.body}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {onUpdateKey ? (
              <button
                type="button"
                disabled={updateKeyDisabled}
                onClick={onUpdateKey}
                aria-label={labels.updateKey}
                title={updateKeyDisabled ? labels.updateKey : undefined}
                className={`min-h-11 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${AppPremiumShell.focusRing}`}
              >
                {labels.updateKey}
              </button>
            ) : null}
            {onRetry ? (
              <button
                type="button"
                disabled={retryDisabled}
                onClick={onRetry}
                aria-label={labels.retry}
                title={retryDisabled ? labels.retry : undefined}
                className={`min-h-11 ${secondaryBtn} ${AppPremiumShell.focusRing}`}
              >
                {labels.retry}
              </button>
            ) : null}
            {labels.openAdminHref ? (
              <Link
                href={labels.openAdminHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center ${secondaryBtn} ${AppPremiumShell.focusRing}`}
              >
                {labels.openAdmin}
              </Link>
            ) : null}
            <Link
              href={labels.backToIntegrationsHref}
              className={`inline-flex min-h-11 items-center text-sm font-medium text-aipify-text-secondary underline-offset-2 hover:underline ${AppPremiumShell.focusRing}`}
            >
              {labels.backToIntegrations}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
