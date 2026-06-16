"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseGrowthPartnerPortalActionResult,
  parseGrowthPartnerPortalDashboard,
  type GrowthPartnerPortalDashboard,
  type GrowthPartnerPortalSectionKey,
} from "@/lib/growth-partner-portal";

type Props = {
  section: GrowthPartnerPortalSectionKey;
  labels: Record<string, string>;
};

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    new: "bg-sky-50 text-sky-800 ring-sky-200",
    contacted: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    qualified: "bg-violet-50 text-violet-800 ring-violet-200",
    trial_started: "bg-amber-50 text-amber-900 ring-amber-200",
    converted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    lost: "bg-gray-100 text-gray-700 ring-gray-200",
    invited: "bg-sky-50 text-sky-800 ring-sky-200",
    registered: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    rewarded: "bg-violet-50 text-violet-800 ring-violet-200",
    pending: "bg-amber-50 text-amber-900 ring-amber-200",
    approved: "bg-blue-50 text-blue-800 ring-blue-200",
    scheduled: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    paid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    rejected: "bg-red-50 text-red-800 ring-red-200",
    completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    processing: "bg-amber-50 text-amber-900 ring-amber-200",
    failed: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center">
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export function GrowthPartnerPortalPanel({ section, labels }: Props) {
  const [dashboard, setDashboard] = useState<GrowthPartnerPortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/growth-partner-portal/dashboard?section=${section}`);
    if (res.ok) {
      setDashboard(parseGrowthPartnerPortalDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [section]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/growth-partner-portal/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseGrowthPartnerPortalActionResult(await res.json());
    setBusy(false);
    setActionMessage(result.success ? (result.summary ?? labels.actionRecorded) : (result.summary ?? labels.actionFailed));
    if (result.success) await load();
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-indigo-900">{labels.governanceNote}</p>
        <p className="mt-2 text-xs text-indigo-800">{dashboard.org_name} · {labelFor(labels, "teamRole", dashboard.team_role)}</p>
      </section>

      {(section === "dashboard") && (
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard label={labels.leadsThisMonth} value={dashboard.stats.leads_this_month} />
          <MetricCard label={labels.activeReferrals} value={dashboard.stats.active_referrals} />
          <MetricCard label={labels.convertedCustomers} value={dashboard.stats.converted_customers} />
          <MetricCard label={labels.pendingCommissions} value={`${dashboard.stats.pending_commissions.toLocaleString()}`} />
          <MetricCard label={labels.upcomingPayouts} value={`${dashboard.stats.upcoming_payouts.toLocaleString()}`} />
          <MetricCard
            label={labels.certificationStatus}
            value={labelFor(labels, "certificationStatus", dashboard.stats.certification_status)}
          />
        </dl>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {section === "leads" && (
        dashboard.leads.length === 0 ? (
          <EmptyBoard title={labels.emptyLeadsTitle} message={labels.emptyLeadsMessage} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{labels.company}</th>
                  <th className="px-4 py-3">{labels.contact}</th>
                  <th className="px-4 py-3">{labels.status}</th>
                  <th className="px-4 py-3">{labels.source}</th>
                  <th className="px-4 py-3">{labels.actions}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.leads.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium">{row.company_name}</td>
                    <td className="px-4 py-3">
                      <div>{row.contact_name}</div>
                      <div className="text-xs text-slate-500">{row.contact_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.lead_status)}`}>
                        {labelFor(labels, "leadStatus", row.lead_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.source || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {row.lead_status === "new" && (
                          <button type="button" disabled={busy} onClick={() => void runAction({ action_type: "update_lead_status", entity_id: row.id, status: "contacted" })} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.markContacted}</button>
                        )}
                        {row.lead_status === "contacted" && (
                          <button type="button" disabled={busy} onClick={() => void runAction({ action_type: "update_lead_status", entity_id: row.id, status: "qualified" })} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.markQualified}</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {section === "referrals" && (
        dashboard.referrals.length === 0 ? (
          <EmptyBoard title={labels.emptyReferralsTitle} message={labels.emptyReferralsMessage} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{labels.prospect}</th>
                  <th className="px-4 py-3">{labels.status}</th>
                  <th className="px-4 py-3">{labels.invitedAt}</th>
                  <th className="px-4 py-3">{labels.actions}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.referrals.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.prospect_name}</div>
                      <div className="text-xs text-slate-500">{row.prospect_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.referral_status)}`}>
                        {labelFor(labels, "referralStatus", row.referral_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.invited_at ? row.invited_at.slice(0, 10) : "—"}</td>
                    <td className="px-4 py-3">
                      {row.referral_status === "invited" && (
                        <button type="button" disabled={busy} onClick={() => void runAction({ action_type: "update_referral_status", entity_id: row.id, status: "registered" })} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.markRegistered}</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {section === "commissions" && (
        dashboard.commissions.length === 0 ? (
          <EmptyBoard title={labels.emptyCommissionsTitle} message={labels.emptyCommissionsMessage} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{labels.customer}</th>
                  <th className="px-4 py-3">{labels.amount}</th>
                  <th className="px-4 py-3">{labels.status}</th>
                  <th className="px-4 py-3">{labels.expectedPayout}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.commissions.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium">{row.customer_label}</td>
                    <td className="px-4 py-3">{row.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.commission_status)}`}>
                        {labelFor(labels, "commissionStatus", row.commission_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.expected_payout_date || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {section === "payouts" && (
        dashboard.payouts.length === 0 ? (
          <EmptyBoard title={labels.emptyPayoutsTitle} message={labels.emptyPayoutsMessage} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{labels.period}</th>
                  <th className="px-4 py-3">{labels.amount}</th>
                  <th className="px-4 py-3">{labels.status}</th>
                  <th className="px-4 py-3">{labels.scheduledDate}</th>
                  <th className="px-4 py-3">{labels.actions}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.payouts.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium">{row.payout_period}</td>
                    <td className="px-4 py-3">{row.total_amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.payout_status)}`}>
                        {labelFor(labels, "payoutStatus", row.payout_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.scheduled_date || "—"}</td>
                    <td className="px-4 py-3">
                      <button type="button" disabled={busy} onClick={() => void runAction({ action_type: "record_payout_view", entity_id: row.id })} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.viewPayout}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {section === "academy" && dashboard.academy && (
        dashboard.academy.modules.length === 0 ? (
          <EmptyBoard title={labels.emptyAcademyTitle} message={labels.emptyAcademyMessage} />
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{labels.certificationProgress}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{dashboard.academy.certification_progress}%</p>
            </div>
            <ul className="space-y-3">
              {dashboard.academy.modules.map((mod) => (
                <li key={mod.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{mod.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{labelFor(labels, "moduleType", mod.module_type)}</p>
                      {mod.summary && <p className="mt-2 text-sm text-slate-600">{mod.summary}</p>}
                    </div>
                    <span className="text-sm font-medium text-indigo-700">{mod.progress_pct}% {mod.completed ? labels.completed : ""}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-600" style={{ width: `${mod.progress_pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      )}

      {section === "assets" && (
        dashboard.assets.length === 0 ? (
          <EmptyBoard title={labels.emptyAssetsTitle} message={labels.emptyAssetsMessage} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {dashboard.assets.map((asset) => (
              <article key={asset.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase text-slate-500">{labelFor(labels, "assetType", asset.asset_type)}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{asset.title}</h3>
                {asset.description && <p className="mt-2 text-sm text-slate-600">{asset.description}</p>}
                <button type="button" className="mt-4 text-sm font-medium text-indigo-700">{asset.download_label}</button>
              </article>
            ))}
          </div>
        )
      )}

      {section === "team" && (
        dashboard.team.length === 0 ? (
          <EmptyBoard title={labels.emptyTeamTitle} message={labels.emptyTeamMessage} />
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{labels.member}</th>
                    <th className="px-4 py-3">{labels.role}</th>
                    <th className="px-4 py-3">{labels.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.team.map((member) => (
                    <tr key={member.id} className="border-b border-slate-100">
                      <td className="px-4 py-3">
                        <div className="font-medium">{member.member_name}</div>
                        <div className="text-xs text-slate-500">{member.member_email}</div>
                      </td>
                      <td className="px-4 py-3">{labelFor(labels, "teamRole", member.team_role)}</td>
                      <td className="px-4 py-3">{labelFor(labels, "memberStatus", member.member_status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(dashboard.team_role === "partner_owner" || dashboard.team_role === "partner_manager") && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction({
                  action_type: "invite_team_member",
                  email: labels.defaultInviteEmail,
                  name: labels.defaultInviteName,
                  role: "sales_member",
                })}
                className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {labels.inviteMember}
              </button>
            )}
          </div>
        )
      )}

      {section === "settings" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">{labels.settingsTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.settingsDescription}</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{labels.notificationEmail}</dt>
              <dd className="font-medium text-slate-900">{dashboard.settings.notification_email || "—"}</dd>
            </div>
          </dl>
          {dashboard.team_role === "partner_owner" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction({ action_type: "update_settings", email: labels.defaultNotificationEmail })}
              className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
            >
              {labels.updateSettings}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
