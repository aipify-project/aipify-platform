"use client";

import Link from "next/link";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type {
  AppPortalIntegrationsLabels,
  IntegrationVerificationMetadata,
} from "@/lib/app-portal/integrations";
import type { IntegrationCanonicalStatus } from "@/lib/app-portal/integrations/canonical-status";
import { IntegrationConnectionStatusBadge } from "./IntegrationConnectionStatusBadge";

export type IntegrationSetupCompletionMode = "credential_saved" | "verified" | "active";

type IntegrationSetupCompletionSummaryProps = {
  mode: IntegrationSetupCompletionMode;
  labels: AppPortalIntegrationsLabels;
  providerName: string;
  permissionLevel: string;
  scopes: string[];
  verification: IntegrationVerificationMetadata | null;
  lastVerifiedAt: string | null;
  connectionName: string | null;
  wizardPhase: "credential_saved" | "verified_read_only" | "active" | "pending" | "failed";
  canonicalStatus: IntegrationCanonicalStatus;
  statusLabel: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  deactivateLabel?: string;
  acting?: boolean;
  primaryDisabled?: boolean;
};

function formatVerifiedTimestamp(value: string | null, locale?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function resolveAccessTypeLabel(
  permissionLevel: string,
  verification: IntegrationVerificationMetadata | null,
  labels: AppPortalIntegrationsLabels
): string {
  const accessMode = verification?.access_mode ?? permissionLevel;
  if (accessMode === "read_only" || accessMode === "readonly" || permissionLevel === "read_only") {
    return labels.hub.permissionReadOnly;
  }
  if (accessMode === "read_write" || permissionLevel === "read_write") {
    return labels.hub.permissionReadWrite;
  }
  return labels.hub.permissionReadOnly;
}

export function IntegrationSetupCompletionSummary({
  mode,
  labels,
  providerName,
  permissionLevel,
  scopes,
  verification,
  lastVerifiedAt,
  connectionName,
  wizardPhase,
  canonicalStatus,
  statusLabel,
  onPrimaryAction,
  onSecondaryAction,
  onActivate,
  onDeactivate,
  deactivateLabel,
  acting = false,
  primaryDisabled = false,
}: IntegrationSetupCompletionSummaryProps) {
  const completion = labels.setup.completion;
  const heading =
    mode === "credential_saved" ? completion.credentialSavedHeading : completion.verifiedHeading;
  const body = mode === "credential_saved" ? completion.credentialSavedBody : completion.verifiedBody;
  const verifiedAt = formatVerifiedTimestamp(lastVerifiedAt ?? null);
  const organizationName = verification?.organization_name ?? connectionName ?? providerName;
  const accessType = resolveAccessTypeLabel(permissionLevel, verification, labels);
  const displayScopes = verification?.scopes?.length ? verification.scopes : scopes;

  const statusLines =
    mode === "active"
      ? canonicalStatus === "inactive"
        ? [completion.statusInactive ?? completion.statusReadOnly]
        : [completion.statusActive, completion.statusReadOnly]
      : mode === "verified"
        ? [completion.statusVerified ?? labels.setup.statuses.verifiedReadOnly]
        : [completion.statusAwaitingVerification];

  return (
    <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
      <Link
        href="/app/platform/integrations"
        className={`text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
      >
        ← {labels.setup.back}
      </Link>

      <div
        className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6"
        role="status"
        aria-live="polite"
        aria-labelledby="integration-completion-title"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className={AppPremiumShell.eyebrow}>{providerName}</p>
            <h1 id="integration-completion-title" className={AppPremiumShell.pageTitle}>
              {heading}
            </h1>
          </div>
          <IntegrationConnectionStatusBadge
            label={statusLabel}
            canonicalStatus={canonicalStatus}
          />
        </div>

        <p className={`mt-3 ${AppPremiumShell.pageDescription}`}>{body}</p>

        <ul className="mt-4 space-y-1 text-sm text-aipify-text-secondary" aria-label={labels.setup.connectionStatusLabel}>
          {statusLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        {mode !== "credential_saved" ? (
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                {completion.organizationLabel}
              </dt>
              <dd className="mt-1 text-sm text-aipify-text">{organizationName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                {completion.accessTypeLabel}
              </dt>
              <dd className="mt-1 text-sm text-aipify-text">{accessType}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                {completion.permissionsLabel}
              </dt>
              <dd className="mt-2 space-y-2">
                <ul className="space-y-1 text-sm text-aipify-text">
                  {displayScopes.map((scope) => (
                    <li key={scope}>
                      {labels.setup.scopeDescriptions[scope] ?? scope}
                    </li>
                  ))}
                </ul>
                <details className="rounded-lg border border-aipify-border bg-white/70 px-3 py-2">
                  <summary className={`cursor-pointer text-xs font-medium text-aipify-text-secondary ${AppPremiumShell.focusRing}`}>
                    {completion.technicalDetailsLabel}
                  </summary>
                  <p className="mt-2 text-xs text-aipify-text-muted">{completion.technicalScopeLabel}</p>
                  <ul className="mt-2 space-y-1 font-mono text-xs text-aipify-text-muted">
                    {displayScopes.map((scope) => (
                      <li key={`tech-${scope}`}>{scope}</li>
                    ))}
                  </ul>
                  {verification?.api_version ? (
                    <p className="mt-2 text-xs text-aipify-text-muted">
                      {completion.apiVersionLabel}: {verification.api_version}
                    </p>
                  ) : null}
                </details>
              </dd>
            </div>
            {verifiedAt ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                  {completion.lastVerifiedLabel}
                </dt>
                <dd className="mt-1 text-sm text-aipify-text">{verifiedAt}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        {mode === "credential_saved" ? (
          <>
            <button
              type="button"
              disabled={acting || primaryDisabled}
              onClick={onPrimaryAction}
              className={`rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${AppPremiumShell.focusRing}`}
            >
              {completion.primaryTest}
            </button>
            <Link
              href="/app/platform/integrations"
              className={`inline-flex items-center rounded-lg border border-aipify-border bg-white px-4 py-2 text-sm font-medium text-aipify-text ${AppPremiumShell.focusRing}`}
            >
              {completion.secondaryIntegrations}
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/app/platform/integrations"
              className={`inline-flex items-center rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white ${AppPremiumShell.focusRing}`}
            >
              {completion.primaryIntegrations}
            </Link>
            <button
              type="button"
              disabled={acting}
              onClick={onSecondaryAction}
              className={`rounded-lg border border-aipify-border bg-white px-4 py-2 text-sm font-medium text-aipify-text disabled:opacity-50 ${AppPremiumShell.focusRing}`}
            >
              {completion.secondaryRetest}
            </button>
            {mode === "verified" && onActivate ? (
              <button
                type="button"
                disabled={acting}
                onClick={onActivate}
                className={`rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900 disabled:opacity-50 ${AppPremiumShell.focusRing}`}
              >
                {acting ? completion.activating : completion.activateCta}
              </button>
            ) : null}
            {mode === "active" && onDeactivate && canonicalStatus === "active" ? (
              <button
                type="button"
                disabled={acting}
                onClick={onDeactivate}
                className={`rounded-lg border border-aipify-border bg-white px-4 py-2 text-sm font-medium text-aipify-text disabled:opacity-50 ${AppPremiumShell.focusRing}`}
              >
                {deactivateLabel ?? completion.deactivateCta}
              </button>
            ) : null}
            <Link
              href={completion.overviewHref}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-aipify-text-secondary hover:text-aipify-text ${AppPremiumShell.focusRing}`}
            >
              {completion.tertiaryOverview}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
