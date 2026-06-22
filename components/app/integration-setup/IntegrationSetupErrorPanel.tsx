"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { IntegrationErrorGuidance } from "@/lib/install/integration-setup";

type IntegrationSetupErrorPanelProps = {
  guidance: IntegrationErrorGuidance;
  labels: {
    title: string;
    body: string;
    checklist: string[];
    retry: string;
    findKey: string;
    contactSupport: string;
    findKeyHref: string;
    contactSupportHref: string;
  };
  onRetry?: () => void;
  retryDisabled?: boolean;
};

export function IntegrationSetupErrorPanel({
  guidance,
  labels,
  onRetry,
  retryDisabled,
}: IntegrationSetupErrorPanelProps) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50/60 p-5"
      role="alert"
      aria-labelledby="integration-error-title"
    >
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h3 id="integration-error-title" className="font-semibold text-red-900">
              {labels.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-red-800">{labels.body}</p>
          </div>

          {labels.checklist.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-red-800">
              {labels.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

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
            <Link
              href={labels.findKeyHref}
              className={`rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-900 ${AppPremiumShell.focusRing}`}
            >
              {labels.findKey}
            </Link>
            <Link
              href={labels.contactSupportHref}
              className={`text-sm font-medium text-red-800 underline-offset-2 hover:underline ${AppPremiumShell.focusRing}`}
            >
              {labels.contactSupport}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Resolve translated labels for an error guidance object. */
export function buildIntegrationErrorPanelLabels(
  guidance: IntegrationErrorGuidance,
  t: (key: string) => string,
  options?: { findKeyHref?: string; contactSupportHref?: string }
): IntegrationSetupErrorPanelProps["labels"] {
  return {
    title: t(guidance.titleKey),
    body: t(guidance.bodyKey),
    checklist: guidance.checklistKeys.map((key) => t(key)),
    retry: t(guidance.actions.retry),
    findKey: t(guidance.actions.findKey),
    contactSupport: t(guidance.actions.contactSupport),
    findKeyHref: options?.findKeyHref ?? "/app/support/knowledge",
    contactSupportHref: options?.contactSupportHref ?? "/app/support/contact",
  };
}
