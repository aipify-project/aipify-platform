"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsReferralDashboard,
  parseGenerateReferralLinkResult,
  type AipifyHostsReferralDashboard,
  type HostsReferralModule,
  type HostsReferralRecord,
  type HostsReferralReward,
} from "@/lib/aipify/aipify-hosts-referral";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-5">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">{value}</dd>
    </div>
  );
}

function statusStyle(status: string): string {
  const map: Record<string, string> = {
    invited: "bg-sky-50 text-sky-800 ring-sky-200",
    registered: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    trial_started: "bg-violet-50 text-violet-800 ring-violet-200",
    converted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    active: "bg-teal-50 text-teal-800 ring-teal-200",
    rewarded: "bg-amber-50 text-amber-900 ring-amber-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function statusLabel(status: string, labels: Record<string, string>): string {
  const key = `status_${status}` as keyof typeof labels;
  return labels[key] ?? status.replace(/_/g, " ");
}

function ModuleCard({ module, includedLabel }: { module: HostsReferralModule; includedLabel: string }) {
  return (
    <article className="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{module.label}</h3>
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">{includedLabel}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
    </article>
  );
}

export function AipifyHostsReferralDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyHostsReferralDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedRole, setSelectedRole] = useState("host");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/referrals/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyHostsReferralDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleGenerateLink = async () => {
    setBusy(true);
    setCopied(false);
    const res = await fetch("/api/aipify/aipify-hosts/referrals/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referral_role: selectedRole }),
    });
    const result = parseGenerateReferralLinkResult(await res.json());
    setBusy(false);
    if (result.success && result.referral_url) {
      setGeneratedUrl(result.referral_url);
      await load();
    }
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
  };

  if (loading && !dashboard) {
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

  const w = dashboard.widgets;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-6">
        <p className="text-sm font-medium text-violet-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-violet-900">{dashboard.governance.principle}</p>
        <Link
          href="/app/aipify-hosts"
          className="mt-4 inline-flex rounded-lg border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-50"
        >
          {labels.backToHosts}
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.referralsThisMonth} value={w.referrals_this_month} />
        <MetricCard label={labels.activeReferrals} value={w.active_referrals} />
        <MetricCard label={labels.pendingRewards} value={w.pending_rewards} />
        <MetricCard label={labels.lifetimeReferrals} value={w.lifetime_referrals} />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.generateLink}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.generateLinkDescription}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">{labels.referralRole}</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="host">{labels.roleHost}</option>
              <option value="service_provider">{labels.roleServiceProvider}</option>
              <option value="growth_partner">{labels.roleGrowthPartner}</option>
            </select>
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleGenerateLink()}
            className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-800 disabled:opacity-60"
          >
            {busy ? labels.generating : labels.generateLinkAction}
          </button>
        </div>
        {generatedUrl && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="flex-1 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-800">{generatedUrl}</code>
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {copied ? labels.copied : labels.copyLink}
            </button>
          </div>
        )}
        {dashboard.referral_links.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {dashboard.referral_links.map((link) => (
              <li key={link.referral_code}>
                <span className="font-medium">{link.referral_role.replace(/_/g, " ")}:</span> {link.referral_url}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.rewardCatalog}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {dashboard.reward_catalog.map((item) => (
            <li key={item.key} className="rounded-xl border border-gray-100 p-4">
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="mt-1 text-sm text-gray-600">{item.reward}</p>
            </li>
          ))}
        </ul>
      </section>

      {dashboard.referrals.length === 0 ? (
        <PlatformEmptyState
          title={labels.emptyReferralsTitle}
          message={labels.emptyReferralsMessage}
          primaryAction={{ label: labels.generateLinkAction, onClick: () => void handleGenerateLink() }}
        />
      ) : (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.referralTracking}</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {dashboard.referrals.map((ref: HostsReferralRecord) => (
              <li key={ref.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-gray-900">{ref.referred_label}</p>
                  <p className="text-xs text-gray-500">{ref.referral_role.replace(/_/g, " ")}</p>
                </div>
                <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusStyle(ref.status)}`}>
                  {statusLabel(ref.status, labels)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.rewards.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.rewards}</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {dashboard.rewards.map((reward: HostsReferralReward) => (
              <li key={reward.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-medium text-gray-900">{reward.reward_label}</span>
                <span className="text-gray-600">{reward.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.growth_partner.enabled && (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-950">{labels.growthPartner}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <MetricCard label={labels.accountsOversight} value={dashboard.growth_partner.accounts_oversight ?? 0} />
            <MetricCard
              label={labels.conversionRate}
              value={`${dashboard.growth_partner.conversion_rate_pct ?? 0}%`}
            />
            <MetricCard
              label={labels.commissionPending}
              value={
                dashboard.growth_partner.commission_summary
                  ? `${dashboard.growth_partner.commission_summary.pending} ${dashboard.growth_partner.commission_summary.currency}`
                  : "—"
              }
            />
          </dl>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.referralAssets}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {dashboard.referral_assets.map((asset) => (
            <li key={asset.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
              {asset.label} ({asset.format.toUpperCase()})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.modules}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.modules.map((module) => (
            <ModuleCard key={module.key} module={module} includedLabel={labels.included} />
          ))}
        </div>
      </section>

      {dashboard.recent_events.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.recentActivity}</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {dashboard.recent_events.map((event, i) => (
              <li key={`${event.event_type}-${i}`}>
                {event.summary ?? event.event_type}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.notifications}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {dashboard.notification_triggers.map((trigger) => (
            <li key={trigger} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
              {trigger}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
