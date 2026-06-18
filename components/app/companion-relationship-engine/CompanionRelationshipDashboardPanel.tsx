"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCompanionRelationshipCenter,
  type CompanionRelationshipCenter,
} from "@/lib/aipify/companion-relationship-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "approved":
    case "active":
    case "improving":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "removed":
    case "declining":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function CompanionRelationshipDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<CompanionRelationshipCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/companion-relationship-engine/dashboard");
    if (res.ok) {
      setCenter(parseCompanionRelationshipCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/companion-relationship-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const exec = center.executive_dashboard ?? {};
  const identity = center.identity_foundation ?? {};
  const prefs = center.user_preferences ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricStatus, metricValue(overview.companion_status)],
            [labels.metricStrength, metricValue(overview.relationship_strength)],
            [labels.metricInteractions, metricValue(overview.interactions)],
            [labels.metricPreferences, metricValue(overview.preferences_count)],
            [labels.metricTrust, metricValue(overview.trust_score)],
            [labels.metricStyle, metricValue(overview.communication_style)],
            [labels.metricHealth, metricValue(overview.relationship_health_score)],
            [labels.metricSatisfaction, metricValue(overview.user_satisfaction)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.identity_relationship_route ? (
            <Link href={center.identity_relationship_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openIdentityRelationship}
            </Link>
          ) : null}
          {center.personalization_route ? (
            <Link href={center.personalization_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openPersonalization}
            </Link>
          ) : null}
          {center.trust_adoption_route ? (
            <Link href={center.trust_adoption_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openTrustAdoption}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="identity" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.identityTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {labels.companionName}: {String(identity.companion_name ?? "Aipify")} · {labels.companionIdentity}:{" "}
          {String(identity.identity ?? "companion")}
        </p>
        {center.core_values?.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {center.core_values.map((value) => (
              <li key={value} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                {value}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-4 text-xs text-gray-500">{labels.identityNotToolNote}</p>
      </section>

      <section id="personality" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.personalityTitle}</h2>
        {center.personality_profiles?.length ? (
          <ul className="mt-4 space-y-3">
            {center.personality_profiles.map((p) => (
              <li key={p.id ?? p.profile_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{p.profile_title}</p>
                <p className="text-xs text-gray-500">
                  {p.personality_type} · {p.core_value}
                </p>
                {p.description ? <p className="mt-1 text-sm text-gray-600">{p.description}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noPersonality}</p>
        )}
      </section>

      <section id="communication" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.communicationTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {labels.currentTone}: {String(prefs.tone ?? "—")} · {labels.currentStyle}:{" "}
          {String(prefs.communication_style ?? "—")} · {labels.currentDetail}: {String(prefs.detail_level ?? "—")}
        </p>
        {center.communication_profiles?.length ? (
          <ul className="mt-4 space-y-3">
            {center.communication_profiles.map((c) => (
              <li key={c.id ?? c.profile_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{c.profile_title}</p>
                <p className="text-xs text-gray-500">
                  {c.audience_type} · {c.tone} · {c.detail_level}
                </p>
                {c.summary ? <p className="mt-1 text-sm text-gray-600">{c.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noCommunication}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() =>
            void runAction("change_communication_style", {
              communication_style: "executive",
              tone: "professional",
            })
          }
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.updateCommunicationStyle}
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="history" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.historyTitle}</h2>
          {center.interaction_history?.length ? (
            <ul className="mt-4 space-y-3">
              {center.interaction_history.map((i) => (
                <li key={i.id ?? i.interaction_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{i.summary}</p>
                  <p className="text-xs text-gray-500">
                    {i.interaction_type}
                    {i.satisfaction_score ? ` · ${labels.satisfactionLabel} ${i.satisfaction_score}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noHistory}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.memoriesTitle}</h2>
          {center.relationship_memories?.length ? (
            <ul className="mt-4 space-y-3">
              {center.relationship_memories.map((m) => (
                <li key={m.id ?? m.memory_key} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium text-gray-900">{m.memory_title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(m.approval_status)}`}>
                      {m.approval_status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{m.memory_type}</p>
                  {m.summary ? <p className="mt-1 text-sm text-gray-600">{m.summary}</p> : null}
                  {m.approval_status === "pending" ? (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={acting}
                        onClick={() => void runAction("approve_memory", { memory_key: m.memory_key })}
                        className="rounded bg-slate-800 px-3 py-1 text-xs text-white disabled:opacity-50"
                      >
                        {labels.approveMemory}
                      </button>
                      <button
                        type="button"
                        disabled={acting}
                        onClick={() => void runAction("remove_memory", { memory_key: m.memory_key })}
                        className="rounded border border-slate-300 px-3 py-1 text-xs disabled:opacity-50"
                      >
                        {labels.removeMemory}
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noMemories}</p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.milestonesTitle}</h2>
        {center.milestones?.length ? (
          <ul className="mt-4 space-y-3">
            {center.milestones.map((m) => (
              <li key={m.id ?? m.milestone_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{m.milestone_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${m.achieved ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                    {m.achieved ? labels.achieved : labels.pending}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{m.milestone_type}</p>
                {m.summary ? <p className="mt-1 text-sm text-gray-600">{m.summary}</p> : null}
                {!m.achieved ? (
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => void runAction("record_milestone", { milestone_key: m.milestone_key })}
                    className="mt-2 rounded bg-slate-800 px-3 py-1 text-xs text-white disabled:opacity-50"
                  >
                    {labels.recordMilestone}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noMilestones}</p>
        )}
      </section>

      <section id="trust" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.trustTitle}</h2>
        {center.trust_signals?.length ? (
          <ul className="mt-4 space-y-3">
            {center.trust_signals.map((t) => (
              <li key={t.id ?? t.signal_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{t.signal_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(t.status)}`}>
                    {t.score}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{t.signal_type}</p>
                {t.observation ? <p className="mt-1 text-sm text-gray-600">{t.observation}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noTrust}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("update_trust_score", { delta: 1 })}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.refreshTrust}
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noIntelligence}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
          {center.advisor_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.advisor_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
          )}
        </section>
      </div>

      <section id="governance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>{labels.governanceUserControlsPersonalization}</li>
          <li>{labels.governanceUserControlsMemory}</li>
          <li>{labels.governanceUserCanReview}</li>
          <li>{labels.governanceUserCanDisable}</li>
          <li>{labels.governanceTrustTransparent}</li>
        </ul>
        <p className="mt-4 text-xs text-gray-500">{center.distinction_note}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("update_preference", { tone: "calm", detail_level: "brief" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.updatePreferences}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("disable_personalization")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.disablePersonalization}
          </button>
        </div>
      </section>

      <section id="analytics" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.auditTitle}</h2>
        {center.audit_logs?.length ? (
          <ul className="mt-4 space-y-2">
            {center.audit_logs.map((log) => (
              <li key={String(log.id)} className="flex justify-between gap-4 text-sm text-gray-700">
                <span>{String(log.summary ?? "")}</span>
                <span className="shrink-0 text-xs uppercase text-gray-400">{String(log.event_type ?? "")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAudit}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("refresh_analytics")}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.refreshAnalytics}
        </button>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {labels.adoptionLabel} {String(exec.companion_adoption ?? "—")} ·{" "}
          {labels.engagementLabel} {String(exec.engagement ?? "—")} · {labels.trustLabel}{" "}
          {String(exec.trust ?? "—")} · {labels.strengthLabel} {String(exec.relationship_strength ?? "—")}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
