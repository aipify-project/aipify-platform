"use client";

import { formatLimitUsage, type LicenseCheck, type LicenseLimits } from "@/lib/platform/license";
import { formatDateTime } from "@/lib/i18n/format-date";

type CustomerLicensePanelProps = {
  license: LicenseLimits;
  licenseChecks: LicenseCheck[];
  locale: string;
  labels: {
    title: string;
    plan: string;
    maxDomains: string;
    usedDomains: string;
    maxInstallations: string;
    usedInstallations: string;
    subscriptionStatus: string;
    paymentStatus: string;
    lastLicenseCheck: string;
    failedChecks: string;
    unlimited: string;
    noChecks: string;
    checkResultLabels: Record<string, string>;
    checkTypeLabels: Record<string, string>;
  };
  paymentStatus?: string | null;
};

export default function CustomerLicensePanel({
  license,
  licenseChecks,
  locale,
  labels,
  paymentStatus,
}: CustomerLicensePanelProps) {
  const failedChecks = licenseChecks.filter((check) => check.result === "blocked");
  const lastCheck = licenseChecks[0] ?? null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={labels.plan} value={license.plan_name ?? license.plan_key ?? "—"} />
        <Field
          label={labels.maxDomains}
          value={formatLimitUsage(license.used_domains ?? 0, license.max_domains, labels.unlimited)}
        />
        <Field
          label={labels.maxInstallations}
          value={formatLimitUsage(
            license.used_installations ?? 0,
            license.max_installations,
            labels.unlimited
          )}
        />
        <Field
          label={labels.subscriptionStatus}
          value={license.subscription_status ?? "—"}
        />
        <Field label={labels.paymentStatus} value={paymentStatus ?? "—"} />
        <Field
          label={labels.failedChecks}
          value={String(failedChecks.length)}
        />
      </dl>
      <p className="mt-4 text-sm text-gray-600">
        {labels.lastLicenseCheck}:{" "}
        {lastCheck
          ? `${labels.checkTypeLabels[lastCheck.check_type] ?? lastCheck.check_type} · ${formatDateTime(lastCheck.created_at, locale)}`
          : labels.noChecks}
      </p>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}
