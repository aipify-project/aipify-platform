"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  authHelpFieldKey,
  authHelpSectionTitleKey,
  authHelpStepKey,
  authHelpTechnicalDetailsKey,
  getAuthHelpFieldKeys,
  getAuthHelpStepCount,
  resolveAuthHelpProvider,
} from "@/lib/install/integration-setup";

type IntegrationAuthHelpPanelProps = {
  providerKey: string;
  labels: {
    sectionTitles: Record<string, string>;
    stepsTitle: string;
    technicalDetailsTitle: string;
    technicalDetailsToggleShow: string;
    technicalDetailsToggleHide: string;
    provider: Record<string, Record<string, string>>;
  };
};

export function IntegrationAuthHelpPanel({ providerKey, labels }: IntegrationAuthHelpPanelProps) {
  const provider = resolveAuthHelpProvider(providerKey);
  const fields = getAuthHelpFieldKeys(provider);
  const stepCount = getAuthHelpStepCount(provider);
  const providerLabels = labels.provider[provider] ?? labels.provider.custom_api ?? {};
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <aside
      className={`${AppPremiumShell.elevatedCard} space-y-4 p-5`}
      aria-labelledby="integration-auth-help-heading"
    >
      <h3
        id="integration-auth-help-heading"
        className="text-sm font-semibold text-aipify-text"
      >
        {labels.stepsTitle}
      </h3>

      <dl className="space-y-3">
        {fields.map((field) => {
          const sectionTitle = labels.sectionTitles[field] ?? field;
          const content = providerLabels[field];
          if (!content) return null;
          return (
            <div key={field}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">
                {sectionTitle}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{content}</dd>
            </div>
          );
        })}
      </dl>

      {stepCount > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">
            {labels.stepsTitle}
          </p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-aipify-text-secondary">
            {Array.from({ length: stepCount }, (_, index) => {
              const stepLabel = providerLabels[`step${index + 1}`];
              if (!stepLabel) return null;
              return <li key={index}>{stepLabel}</li>;
            })}
          </ol>
        </div>
      ) : null}

      {providerLabels.technicalDetails ? (
        <div className="border-t border-aipify-border pt-3">
          <button
            type="button"
            onClick={() => setShowTechnical((v) => !v)}
            className={`flex w-full items-center justify-between gap-2 text-left text-sm font-medium text-aipify-companion ${AppPremiumShell.focusRing} rounded-lg`}
            aria-expanded={showTechnical}
          >
            <span>{labels.technicalDetailsTitle}</span>
            {showTechnical ? (
              <ChevronUp className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
          </button>
          {showTechnical ? (
            <p className="mt-2 font-mono text-xs leading-relaxed text-aipify-text-muted">
              {providerLabels.technicalDetails}
            </p>
          ) : (
            <span className="sr-only">
              {showTechnical ? labels.technicalDetailsToggleHide : labels.technicalDetailsToggleShow}
            </span>
          )}
        </div>
      ) : null}
    </aside>
  );
}

/** Build label lookup keys for auth help — used by label builders. */
export function integrationAuthHelpLabelKeys(providerKey: string) {
  const provider = resolveAuthHelpProvider(providerKey);
  return {
    fields: getAuthHelpFieldKeys(provider).map((field) => ({
      field,
      key: authHelpFieldKey(provider, field),
      sectionKey: authHelpSectionTitleKey(field),
    })),
    steps: Array.from({ length: getAuthHelpStepCount(provider) }, (_, i) =>
      authHelpStepKey(provider, i)
    ),
    technicalDetails: authHelpTechnicalDetailsKey(provider),
  };
}
