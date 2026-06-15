"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  AIPIFY_HOSTS_BILLING_ROUTE,
  AIPIFY_HOSTS_CONTACT_SALES_ROUTE,
  parseAipifyHostsDashboard,
  parseCreateAipifyHostsPropertyResult,
  type AipifyHostsDashboard,
  type HostsLicensing,
  type HostsModule,
} from "@/lib/aipify/aipify-hosts";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ModuleCard({ module, enabledLabel }: { module: HostsModule; enabledLabel: string }) {
  return (
    <article className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{module.label}</h3>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">{enabledLabel}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
    </article>
  );
}

function CapacityBar({
  licensing,
  label,
  additionalLicensesNote,
}: {
  licensing: HostsLicensing;
  label: string;
  additionalLicensesNote?: string;
}) {
  const pct = licensing.property_limit > 0
    ? Math.min(100, Math.round((licensing.active_property_count / licensing.property_limit) * 100))
    : 0;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-gray-900">{label}</h2>
        <span className="text-sm text-gray-600">{licensing.capacity_label}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all ${licensing.at_capacity ? "bg-amber-500" : "bg-indigo-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {licensing.additional_property_licenses > 0 && additionalLicensesNote && (
        <p className="mt-2 text-xs text-gray-500">
          {additionalLicensesNote.replace("{count}", String(licensing.additional_property_licenses))}
        </p>
      )}
    </div>
  );
}

function UpgradeWorkflow({ labels }: { labels: Record<string, string> }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
      <h2 className="text-lg font-semibold text-amber-950">{labels.upgradeHeadline}</h2>
      <p className="mt-2 text-sm text-amber-900">{labels.upgradeDescription}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={AIPIFY_HOSTS_BILLING_ROUTE}
          className="inline-flex rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-50"
        >
          {labels.viewPlans}
        </Link>
        <Link
          href={AIPIFY_HOSTS_BILLING_ROUTE}
          className="inline-flex rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          {labels.upgradeNow}
        </Link>
        <a
          href={AIPIFY_HOSTS_CONTACT_SALES_ROUTE}
          className="inline-flex rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-50"
        >
          {labels.contactSales}
        </a>
      </div>
    </div>
  );
}

export function AipifyHostsDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyHostsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [addingLicense, setAddingLicense] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyHostsDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const licensing = dashboard?.licensing;
  const atCapacity = licensing?.at_capacity ?? false;

  const handleAddProperty = async () => {
    if (!propertyName.trim()) return;
    setSubmitting(true);
    setShowUpgrade(false);
    const res = await fetch("/api/aipify/aipify-hosts/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: propertyName.trim() }),
    });
    const result = parseCreateAipifyHostsPropertyResult(await res.json());
    setSubmitting(false);
    if (result.success) {
      setPropertyName("");
      setShowAddForm(false);
      await load();
      return;
    }
    if (result.upgrade_required) {
      setShowUpgrade(true);
    }
  };

  const handleAddPropertyLicense = async () => {
    setAddingLicense(true);
    const res = await fetch("/api/aipify/aipify-hosts/licensing/add-property-license", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 1 }),
    });
    setAddingLicense(false);
    if (res.ok) {
      setShowUpgrade(false);
      await load();
    }
  };

  const openAddProperty = () => {
    if (atCapacity) {
      setShowUpgrade(true);
      return;
    }
    setShowAddForm(true);
  };

  if (loading) {
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const activePackage = dashboard.packages.find((p) => p.key === dashboard.package_key);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-900">{dashboard.positioning}</p>
        {dashboard.licensing_principle && (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.licensing_principle}</p>
        )}
        <p className="mt-3 text-xs text-indigo-800">{dashboard.governance.principle}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {labels.openAutomation && (
            <Link href="/app/aipify-hosts/automation" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openAutomation}
            </Link>
          )}
          {labels.openGuestIntelligence && (
            <Link href="/app/aipify-hosts/guest-intelligence" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openGuestIntelligence}
            </Link>
          )}
          {labels.openTrustCompliance && (
            <Link href="/app/aipify-hosts/trust-compliance" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openTrustCompliance}
            </Link>
          )}
          {labels.openExpansionIntelligence && (
            <Link href="/app/aipify-hosts/expansion-intelligence" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openExpansionIntelligence}
            </Link>
          )}
          {labels.openCompanion && (
            <Link href="/app/aipify-hosts/companion" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openCompanion}
            </Link>
          )}
          {labels.openMarketplace && (
            <Link href="/app/aipify-hosts/marketplace" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openMarketplace}
            </Link>
          )}
          {labels.openReferrals && (
            <Link href="/app/aipify-hosts/referrals" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openReferrals}
            </Link>
          )}
          {labels.openKnowledge && (
            <Link href="/app/aipify-hosts/knowledge" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openKnowledge}
            </Link>
          )}
          {labels.openReports && (
            <Link href="/app/aipify-hosts/reports" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openReports}
            </Link>
          )}
          {labels.openOperations && (
            <Link href="/app/aipify-hosts/operations" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openOperations}
            </Link>
          )}
          {labels.openPropertyCenter && (
            <Link href="/app/aipify-hosts/properties" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openPropertyCenter}
            </Link>
          )}
          {labels.openGuestCenter && (
            <Link href="/app/aipify-hosts/guests" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {labels.openGuestCenter}
            </Link>
          )}
        </div>
      </section>

      {licensing && (
        <CapacityBar
          licensing={licensing}
          label={labels.capacityLabel}
          additionalLicensesNote={labels.additionalLicensesNote}
        />
      )}

      {(showUpgrade || atCapacity) && <UpgradeWorkflow labels={labels} />}

      {atCapacity && dashboard.package_key !== "hosts_enterprise" && labels.addPropertyLicense && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.addPropertyLicenseTitle}</h3>
          <p className="mt-1 text-sm text-gray-600">{labels.addPropertyLicenseDescription}</p>
          <button
            type="button"
            onClick={() => void handleAddPropertyLicense()}
            disabled={addingLicense}
            className="mt-4 inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-100 disabled:opacity-60"
          >
            {addingLicense ? labels.addingLicense : labels.addPropertyLicense}
          </button>
        </div>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.executiveSnapshot}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.properties} value={dashboard.property_count} />
          <MetricCard label={labels.healthScore} value={`${dashboard.property_health_score}%`} />
          <MetricCard label={labels.package} value={activePackage?.label ?? dashboard.package_key} />
          <MetricCard
            label={labels.propertyLimit}
            value={dashboard.property_limit ?? licensing?.property_limit ?? "—"}
          />
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.supportedPlatforms}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.platforms.map((platform) => (
            <span key={platform.key} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200">
              {platform.label}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.modules}</h2>
        <p className="mb-4 text-sm text-gray-600">{labels.allModulesIncluded}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.modules.map((module) => (
            <ModuleCard
              key={module.key}
              module={module}
              enabledLabel={labels.included}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.packages}</h2>
        <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {dashboard.packages.map((pkg) => (
            <article
              key={pkg.key}
              className={`rounded-2xl border p-5 ${pkg.key === dashboard.package_key ? "border-indigo-300 bg-indigo-50/30 shadow-sm" : "border-gray-200 bg-white"}`}
            >
              <h3 className="font-semibold text-gray-900">{pkg.label}</h3>
              <p className="mt-1 text-sm text-gray-600">{pkg.target}</p>
              <p className="mt-3 text-xs font-medium text-indigo-700">
                {pkg.property_limit === null
                  ? labels.customLimit
                  : labels.propertyLimitCount.replace("{count}", String(pkg.property_limit))}
              </p>
              {pkg.contact_sales && (
                <a href={AIPIFY_HOSTS_CONTACT_SALES_ROUTE} className="mt-3 inline-block text-xs font-medium text-indigo-700 hover:underline">
                  {labels.contactSales}
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {showAddForm && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.addPropertyFormTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.addPropertyFormDescription}</p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="flex min-w-[240px] flex-1 flex-col gap-1 text-sm">
              <span className="font-medium text-gray-700">{labels.propertyNameLabel}</span>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
                placeholder={labels.propertyNamePlaceholder}
              />
            </label>
            <button
              type="button"
              onClick={() => void handleAddProperty()}
              disabled={submitting || !propertyName.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? labels.savingProperty : labels.saveProperty}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {labels.cancel}
            </button>
          </div>
        </section>
      )}

      {dashboard.properties.length === 0 ? (
        <PlatformEmptyState
          title={labels.emptyPropertiesTitle}
          message={labels.emptyPropertiesMessage}
          primaryAction={{ label: labels.addProperty, onClick: openAddProperty }}
          secondaryAction={{ label: labels.exploreKnowledge, href: "/app/settings/employee-knowledge" }}
        />
      ) : (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900">{labels.propertiesList}</h2>
            {!atCapacity && (
              <button
                type="button"
                onClick={openAddProperty}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
              >
                {labels.addAnotherProperty}
              </button>
            )}
          </div>
          <ul className="mt-4 divide-y divide-gray-100">
            {dashboard.properties.map((property) => (
              <li key={property.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-medium text-gray-900">{property.display_name}</span>
                <span className="text-gray-500">{property.platform_source ?? labels.directBooking}</span>
                <span className="text-indigo-700">{property.health_score}%</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.successMetrics}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {dashboard.success_metrics.map((metric) => (
            <li key={metric.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
              {metric.label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
