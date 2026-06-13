"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  TRUST_TRANSPARENCY_CORE_PRINCIPLE,
  TRUST_TRANSPARENCY_VISION,
  parseTrustTransparencyCenter,
  type SelfHealingEvent,
  type TransparencyItem,
  type TrustTransparencyCenter,
} from "@/lib/trust-transparency";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  visionTitle: string;
  governanceLink: string;
  governanceTrustLink: string;
  approvalCenterLink: string;
  permissionsAccessLink: string;
  dashboardTitle: string;
  trustIndicatorsTitle: string;
  sections: {
    activity: string;
    decision: string;
    permission: string;
    approval: string;
    selfHealing: string;
    recommendation: string;
    audit: string;
  };
  emptySection: string;
  action: string;
  why: string;
  permissionsUsed: string;
  riskLevel: string;
  userControl: string;
  infoConsidered: string;
  alternatives: string;
  ifNothingDone: string;
  companion: string;
  approvalRequired: string;
  outcome: string;
  whatFailed: string;
  aipifyAttempt: string;
  recoverySucceeded: string;
  recoveryFailed: string;
  downtimePrevented: string;
  manualReview: string;
  governanceRecommendationsTitle: string;
  emptyRecommendations: string;
  dismiss: string;
  requestReview: string;
  disableCategory: string;
  riskLevels: Record<string, string>;
  eventTypes: Record<string, string>;
  metrics: {
    actionsMonth: string;
    recommendations: string;
    approved: string;
    rejected: string;
    selfHealing: string;
    compliance: string;
  };
  indicators: {
    governance: string;
    permissionHygiene: string;
    approvalResponsiveness: string;
    transparency: string;
    selfHealing: string;
  };
  privacyNote: string;
};

type Props = { labels: PanelLabels; locale: string };

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-800",
  moderate: "bg-sky-100 text-sky-800",
  elevated: "bg-amber-100 text-amber-900",
  high: "bg-rose-100 text-rose-900",
};

export function TrustTransparencyPanel({ labels, locale }: Props) {
  const [center, setCenter] = useState<TrustTransparencyCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/trust-transparency/center");
    if (res.ok) setCenter(parseTrustTransparencyCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/trust-transparency/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const dash = center?.dashboard;
  const indicators = center?.trust_indicators;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.governance && (
          <Link href={center.links.governance} className="text-slate-600 hover:underline">
            {labels.governanceLink}
          </Link>
        )}
        {center?.links?.governance_trust && (
          <Link href={center.links.governance_trust} className="text-slate-600 hover:underline">
            {labels.governanceTrustLink}
          </Link>
        )}
        {center?.links?.approval_center && (
          <Link href={center.links.approval_center} className="text-slate-600 hover:underline">
            {labels.approvalCenterLink}
          </Link>
        )}
        {center?.links?.permissions_access && (
          <Link href={center.links.permissions_access} className="text-slate-600 hover:underline">
            {labels.permissionsAccessLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {TRUST_TRANSPARENCY_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.visionTitle}: {TRUST_TRANSPARENCY_VISION}
        </p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label={labels.metrics.actionsMonth} value={dash.actions_this_month} />
            <Metric label={labels.metrics.recommendations} value={dash.recommendations_generated} />
            <Metric label={labels.metrics.approved} value={dash.actions_approved} />
            <Metric label={labels.metrics.rejected} value={dash.actions_rejected} />
            <Metric label={labels.metrics.selfHealing} value={dash.self_healing_interventions} />
            <Metric label={labels.metrics.compliance} value={`${dash.governance_compliance_rate}%`} />
          </dl>
        </section>
      )}

      {indicators && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.trustIndicatorsTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Metric label={labels.indicators.governance} value={`${indicators.governance_score}%`} />
            <Metric label={labels.indicators.permissionHygiene} value={`${indicators.permission_hygiene_score}%`} />
            <Metric label={labels.indicators.approvalResponsiveness} value={`${indicators.approval_responsiveness}%`} />
            <Metric label={labels.indicators.transparency} value={`${indicators.transparency_completeness}%`} />
            <Metric label={labels.indicators.selfHealing} value={`${indicators.self_healing_effectiveness}%`} />
          </dl>
        </section>
      )}

      <ItemSection
        title={labels.sections.activity}
        items={center?.activity_overview ?? []}
        labels={labels}
        locale={locale}
        empty={labels.emptySection}
      />

      <ItemSection
        title={labels.sections.decision}
        items={center?.decision_explanations ?? []}
        labels={labels}
        locale={locale}
        empty={labels.emptySection}
        detailed
      />

      <ItemSection
        title={labels.sections.permission}
        items={center?.permissions_used ?? []}
        labels={labels}
        locale={locale}
        empty={labels.emptySection}
      />

      <ItemSection
        title={labels.sections.approval}
        items={center?.approval_history ?? []}
        labels={labels}
        locale={locale}
        empty={labels.emptySection}
      />

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.selfHealing}</h2>
        {(center?.self_healing.length ?? 0) === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center?.self_healing.map((event) => (
              <SelfHealingCard key={event.healing_key} event={event} labels={labels} locale={locale} />
            ))}
          </ul>
        )}
      </section>

      <ItemSection
        title={labels.sections.recommendation}
        items={center?.recommendations_generated ?? []}
        labels={labels}
        locale={locale}
        empty={labels.emptySection}
        detailed
      />

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.audit}</h2>
        {(center?.audit_timeline.length ?? 0) === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {center?.audit_timeline.map((entry) => (
              <li key={entry.audit_key} className="rounded-xl border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{entry.summary}</p>
                <p className="text-gray-600">
                  {labels.eventTypes[entry.event_type] ?? entry.event_type}
                  {entry.actor_label ? ` · ${entry.actor_label}` : ""}
                </p>
                {entry.created_at && (
                  <p className="text-xs text-gray-500">{formatDateTime(entry.created_at, locale)}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceRecommendationsTitle}</h2>
        {(center?.governance_recommendations.length ?? 0) === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyRecommendations}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {center?.governance_recommendations.map((rec) => (
              <li key={rec.recommendation_key} className="rounded-xl border border-slate-100 p-3 text-sm">
                <p className="text-gray-800">{rec.message}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {center?.can_manage && (
                    <ActionBtn
                      label={labels.dismiss}
                      variant="muted"
                      onClick={() =>
                        void postAction({
                          action: "dismiss_recommendation",
                          recommendation_key: rec.recommendation_key,
                        })
                      }
                    />
                  )}
                  {center?.can_record && (
                    <ActionBtn
                      label={labels.requestReview}
                      variant="muted"
                      onClick={() =>
                        void postAction({
                          action: "request_human_review",
                          reason: rec.message,
                        })
                      }
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">
          {labels.privacyNote}: {center.privacy_note}
        </p>
      )}
    </div>
  );
}

function ItemSection({
  title,
  items,
  labels,
  locale,
  empty,
  detailed = false,
}: {
  title: string;
  items: TransparencyItem[];
  labels: PanelLabels;
  locale: string;
  empty: string;
  detailed?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <TransparencyCard
              key={item.item_key}
              item={item}
              labels={labels}
              locale={locale}
              detailed={detailed}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function TransparencyCard({
  item,
  labels,
  locale,
  detailed,
}: {
  item: TransparencyItem;
  labels: PanelLabels;
  locale: string;
  detailed?: boolean;
}) {
  return (
    <li className="rounded-xl border border-gray-100 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-semibold text-gray-900">{item.action_title}</p>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${RISK_STYLES[item.risk_level] ?? RISK_STYLES.low}`}
        >
          {labels.riskLevels[item.risk_level] ?? item.risk_level}
        </span>
      </div>
      <p className="mt-2 text-gray-700">
        <span className="font-medium">{labels.why}:</span> {item.why_summary}
      </p>
      {item.permissions_used && (
        <p className="mt-1 text-gray-600">
          <span className="font-medium">{labels.permissionsUsed}:</span> {item.permissions_used}
        </p>
      )}
      {item.companion_label && (
        <p className="mt-1 text-gray-600">
          <span className="font-medium">{labels.companion}:</span> {item.companion_label}
        </p>
      )}
      {detailed && item.info_considered && (
        <p className="mt-1 text-gray-600">
          <span className="font-medium">{labels.infoConsidered}:</span> {item.info_considered}
        </p>
      )}
      {detailed && item.alternatives && (
        <p className="mt-1 text-gray-600">
          <span className="font-medium">{labels.alternatives}:</span> {item.alternatives}
        </p>
      )}
      {detailed && item.if_nothing_done && (
        <p className="mt-1 text-gray-600">
          <span className="font-medium">{labels.ifNothingDone}:</span> {item.if_nothing_done}
        </p>
      )}
      {item.user_control_hint && (
        <p className="mt-2 text-gray-600">
          <span className="font-medium">{labels.userControl}:</span> {item.user_control_hint}
        </p>
      )}
      {item.outcome && (
        <p className="mt-1 text-gray-600">
          <span className="font-medium">{labels.outcome}:</span> {item.outcome}
        </p>
      )}
      {item.created_at && (
        <p className="mt-2 text-xs text-gray-500">{formatDateTime(item.created_at, locale)}</p>
      )}
    </li>
  );
}

function SelfHealingCard({
  event,
  labels,
  locale,
}: {
  event: SelfHealingEvent;
  labels: PanelLabels;
  locale: string;
}) {
  return (
    <li
      className={`rounded-xl border p-4 text-sm ${event.recovery_succeeded ? "border-emerald-100 bg-emerald-50/40" : "border-amber-100 bg-amber-50/40"}`}
    >
      <p className="font-medium text-gray-900">
        {event.recovery_succeeded ? labels.recoverySucceeded : labels.recoveryFailed}
      </p>
      <p className="mt-2">
        <span className="font-medium">{labels.whatFailed}:</span> {event.what_failed}
      </p>
      <p className="mt-1">
        <span className="font-medium">{labels.aipifyAttempt}:</span> {event.aipify_attempt}
      </p>
      {event.downtime_prevented_minutes > 0 && (
        <p className="mt-1 text-gray-600">
          {labels.downtimePrevented}: {event.downtime_prevented_minutes} min
        </p>
      )}
      {event.manual_intervention_required && (
        <p className="mt-1 font-medium text-amber-900">{labels.manualReview}</p>
      )}
      {event.created_at && (
        <p className="mt-2 text-xs text-gray-500">{formatDateTime(event.created_at, locale)}</p>
      )}
    </li>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  variant = "primary",
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "muted";
}) {
  const styles =
    variant === "muted"
      ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      : "border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${styles}`}
    >
      {label}
    </button>
  );
}
