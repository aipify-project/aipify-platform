"use client";

import {
  formatHealthStatus,
  type CustomerOnboarding,
} from "@/lib/platform/installation-engine";
import { formatDateTime } from "@/lib/i18n/format-date";
import type { CustomerDomain } from "@/lib/platform/license";
import type {
  CustomerInstallationRow,
  InstallationHealthScanRow,
} from "@/lib/platform/types";

type CustomerInstallationEnginePanelProps = {
  locale: string;
  onboarding: CustomerOnboarding | null;
  installations: CustomerInstallationRow[];
  domains: CustomerDomain[];
  healthScans: InstallationHealthScanRow[];
  labels: {
    title: string;
    onboardingScore: string;
    installationHealth: string;
    verificationStatus: string;
    healthScans: string;
    moduleStatus: string;
    noData: string;
    healthLabels: Record<string, string>;
    onboardingItems: Record<string, string>;
    statusLabels: Record<string, string>;
    verificationLabels: Record<string, string>;
  };
};

export default function CustomerInstallationEnginePanel({
  locale,
  onboarding,
  installations,
  domains,
  healthScans,
  labels,
}: CustomerInstallationEnginePanelProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">{labels.title}</h3>

      {onboarding && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Metric label={labels.onboardingScore} value={`${onboarding.score}%`} />
          {Object.entries(labels.onboardingItems).map(([key, label]) => (
            <Metric
              key={key}
              label={label}
              value={
                onboarding[key as keyof CustomerOnboarding] === true
                  ? "✓"
                  : "—"
              }
            />
          ))}
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-800">{labels.installationHealth}</h4>
        {installations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noData}</p>
        ) : (
          <div className="mt-2 space-y-2">
            {installations.map((installation) => (
              <div
                key={installation.id}
                className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
              >
                <p className="font-medium text-gray-900">
                  {installation.name ?? installation.site_url ?? installation.id}
                </p>
                <p className="text-gray-600">
                  {labels.statusLabels[installation.status] ?? installation.status}
                  {installation.health_score != null
                    ? ` · ${installation.health_score}/100`
                    : ""}
                  {installation.health_status
                    ? ` · ${formatHealthStatus(installation.health_status, labels.healthLabels)}`
                    : ""}
                </p>
                {installation.modules?.length ? (
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.moduleStatus}:{" "}
                    {installation.modules
                      .map((module) => {
                        if (typeof module === "string") return module;
                        return `${module.module_key} (${module.status ?? (module.enabled ? "enabled" : "disabled")})`;
                      })
                      .join(", ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-800">{labels.verificationStatus}</h4>
        {domains.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noData}</p>
        ) : (
          <div className="mt-2 space-y-2">
            {domains.map((domain) => (
              <div key={domain.id} className="text-sm text-gray-700">
                {domain.domain} —{" "}
                {labels.verificationLabels[domain.verification_status] ??
                  domain.verification_status}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-800">{labels.healthScans}</h4>
        {healthScans.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noData}</p>
        ) : (
          <div className="mt-2 space-y-2">
            {healthScans.slice(0, 5).map((scan) => (
              <div key={scan.id} className="text-sm text-gray-700">
                {scan.score}/100 ·{" "}
                {formatHealthStatus(scan.status, labels.healthLabels)} ·{" "}
                {formatDateTime(scan.created_at, locale)}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
