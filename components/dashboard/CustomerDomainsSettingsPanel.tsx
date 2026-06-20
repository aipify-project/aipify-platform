"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AipifyEmptyState } from "@/components/branding";
import {
  canAddDomain,
  formatLimitUsage,
  parseCustomerDomainsOverview,
  type CustomerDomain,
  type LicenseLimits,
} from "@/lib/platform/license";
import { formatDate } from "@/lib/i18n/format-date";

type CustomerDomainsSettingsPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    pulseLabel: string;
    plan: string;
    domains: string;
    installations: string;
    unlimited: string;
    domainColumn: string;
    statusColumn: string;
    verificationColumn: string;
    addedColumn: string;
    addDomain: string;
    domainPlaceholder: string;
    submit: string;
    empty: string;
    limitReached: string;
    upgrade: string;
    verificationPlaceholder: string;
    statusLabels: Record<string, string>;
    verificationLabels: Record<string, string>;
  };
};

export default function CustomerDomainsSettingsPanel({
  locale,
  labels,
}: CustomerDomainsSettingsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [license, setLicense] = useState<LicenseLimits>({ has_subscription: false });
  const [domains, setDomains] = useState<CustomerDomain[]>([]);
  const [domainInput, setDomainInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/domains");
      if (!response.ok) throw new Error("Failed");
      const data = parseCustomerDomainsOverview(await response.json());
      setLicense(data.license);
      setDomains(data.domains);
    } catch {
      setLicense({ has_subscription: false });
      setDomains([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboard/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? labels.limitReached);
        return;
      }
      setDomainInput("");
      await load();
    } catch {
      setError(labels.limitReached);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  const allowAdd = canAddDomain(license);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>

        {license.has_subscription ? (
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <UsageCard
              label={labels.plan}
              value={license.plan_name ?? license.plan_key ?? "—"}
            />
            <UsageCard
              label={labels.domains}
              value={formatLimitUsage(
                license.used_domains ?? 0,
                license.max_domains,
                labels.unlimited
              )}
            />
            <UsageCard
              label={labels.installations}
              value={formatLimitUsage(
                license.used_installations ?? 0,
                license.max_installations,
                labels.unlimited
              )}
            />
          </dl>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.empty}</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-900">{labels.addDomain}</h3>
          {!allowAdd && license.has_subscription && (
            <Link
              href="/app/billing"
              className="text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              {labels.upgrade} →
            </Link>
          )}
        </div>

        {!allowAdd && license.has_subscription ? (
          <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
            {labels.limitReached}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap gap-3">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder={labels.domainPlaceholder}
              disabled={!allowAdd || submitting}
              className="min-w-[240px] flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={!allowAdd || submitting || !domainInput.trim()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {labels.submit}
            </button>
          </form>
        )}

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <p className="mt-3 text-xs text-gray-500">{labels.verificationPlaceholder}</p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {domains.length === 0 ? (
          <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-3 py-2">{labels.domainColumn}</th>
                  <th className="px-3 py-2">{labels.statusColumn}</th>
                  <th className="px-3 py-2">{labels.verificationColumn}</th>
                  <th className="px-3 py-2">{labels.addedColumn}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {domains.map((domain) => (
                  <tr key={domain.id}>
                    <td className="px-3 py-3 font-medium text-gray-900">{domain.domain}</td>
                    <td className="px-3 py-3 text-gray-600">
                      {labels.statusLabels[domain.status] ?? domain.status}
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {labels.verificationLabels[domain.verification_status] ??
                        domain.verification_status}
                    </td>
                    <td className="px-3 py-3 text-gray-500">
                      {formatDate(domain.added_at, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function UsageCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-lg font-bold text-gray-900">{value}</dd>
    </div>
  );
}
