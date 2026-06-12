"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseComplianceRegulatoryReadinessEngineDashboard,
  type BlueprintItem,
  type BlueprintObjective,
  type ComplianceAuditReadinessItem,
  type CompliancePolicyRegistryItem,
  type ComplianceRegulatoryReadinessEngineDashboard,
  type ComplianceReviewCycle,
  type IntegrationLink,
} from "@/lib/aipify/compliance-regulatory-readiness-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function BlueprintItemCard({ item }: { item: BlueprintItem }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{item.label}</span>
      {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
    </div>
  );
}

function PolicyRow({ policy }: { policy: CompliancePolicyRegistryItem }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <div>
        <p className="font-medium text-gray-900">{policy.title}</p>
        <p className="text-xs text-gray-500">{policy.policy_type}</p>
      </div>
      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{policy.status}</span>
    </div>
  );
}

function ReviewCycleRow({
  cycle,
  labels,
  onAttest,
  busy,
}: {
  cycle: ComplianceReviewCycle;
  labels: Record<string, string>;
  onAttest: (id: string, attested: boolean) => void;
  busy: boolean;
}) {
  const needsAttestation = cycle.attestation_status === "pending" && cycle.id;
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-gray-900">{cycle.title}</p>
          <p className="text-xs text-gray-500">{cycle.review_type}</p>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-800">{cycle.status}</span>
      </div>
      {needsAttestation ? (
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAttest(cycle.id!, true)}
            className="rounded-md bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {labels.attest}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAttest(cycle.id!, false)}
            className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {labels.declineAttestation}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AuditItemRow({ item }: { item: ComplianceAuditReadinessItem }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <div>
        <p className="font-medium text-gray-900">{item.title}</p>
        <p className="text-xs text-gray-500">{item.evidence_type}</p>
      </div>
      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{item.status}</span>
    </div>
  );
}

export function ComplianceRegulatoryReadinessEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ComplianceRegulatoryReadinessEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/compliance-regulatory-readiness-engine/dashboard");
    if (res.ok) setDashboard(parseComplianceRegulatoryReadinessEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const recordAttestation = async (cycleId: string, attested: boolean) => {
    setBusyId(cycleId);
    setActionError(null);
    const res = await fetch("/api/aipify/compliance-regulatory-readiness-engine/attestation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cycle_id: cycleId, attested }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  };

  const scheduleReview = async () => {
    setScheduling(true);
    setActionError(null);
    const res = await fetch("/api/aipify/compliance-regulatory-readiness-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review_type: "readiness_assessment",
        title: labels.defaultReviewTitle,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setScheduling(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const engagement = dashboard.engagement_summary;
  const sections = dashboard.sections ?? {};
  const policies = sections.policy_registry ?? [];
  const reviewCycles = sections.review_cycles ?? [];
  const auditItems = sections.audit_readiness_items ?? [];
  const blueprintLinks: IntegrationLink[] = dashboard.phase145_integration_links ?? [];
  const companion = dashboard.compliance_companion;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-amber-300 bg-amber-50 p-4">
        <h2 className="text-sm font-semibold text-amber-900">{labels.legalDisclaimerTitle}</h2>
        <p className="mt-2 text-sm text-amber-900">
          {dashboard.legal_disclaimer ?? companion?.legal_disclaimer ?? labels.legalDisclaimerBody}
        </p>
      </section>

      {blueprintLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {blueprintLinks.map((link) =>
            link.route ? (
              <Link
                key={link.route}
                href={link.route}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ) : null,
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.global_compliance_regulatory_intelligence_note ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.global_compliance_regulatory_intelligence_note}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-2 text-xs text-gray-600">{dashboard.vision}</p> : null}
      </section>

      {engagement ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: labels.openRecords, value: engagement.open_records },
            { label: labels.activePolicies, value: engagement.active_policies },
            { label: labels.scheduledReviews, value: engagement.scheduled_reviews },
            { label: labels.pendingAttestations, value: engagement.pending_attestations },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value ?? 0}</p>
            </div>
          ))}
        </section>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.summary}</p>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      ) : null}

      {dashboard.phase145_objectives && dashboard.phase145_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.objectives}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.phase145_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.regulatory_intelligence_engine && dashboard.regulatory_intelligence_engine.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.regulatoryIntelligence}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.regulatory_intelligence_engine.map((item) => (
              <BlueprintItemCard key={item.key ?? item.label} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.policy_management_engine && dashboard.policy_management_engine.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.policyManagement}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.policy_management_engine.map((item) => (
              <BlueprintItemCard key={item.key ?? item.label} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {policies.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.policyRegistry}</h3>
          <div className="mt-3 space-y-2">
            {policies.map((policy) => (
              <PolicyRow key={policy.id ?? policy.policy_key} policy={policy} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-900">{labels.reviewCycles}</h3>
          <button
            type="button"
            disabled={scheduling}
            onClick={() => void scheduleReview()}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {scheduling ? labels.scheduling : labels.scheduleReview}
          </button>
        </div>
        {reviewCycles.length > 0 ? (
          <div className="mt-3 space-y-2">
            {reviewCycles.map((cycle) => (
              <ReviewCycleRow
                key={cycle.id ?? cycle.cycle_key}
                cycle={cycle}
                labels={labels}
                onAttest={(id, attested) => void recordAttestation(id, attested)}
                busy={busyId === cycle.id}
              />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noReviewCycles}</p>
        )}
      </section>

      {auditItems.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.auditReadiness}</h3>
          <div className="mt-3 space-y-2">
            {auditItems.map((item) => (
              <AuditItemRow key={item.id ?? item.item_key} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {companion?.may && companion.may.length > 0 ? (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6">
          <h3 className="text-sm font-semibold text-emerald-900">{labels.complianceCompanion}</h3>
          {companion.principle ? <p className="mt-2 text-sm text-emerald-800">{companion.principle}</p> : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-emerald-800">
            {companion.may.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {companion.must_avoid && companion.must_avoid.length > 0 ? (
            <>
              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-900">{labels.companionMustAvoid}</h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-emerald-800">
                {companion.must_avoid.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      {dashboard.phase145_security_requirements && dashboard.phase145_security_requirements.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.securityRequirements}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.phase145_security_requirements.map((req) => (
              <BlueprintItemCard key={req.key ?? req.label} item={req} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.phase145_self_love_connection?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.selfLove}</h3>
          <p className="mt-2 text-sm text-gray-600">{dashboard.phase145_self_love_connection.principle}</p>
          {dashboard.phase145_self_love_connection.practices &&
          dashboard.phase145_self_love_connection.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
              {dashboard.phase145_self_love_connection.practices.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.phase145_companion_limitations && dashboard.phase145_companion_limitations.length > 0 ? (
        <section className="rounded-xl border border-red-100 bg-red-50/40 p-6">
          <h3 className="text-sm font-semibold text-red-900">{labels.companionLimitations}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-800">
            {dashboard.phase145_companion_limitations.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      ) : null}

      {Array.isArray(dashboard.phase145_success_criteria) && dashboard.phase145_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.phase145_success_criteria.map((item) => (
              <div key={item.key ?? item.label} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{item.label}</p>
                  {item.note ? <p className="mt-1 text-xs text-gray-500">{item.note}</p> : null}
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${item.met ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
                  {item.met ? labels.criterionMet : labels.criterionPending}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.vision_phrases && dashboard.vision_phrases.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.vision_phrases.map((phrase) => <li key={phrase}>{phrase}</li>)}
          </ul>
        </section>
      ) : null}

      {dashboard.privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.privacy_note}</p>
      ) : null}

      {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
    </div>
  );
}
