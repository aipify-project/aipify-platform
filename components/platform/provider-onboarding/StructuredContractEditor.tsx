"use client";

import type { ReactNode } from "react";
import type { CoreProviderOnboardingContract } from "@/lib/app-portal/integrations/onboarding";
import type { PlatformProviderOnboardingLabels } from "@/lib/platform/provider-onboarding/panel-props";

type Translate = (key: string, params?: Record<string, string>) => string;

type StructuredContractEditorProps = {
  contract: CoreProviderOnboardingContract;
  labels: PlatformProviderOnboardingLabels;
  t: Translate;
  dirty: boolean;
  acting: boolean;
  message: string | null;
  onChange: (next: CoreProviderOnboardingContract) => void;
  onSave: () => void;
  onCancel: () => void;
  onValidate: () => void;
};

const MODE_OPTIONS = [
  "oauth",
  "api_key_existing_provider",
  "installable_connector",
  "aipify_hosted_connector",
  "custom_provider_implementation",
] as const;

const OWNER_OPTIONS = ["provider", "customer", "aipify", "shared"] as const;
const CHANNEL_OPTIONS = [
  "provider_marketplace",
  "direct_download",
  "package_registry",
  "container_image",
  "customer_developer",
  "aipify_managed",
  "not_applicable",
] as const;
const TARGET_OPTIONS = [
  "none",
  "provider_saas",
  "customer_server",
  "customer_cms",
  "customer_ecommerce",
  "customer_cloud",
  "customer_container_platform",
  "aipify_cloud",
  "customer_custom_system",
] as const;
const READINESS_OPTIONS = [
  "reference_only",
  "development",
  "preview",
  "production_ready",
  "deprecated",
  "blocked",
  "unsupported",
] as const;
const SUPPORT_OPTIONS = [
  "self_service",
  "guided",
  "aipify_managed",
  "partner_managed",
  "customer_managed",
  "unsupported",
] as const;

const CAPABILITY_FIELDS = [
  { key: "supportsOAuth" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.modes.oauth" },
  { key: "supportsApiKey" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.modes.api_key_existing_provider" },
  { key: "supportsConnectorPackage" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.modes.installable_connector" },
  { key: "supportsHostedConnector" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.modes.aipify_hosted_connector" },
  { key: "supportsCustomImplementation" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.modes.custom_provider_implementation" },
  { key: "supportsHealthCheck" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.healthCheck" },
  { key: "supportsStatusReadback" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.fields.installationState" },
  { key: "supportsRotation" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.upgradeGuide" },
  { key: "supportsRevoke" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.uninstallGuide" },
  { key: "supportsOneTimeReveal" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.apiKey" },
  { key: "supportsUpgrade" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.docs.upgrade" },
  { key: "supportsRollback" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.docs.uninstall" },
  { key: "supportsUninstall" as const, labelKey: "customerApp.portalStructure.integrations.onboarding.docs.uninstall" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100";

export function StructuredContractEditor({
  contract,
  labels,
  t,
  dirty,
  acting,
  message,
  onChange,
  onSave,
  onCancel,
  onValidate,
}: StructuredContractEditorProps) {
  const modeKey = `customerApp.portalStructure.integrations.onboarding.modes.${contract.onboardingMode}`;

  function patch(partial: Partial<CoreProviderOnboardingContract>) {
    onChange({ ...contract, ...partial });
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/95 p-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <button
          type="button"
          disabled={acting}
          onClick={onSave}
          className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
          {labels.save}
        </button>
        <button
          type="button"
          onClick={onValidate}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
        >
          {labels.validateContract}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
        >
          {labels.cancel}
        </button>
        {dirty ? (
          <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-950 dark:bg-amber-950 dark:text-amber-100">
            {labels.dirtyIndicator}
          </span>
        ) : null}
        {message ? (
          <p className="text-sm text-slate-600 dark:text-slate-300" role="status" aria-live="polite">
            {message}
          </p>
        ) : null}
      </div>

      <Section title={labels.sectionBasics}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label={t("customerApp.portalStructure.integrations.onboarding.fields.provider")}>
            <input className={inputClass} value={contract.providerKey} readOnly />
          </Field>
          <Field label={t("customerApp.portalStructure.integrations.onboarding.fields.onboardingMode")}>
            <p className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
              {t(modeKey)}
            </p>
          </Field>
        </div>
      </Section>

      <Section title={labels.sectionConnection}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Field label={t("customerApp.portalStructure.integrations.onboarding.fields.onboardingMode")}>
            <select
              className={inputClass}
              value={contract.onboardingMode}
              onChange={(event) =>
                patch({
                  onboardingMode: event.target.value as CoreProviderOnboardingContract["onboardingMode"],
                })
              }
            >
              {MODE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`customerApp.portalStructure.integrations.onboarding.modes.${value}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("customerApp.portalStructure.integrations.onboarding.fields.implementationOwner")}>
            <select
              className={inputClass}
              value={contract.implementationOwner}
              onChange={(event) =>
                patch({
                  implementationOwner:
                    event.target.value as CoreProviderOnboardingContract["implementationOwner"],
                })
              }
            >
              {OWNER_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`customerApp.portalStructure.integrations.onboarding.owners.${value}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("customerApp.portalStructure.integrations.onboarding.fields.distributionChannel")}>
            <select
              className={inputClass}
              value={contract.distributionChannel}
              onChange={(event) =>
                patch({
                  distributionChannel:
                    event.target.value as CoreProviderOnboardingContract["distributionChannel"],
                })
              }
            >
              {CHANNEL_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`customerApp.portalStructure.integrations.onboarding.channels.${value}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("customerApp.portalStructure.integrations.onboarding.fields.installTarget")}>
            <select
              className={inputClass}
              value={contract.installTarget}
              onChange={(event) =>
                patch({
                  installTarget: event.target.value as CoreProviderOnboardingContract["installTarget"],
                })
              }
            >
              {TARGET_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`customerApp.portalStructure.integrations.onboarding.installTargets.${value}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("customerApp.portalStructure.integrations.onboarding.fields.readiness")}>
            <select
              className={inputClass}
              value={contract.readinessLevel}
              onChange={(event) =>
                patch({
                  readinessLevel: event.target.value as CoreProviderOnboardingContract["readinessLevel"],
                })
              }
            >
              {READINESS_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`customerApp.portalStructure.integrations.onboarding.readiness.${value}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("customerApp.portalStructure.integrations.onboarding.fields.support")}>
            <select
              className={inputClass}
              value={contract.supportLevel}
              onChange={(event) =>
                patch({
                  supportLevel: event.target.value as CoreProviderOnboardingContract["supportLevel"],
                })
              }
            >
              {SUPPORT_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`customerApp.portalStructure.integrations.onboarding.support.${value}`)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title={labels.sectionCapabilities}>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {CAPABILITY_FIELDS.map(({ key, labelKey }) => (
            <label key={key} className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100">
              <input
                type="checkbox"
                checked={Boolean(contract[key])}
                onChange={(event) => patch({ [key]: event.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-500"
              />
              <span>{t(labelKey)}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title={labels.sectionScopes}>
        <Field label={labels.sectionScopes}>
          <textarea
            className={`${inputClass} font-mono text-xs`}
            rows={3}
            value={contract.requiredScopes.join("\n")}
            onChange={(event) =>
              patch({
                requiredScopes: event.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              })
            }
            aria-label={labels.sectionScopes}
          />
        </Field>
      </Section>

      <Section title={labels.sectionResponsibilities}>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t("customerApp.portalStructure.integrations.onboarding.responsibilitiesTitle")}
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ...contract.customerResponsibilities.map((item) => ({
              role: t("customerApp.portalStructure.integrations.onboarding.customerRole"),
              text: t(item.labelKey),
            })),
            ...contract.aipifyResponsibilities.map((item) => ({
              role: t("customerApp.portalStructure.integrations.onboarding.aipifyRole"),
              text: t(item.labelKey),
            })),
            ...contract.providerResponsibilities.map((item) => ({
              role: t("customerApp.portalStructure.integrations.onboarding.providerRole"),
              text: t(item.labelKey),
            })),
            ...contract.partnerResponsibilities.map((item) => ({
              role: t("customerApp.portalStructure.integrations.onboarding.partnerRole"),
              text: t(item.labelKey),
            })),
          ].map((item, index) => (
            <li
              key={`${item.role}-${index}`}
              className="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/70"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.role}
              </div>
              <div className="text-slate-800 dark:text-slate-100">{item.text}</div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={labels.sectionDocs}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {Object.entries(contract.docs).map(([key, link]) =>
            link?.url ? (
              <li key={key}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
                >
                  {t(`customerApp.portalStructure.integrations.onboarding.docs.${key}`)}
                </a>
              </li>
            ) : null
          )}
        </ul>
      </Section>
    </div>
  );
}
