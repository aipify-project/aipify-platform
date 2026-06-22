"use client";

import { useId, useState, type ReactNode } from "react";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { IntegrationStatusCardPayload } from "@/lib/companion-platform-knowledge/types";

type CompanionIntegrationStatusCardProps = {
  card: IntegrationStatusCardPayload;
  locale: string;
};

function formatTimestamp(value: string | null, locale: string, unavailable: string): string {
  if (!value) return unavailable;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unavailable;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function MetadataField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-aipify-text-muted">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-medium text-aipify-text">{value}</dd>
    </div>
  );
}

export function CompanionIntegrationStatusCard({ card, locale }: CompanionIntegrationStatusCardProps) {
  const [scopesExpanded, setScopesExpanded] = useState(false);
  const scopesPanelId = useId();
  const { labels } = card;

  const languageNames =
    card.supportedLocales.length > 0
      ? card.supportedLocales.map((code) => labels.languageLabels[code] ?? code)
      : [];

  return (
    <article
      className={`${AipifyShellClasses.surfaceCard} mt-3 overflow-hidden`}
      aria-label={labels.ariaCard}
    >
      <header className="border-b border-aipify-border bg-aipify-surface-subtle px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-start gap-2">
          <AipifyStatusBadge kind="completed" label={labels.cardTitle} />
        </div>
        <p className="mt-2 text-sm text-aipify-text-secondary">{labels.cardSupporting}</p>
      </header>

      <div className="space-y-4 px-4 py-4 sm:px-5">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <MetadataField label={labels.fieldOrganization} value={card.organizationName} />
          <MetadataField label={labels.fieldOrganizationId} value={card.organizationId} />
          <MetadataField label={labels.fieldApiVersion} value={card.apiVersion} />
          <MetadataField
            label={labels.fieldAccessMode}
            value={
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">🔒</span>
                <span>{labels.accessModeReadOnly}</span>
              </span>
            }
          />
          <MetadataField
            label={labels.fieldConnectionStatus}
            value={
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">✅</span>
                <span>{labels.statusConnectedVerified}</span>
              </span>
            }
          />
          <MetadataField
            label={labels.fieldBaseUrl}
            value={
              <a
                href={card.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-aipify-companion hover:underline"
              >
                {card.baseUrl}
              </a>
            }
          />
        </dl>

        <div className="grid grid-cols-1 gap-3 border-t border-aipify-border pt-4 sm:grid-cols-2">
          <MetadataField
            label={labels.fieldLastVerified}
            value={formatTimestamp(card.lastVerifiedAt, locale, labels.timestampUnavailable)}
          />
          <MetadataField
            label={labels.fieldLastUsed}
            value={formatTimestamp(card.lastUsedAt, locale, labels.timestampUnavailable)}
          />
        </div>

        <div className="border-t border-aipify-border pt-4">
          <h3 className="text-xs font-medium text-aipify-text-muted">{labels.fieldScopes}</h3>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label={labels.fieldScopes}>
            {card.scopes.map((scope) => (
              <li key={scope}>
                <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-0.5 font-mono text-xs text-violet-900 ring-1 ring-inset ring-violet-200">
                  {scope}
                </span>
              </li>
            ))}
          </ul>
          {labels.scopeItems.length > 0 ? (
            <div className="mt-3">
              <button
                type="button"
                className="text-xs font-medium text-aipify-companion hover:underline"
                aria-expanded={scopesExpanded}
                aria-controls={scopesPanelId}
                onClick={() => setScopesExpanded((open) => !open)}
              >
                {scopesExpanded ? labels.scopesExplainHide : labels.scopesExplainShow}
              </button>
              {scopesExpanded ? (
                <ul
                  id={scopesPanelId}
                  className="mt-2 space-y-2 rounded-lg bg-aipify-surface-muted/60 px-3 py-2 text-xs text-aipify-text-secondary"
                  aria-label={labels.ariaScopesToggle}
                >
                  {labels.scopeItems.map((item) => (
                    <li key={item.scope}>
                      <span className="font-mono text-aipify-text">{item.scope}</span>
                      <span className="mt-0.5 block text-aipify-text-secondary">{item.description}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="border-t border-aipify-border pt-4">
          <h3 className="text-xs font-medium text-aipify-text-muted">{labels.fieldSupportedLanguages}</h3>
          {languageNames.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {languageNames.map((name) => (
                <li key={name}>
                  <span className="inline-flex rounded-full border border-aipify-border bg-white px-2.5 py-0.5 text-xs text-aipify-text">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-aipify-text-secondary">{labels.languagesUnavailable}</p>
          )}
        </div>
      </div>

      <footer className="border-t border-aipify-border bg-aipify-surface-muted/40 px-4 py-3 sm:px-5">
        <p className="text-xs font-medium text-aipify-text-muted">{labels.sourceTitle}</p>
        <p className="mt-1 text-sm text-aipify-text">
          <span aria-hidden="true" className="mr-1">
            🛡️
          </span>
          {labels.sourceLabel}
        </p>
        <p className="mt-0.5 text-xs text-aipify-text-secondary">{labels.sourceMeta}</p>
      </footer>
    </article>
  );
}
