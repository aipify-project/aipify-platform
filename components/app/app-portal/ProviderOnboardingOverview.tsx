"use client";

import type { ReactNode } from "react";
import {
  getDistributionChannelPresentation,
  getImplementationOwnerPresentation,
  getInstallTargetPresentation,
  getInstallationStatePresentation,
  getOnboardingModePresentation,
  getReadinessPresentation,
  getSupportPresentation,
  resolveOnboardingSafeActions,
  type CoreProviderInstallationState,
  type CoreProviderOnboardingContract,
  type CoreProviderOnboardingSeverity,
} from "@/lib/app-portal/integrations/onboarding";

type Translate = (key: string, params?: Record<string, string>) => string;

type ProviderOnboardingOverviewProps = {
  contract: CoreProviderOnboardingContract;
  installationState: CoreProviderInstallationState;
  providerDisplayName: string;
  t: Translate;
};

const SEVERITY_CLASS: Record<CoreProviderOnboardingSeverity, string> = {
  neutral: "bg-[color:var(--aipify-surface-muted,#eef2f7)] text-[color:var(--aipify-text,#0f172a)]",
  info: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100",
  success: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  warning: "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100",
  danger: "bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100",
};

function Badge({
  label,
  severity,
}: {
  label: string;
  severity: CoreProviderOnboardingSeverity;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${SEVERITY_CLASS[severity]}`}
    >
      {label}
    </span>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[color:var(--aipify-border,#d9e0ea)] bg-[color:var(--aipify-surface,#fff)] p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold text-[color:var(--aipify-text,#0f172a)] dark:text-slate-100">
        {title}
      </h3>
      {children}
    </section>
  );
}

function interpolate(template: string, params?: Record<string, string>): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    template
  );
}

export function ProviderOnboardingOverview({
  contract,
  installationState,
  providerDisplayName,
  t,
}: ProviderOnboardingOverviewProps) {
  const tr = (key: string, params?: Record<string, string>) =>
    interpolate(t(key), params);

  const mode = getOnboardingModePresentation(contract.onboardingMode);
  const readiness = getReadinessPresentation(contract.readinessLevel);
  const support = getSupportPresentation(contract.supportLevel);
  const owner = getImplementationOwnerPresentation(contract.implementationOwner);
  const channel = getDistributionChannelPresentation(contract.distributionChannel);
  const installTarget = getInstallTargetPresentation(contract.installTarget);
  const state = getInstallationStatePresentation(installationState);
  const actions = resolveOnboardingSafeActions(contract, installationState);

  const responsibilityGroups = [
    {
      title: tr("customerApp.portalStructure.integrations.onboarding.customerRole"),
      items: contract.customerResponsibilities,
    },
    {
      title: tr("customerApp.portalStructure.integrations.onboarding.aipifyRole"),
      items: contract.aipifyResponsibilities,
    },
    {
      title: tr("customerApp.portalStructure.integrations.onboarding.providerRole"),
      items: contract.providerResponsibilities,
    },
    {
      title: tr("customerApp.portalStructure.integrations.onboarding.partnerRole"),
      items: contract.partnerResponsibilities,
    },
  ].filter((group) => group.items.length > 0);

  const docEntries = Object.entries(contract.docs).filter(
    (entry): entry is [string, { url: string }] => !!entry[1]?.url
  );

  return (
    <div className="mb-6 space-y-4" data-testid="provider-onboarding-overview">
      <header className="space-y-3 rounded-xl border border-[color:var(--aipify-border,#d9e0ea)] bg-[color:var(--aipify-surface,#fff)] p-5 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-semibold text-[color:var(--aipify-text,#0f172a)] dark:text-slate-50">
              {tr("customerApp.portalStructure.integrations.onboarding.title")}
            </h2>
            <p className="max-w-3xl text-sm text-[color:var(--aipify-text-muted,#475569)] dark:text-slate-300">
              {tr("customerApp.portalStructure.integrations.onboarding.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label={tr("customerApp.portalStructure.integrations.onboarding.title")}>
            <Badge label={tr(mode.labelKey)} severity={mode.severity} />
            <Badge label={tr(readiness.labelKey)} severity={readiness.severity} />
            <Badge label={tr(support.labelKey)} severity={support.severity} />
            <Badge label={tr(state.labelKey)} severity={state.severity} />
          </div>
        </div>
        <p
          className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-950 dark:bg-violet-950/50 dark:text-violet-100"
          role="status"
          aria-live="polite"
        >
          {tr("customerApp.portalStructure.integrations.onboarding.noServerAccessNotice")}
        </p>
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {tr("customerApp.portalStructure.integrations.onboarding.fields.implementationOwner")}
            </dt>
            <dd className="text-sm font-medium dark:text-slate-100">{tr(owner.labelKey)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {tr("customerApp.portalStructure.integrations.onboarding.fields.distributionChannel")}
            </dt>
            <dd className="text-sm font-medium dark:text-slate-100">{tr(channel.labelKey)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {tr("customerApp.portalStructure.integrations.onboarding.fields.installTarget")}
            </dt>
            <dd className="text-sm font-medium dark:text-slate-100">{tr(installTarget.labelKey)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {tr("customerApp.portalStructure.integrations.onboarding.fields.provider")}
            </dt>
            <dd className="text-sm font-medium dark:text-slate-100">{providerDisplayName}</dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title={tr("customerApp.portalStructure.integrations.onboarding.responsibilitiesTitle")}>
          <div className="grid gap-3 sm:grid-cols-2">
            {responsibilityGroups.map((group) => (
              <div key={group.title} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  {group.title}
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
                  {group.items.map((item) => (
                    <li key={item.key}>{tr(item.labelKey)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card title={tr("customerApp.portalStructure.integrations.onboarding.docsTitle")}>
          {docEntries.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">—</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {docEntries.map(([key, link]) => (
                <li key={key}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
                  >
                    {tr(`customerApp.portalStructure.integrations.onboarding.docs.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {actions.showConnectorDownload && contract.packageMetadata ? (
        <Card title={tr("customerApp.portalStructure.integrations.onboarding.packageTitle")}>
          <div className="grid gap-3 md:grid-cols-2">
            <p className="text-sm dark:text-slate-200">
              {tr("customerApp.portalStructure.integrations.onboarding.installConnector", {
                connectorName: contract.packageMetadata.name,
              })}
            </p>
            <p className="text-sm dark:text-slate-200">
              {tr("customerApp.portalStructure.integrations.onboarding.connectorVersion", {
                version: contract.packageMetadata.version,
              })}
            </p>
            <p className="text-sm dark:text-slate-200">
              {tr("customerApp.portalStructure.integrations.onboarding.checksum")}:{" "}
              <code className="break-all text-xs">{contract.packageMetadata.checksumAlgorithm}</code>
            </p>
            <p className="text-sm dark:text-slate-200">
              {tr("customerApp.portalStructure.integrations.onboarding.signature")}:{" "}
              {contract.packageMetadata.signatureAlgorithm}
            </p>
            {contract.marketplaceMetadata?.listingUrl ? (
              <a
                href={contract.marketplaceMetadata.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
              >
                {tr("customerApp.portalStructure.integrations.onboarding.marketplace")}
              </a>
            ) : null}
            <a
              href={contract.packageMetadata.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
            >
              {tr("customerApp.portalStructure.integrations.onboarding.download")}
            </a>
            {contract.packageMetadata.installCommand ? (
              <div className="md:col-span-2">
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                  {tr("customerApp.portalStructure.integrations.onboarding.displayOnlyCommand")}
                </p>
                <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
                  {contract.packageMetadata.installCommand}
                </pre>
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}

      {actions.showCustomSteps ? (
        <Card
          title={tr(
            "customerApp.portalStructure.integrations.onboarding.technicalImplementationRequired"
          )}
        >
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {tr("customerApp.portalStructure.integrations.onboarding.modes.custom_provider_implementation")}
          </p>
          {contract.customImplementationMetadata?.specificationUrl ? (
            <a
              href={contract.customImplementationMetadata.specificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-sm font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
            >
              {tr("customerApp.portalStructure.integrations.onboarding.docs.gettingStarted")}
            </a>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
