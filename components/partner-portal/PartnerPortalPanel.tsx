"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parsePartnerPortalActivity,
  parsePartnerPortalDashboard,
  parsePartnerPortalProfile,
  parsePartnerPortalTeam,
  type PartnerPortalSectionKey,
} from "@/lib/partner-portal";
import { parseGrowthPartnerPortalDashboard } from "@/lib/growth-partner-portal";

type Props = {
  section: PartnerPortalSectionKey;
  labels: Record<string, string>;
};

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

export function PartnerPortalPanel({ section, labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dashboard, setDashboard] = useState<ReturnType<typeof parsePartnerPortalDashboard>>(null);
  const [profile, setProfile] = useState<ReturnType<typeof parsePartnerPortalProfile>>(null);
  const [team, setTeam] = useState<ReturnType<typeof parsePartnerPortalTeam>>(null);
  const [activity, setActivity] = useState<ReturnType<typeof parsePartnerPortalActivity>>(null);
  const [sectionData, setSectionData] = useState<ReturnType<typeof parseGrowthPartnerPortalDashboard>>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const gppSection =
    section === "opportunities"
      ? "leads"
      : section === "customers"
        ? "referrals"
        : section === "materials"
          ? "assets"
          : section === "settlements"
            ? "payouts"
            : section;

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [dashRes, profileRes, activityRes] = await Promise.all([
        fetch("/api/partner/dashboard"),
        fetch("/api/partner/profile"),
        fetch("/api/partner/activity"),
      ]);

      if (dashRes.ok) setDashboard(parsePartnerPortalDashboard(await dashRes.json()));
      if (profileRes.ok) setProfile(parsePartnerPortalProfile(await profileRes.json()));
      if (activityRes.ok) setActivity(parsePartnerPortalActivity(await activityRes.json()));

      if (section === "settings" || section === "performance") {
        const teamRes = await fetch("/api/partner/team");
        if (teamRes.ok) setTeam(parsePartnerPortalTeam(await teamRes.json()));
      }

      if (!["dashboard", "advisor", "settings", "performance"].includes(section)) {
        const secRes = await fetch(
          `/api/growth-partner-portal/dashboard?section=${gppSection}`,
        );
        if (secRes.ok) {
          setSectionData(parseGrowthPartnerPortalDashboard(await secRes.json()));
        }
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [gppSection, section]);

  useEffect(() => {
    void load();
  }, [load]);

  const advanceOnboarding = async (step: string) => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step }),
    });
    if (res.ok) {
      setProfile(parsePartnerPortalProfile(await res.json()));
      setMessage(labels.onboardingStarted);
      await load();
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const patch = Object.fromEntries(form.entries());
    const res = await fetch("/api/partner/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setProfile(parsePartnerPortalProfile(await res.json()));
      setMessage(labels.profileSaved);
      await load();
    } else {
      const err = (await res.json()) as { error?: string };
      setMessage(err.error ?? labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading && !dashboard) {
    return (
      <div className="space-y-3">
        <AipifyLoader centered />
        <p className="text-center text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error || !dashboard || !profile) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const showOnboardingEmpty =
    dashboard.onboarding.completion_pct < 100 && section === "dashboard";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {labels[`section_${section}_title`] ?? section}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {labels[`section_${section}_subtitle`] ?? dashboard.positioning}
        </p>
      </div>

      {showOnboardingEmpty && (
        <PlatformEmptyState
          title={labels.emptyWelcomeTitle}
          message={labels.emptyWelcomeMessage}
          primaryAction={{
            label: labels.completeOnboarding,
            onClick: () => void advanceOnboarding(profile.onboarding.recommended_next_step),
          }}
        />
      )}

      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          {message}
        </p>
      )}

      {section === "dashboard" && (
        <>
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
            <p className="text-sm font-medium text-indigo-950">{dashboard.positioning}</p>
            <p className="mt-2 text-xs text-indigo-900">
              {dashboard.org_name} · {labelFor(labels, "partnerType", dashboard.partner_type)}
            </p>
          </section>

          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard label={labels.healthScore} value={dashboard.health_score} />
            <MetricCard label={labels.activeOpportunities} value={dashboard.active_opportunities} />
            <MetricCard label={labels.customersIntroduced} value={dashboard.customers_introduced} />
            <MetricCard
              label={labels.pendingCommissions}
              value={Number(dashboard.pending_commissions).toLocaleString()}
            />
            <MetricCard
              label={labels.pendingSettlements}
              value={Number(dashboard.pending_settlements).toLocaleString()}
            />
            <MetricCard
              label={labels.certificationStatus}
              value={labelFor(labels, "certificationStatus", dashboard.certification_status)}
              sub={`${dashboard.certification_progress}% ${labels.certificationProgress}`}
            />
          </dl>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">{labels.performanceOverview}</h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <MetricCard
                label={labels.leadsThisMonth}
                value={dashboard.performance_overview.leads_this_month}
              />
              <MetricCard
                label={labels.activeReferrals}
                value={dashboard.performance_overview.active_referrals}
              />
              <MetricCard
                label={labels.conversionRate}
                value={`${dashboard.performance_overview.conversion_rate_pct}%`}
              />
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">{labels.onboardingProgress}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {dashboard.onboarding.completion_pct}% · {labels.nextStep}:{" "}
              {labelFor(labels, "onboardingStep", dashboard.onboarding.recommended_next_step)}
            </p>
            {dashboard.onboarding.completion_pct < 100 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void advanceOnboarding(dashboard.onboarding.recommended_next_step)}
                className="mt-4 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-50"
              >
                {labels.completeOnboarding}
              </button>
            )}
          </section>

          {activity && activity.activity.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900">{labels.activityFeed}</h3>
              <ul className="mt-4 space-y-3">
                {activity.activity.slice(0, 5).map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-slate-600">{item.summary}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {section === "performance" && (
        <dl className="grid gap-4 sm:grid-cols-2">
          <MetricCard label={labels.healthScore} value={dashboard.health_score} />
          <MetricCard
            label={labels.conversionRate}
            value={`${dashboard.performance_overview.conversion_rate_pct}%`}
          />
          {team && (
            <>
              <MetricCard label={labels.activeMembers} value={team.team_performance.active_members} />
              <MetricCard label={labels.invitedMembers} value={team.team_performance.invited_members} />
            </>
          )}
        </dl>
      )}

      {section === "advisor" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-700">{labels.advisorDescription}</p>
          <p className="mt-4 text-sm text-slate-600">{labels.advisorNote}</p>
        </div>
      )}

      {section === "settings" && profile && (
        <div className="space-y-6">
          <form onSubmit={saveProfile} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">{labels.businessInformation}</h3>
            {[
              "company_name",
              "organization_number",
              "vat_number",
              "business_address",
              "contact_email",
              "contact_phone",
              "website",
              "country_code",
              "preferred_language",
            ].map((field) => (
              <label key={field} className="block text-sm">
                <span className="font-medium text-slate-700">
                  {labels[`field_${field}`] ?? field}
                </span>
                <input
                  name={field}
                  defaultValue={profile.profile[field as keyof typeof profile.profile] as string}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </label>
            ))}
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-50"
            >
              {labels.saveProfile}
            </button>
          </form>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">{labels.verificationTitle}</h3>
            <ul className="mt-4 space-y-2">
              {profile.verifications.map((v) => (
                <li key={v.verification_type} className="flex justify-between text-sm">
                  <span>{labelFor(labels, "verificationType", v.verification_type)}</span>
                  <span>{labelFor(labels, "verificationStatus", v.verification_status)}</span>
                </li>
              ))}
            </ul>
            {!profile.business_verified && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void advanceOnboarding("verify_business")}
                className="mt-4 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
              >
                {labels.submitVerification}
              </button>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">{labels.securityTitle}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {profile.two_factor.enabled ? labels.twoFactorEnabled : labels.twoFactorRequired}
            </p>
            <Link
              href="/partner/settings/security"
              className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:underline"
            >
              {labels.manageTwoFactor}
            </Link>
          </section>

          {team && (
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900">{labels.teamTitle}</h3>
              <ul className="mt-4 space-y-2">
                {team.members.map((m) => (
                  <li key={m.id} className="flex justify-between text-sm">
                    <span>
                      {m.member_name} · {labelFor(labels, "teamRole", m.team_role)}
                    </span>
                    <span>{labelFor(labels, "memberStatus", m.member_status)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {sectionData && ["opportunities", "customers", "commissions", "settlements", "academy", "materials"].includes(section) && (
        <SectionTable section={section} data={sectionData} labels={labels} />
      )}
    </div>
  );
}

function SectionTable({
  section,
  data,
  labels,
}: {
  section: PartnerPortalSectionKey;
  data: NonNullable<ReturnType<typeof parseGrowthPartnerPortalDashboard>>;
  labels: Record<string, string>;
}) {
  if (section === "opportunities") {
    if (data.leads.length === 0) {
      return <p className="text-sm text-slate-500">{labels.emptyOpportunities}</p>;
    }
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">{labels.company}</th>
              <th className="px-4 py-3">{labels.contact}</th>
              <th className="px-4 py-3">{labels.status}</th>
            </tr>
          </thead>
          <tbody>
            {data.leads.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-4 py-3">{row.company_name}</td>
                <td className="px-4 py-3">{row.contact_name}</td>
                <td className="px-4 py-3">{row.lead_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section === "customers") {
    if (data.referrals.length === 0) {
      return <p className="text-sm text-slate-500">{labels.emptyCustomers}</p>;
    }
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">{labels.prospect}</th>
              <th className="px-4 py-3">{labels.status}</th>
            </tr>
          </thead>
          <tbody>
            {data.referrals.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-4 py-3">{row.prospect_name}</td>
                <td className="px-4 py-3">{row.referral_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section === "commissions") {
    if (data.commissions.length === 0) {
      return <p className="text-sm text-slate-500">{labels.emptyCommissions}</p>;
    }
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">{labels.customer}</th>
              <th className="px-4 py-3">{labels.amount}</th>
              <th className="px-4 py-3">{labels.status}</th>
            </tr>
          </thead>
          <tbody>
            {data.commissions.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-4 py-3">{row.customer_label}</td>
                <td className="px-4 py-3">{row.amount}</td>
                <td className="px-4 py-3">{row.commission_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section === "settlements") {
    if (data.payouts.length === 0) {
      return <p className="text-sm text-slate-500">{labels.emptySettlements}</p>;
    }
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">{labels.period}</th>
              <th className="px-4 py-3">{labels.amount}</th>
              <th className="px-4 py-3">{labels.status}</th>
            </tr>
          </thead>
          <tbody>
            {data.payouts.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-4 py-3">{row.payout_period}</td>
                <td className="px-4 py-3">{row.total_amount}</td>
                <td className="px-4 py-3">{row.payout_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section === "academy" && data.academy) {
    if (data.academy.modules.length === 0) {
      return <p className="text-sm text-slate-500">{labels.emptyAcademy}</p>;
    }
    return (
      <ul className="space-y-3">
        {data.academy.modules.map((mod) => (
          <li key={mod.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-medium text-slate-900">{mod.title}</p>
            <p className="mt-1 text-sm text-slate-600">{mod.summary}</p>
            <p className="mt-2 text-xs text-slate-500">{mod.progress_pct}%</p>
          </li>
        ))}
      </ul>
    );
  }

  if (section === "materials") {
    if (data.assets.length === 0) {
      return <p className="text-sm text-slate-500">{labels.emptyMaterials}</p>;
    }
    return (
      <ul className="space-y-3">
        {data.assets.map((asset) => (
          <li key={asset.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-medium text-slate-900">{asset.title}</p>
            <p className="mt-1 text-sm text-slate-600">{asset.description}</p>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}
