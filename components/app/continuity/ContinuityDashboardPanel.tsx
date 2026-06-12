"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseContinuityDashboard,
  type BlueprintObjective,
  type ContinuityDashboard,
} from "@/lib/aipify/continuity";

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

type ContinuityDashboardPanelProps = {
  labels: Record<string, string>;
};

function bandClass(band?: string) {
  switch (band) {
    case "highly_prepared":
      return "text-emerald-700";
    case "prepared":
      return "text-teal-700";
    case "improvement_recommended":
      return "text-amber-700";
    case "resilience_concerns":
      return "text-orange-700";
    case "critical_gap":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

export function ContinuityDashboardPanel({ labels }: ContinuityDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<ContinuityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/continuity/dashboard");
    if (res.ok) setDashboard(parseContinuityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const activateIncidentMode = async () => {
    setActivating(true);
    await fetch("/api/aipify/continuity/incident-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incident_level: 2,
        category: "operational_disruption",
        summary: "Incident Mode activated for continuity coordination",
      }),
    });
    setActivating(false);
    await load();
  };

  const deactivateIncidentMode = async () => {
    setActivating(true);
    await fetch("/api/aipify/continuity/incident-mode", { method: "DELETE" });
    setActivating(false);
    await load();
  };

  const generateBriefing = async () => {
    await fetch("/api/aipify/continuity/briefings/generate", { method: "POST" });
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const modeActive = dashboard.incident_mode?.active;
  const engagement = dashboard.engagement_summary;

  return (
    <div className="space-y-6">
      {(dashboard.blueprint_integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.blueprint_integration_links?.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      {dashboard.blueprint_mission || dashboard.blueprint_distinction_note ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/30 p-6">
          <h2 className="text-sm font-semibold text-rose-900">{labels.blueprintSection}</h2>
          {dashboard.implementation_blueprint_phase73?.phase ? (
            <p className="mt-1 text-xs text-rose-700">
              {dashboard.implementation_blueprint_phase73.phase}
              {dashboard.implementation_blueprint_phase73.engine_phase
                ? ` · ${dashboard.implementation_blueprint_phase73.engine_phase}`
                : ""}
            </p>
          ) : null}
          {dashboard.blueprint_distinction_note ? (
            <p className="mt-2 text-xs text-rose-800">{dashboard.blueprint_distinction_note}</p>
          ) : null}
          {dashboard.blueprint_mission ? (
            <p className="mt-2 text-sm font-medium text-rose-900">{dashboard.blueprint_mission}</p>
          ) : null}
          {dashboard.blueprint_philosophy ? (
            <p className="mt-2 text-sm text-rose-900">{dashboard.blueprint_philosophy}</p>
          ) : null}
          {dashboard.blueprint_abos_principle ? (
            <p className="mt-2 text-xs text-rose-800">{dashboard.blueprint_abos_principle}</p>
          ) : null}
          {dashboard.organizational_continuity_note ? (
            <p className="mt-2 text-xs text-rose-800">{dashboard.organizational_continuity_note}</p>
          ) : null}
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-gray-500">{labels.criticalProcessCount}</dt>
              <dd>{String(engagement.critical_processes ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{labels.backupAssignments}</dt>
              <dd>{String(engagement.backup_assignments ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{labels.backupGaps}</dt>
              <dd>{String(engagement.backup_gaps ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{labels.coverageRatio}</dt>
              <dd>{String(engagement.coverage_ratio ?? 0)}%</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {dashboard.blueprint_objectives && dashboard.blueprint_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.blueprint_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.knowledge_continuity?.practices && dashboard.knowledge_continuity.practices.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.knowledgeContinuity}</h3>
          {dashboard.knowledge_continuity.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.knowledge_continuity.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.knowledge_continuity.practices.map((practice) => (
              <ObjectiveCard key={practice.key ?? practice.label} objective={practice} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.role_continuity?.signals && dashboard.role_continuity.signals.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.roleContinuity}</h3>
          {dashboard.role_continuity.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.role_continuity.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.role_continuity.signals.map((signal) => (
              <li key={signal.key ?? signal.signal} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                {signal.emoji ? `${signal.emoji} ` : ""}
                {signal.signal ?? signal.prompt}
                {signal.description ? <span className="mt-1 block text-xs text-gray-600">{signal.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.succession_support?.dimensions && dashboard.succession_support.dimensions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.successionSupport}</h3>
          {dashboard.succession_support.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.succession_support.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.succession_support.dimensions.map((dim) => (
              <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.operational_resilience?.vulnerability_patterns &&
      dashboard.operational_resilience.vulnerability_patterns.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.operationalResilience}</h3>
          {dashboard.operational_resilience.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.operational_resilience.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.operational_resilience.vulnerability_patterns.map((pattern) => (
              <ObjectiveCard key={pattern.key ?? pattern.label} objective={pattern} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_guidance?.examples && dashboard.companion_guidance.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.companionGuidance}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.companion_guidance.examples.map((example) => (
              <li key={example.key ?? example.prompt} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                {example.emoji ? `${example.emoji} ` : ""}
                {example.prompt}
                {example.consideration ? (
                  <span className="mt-1 block text-xs text-gray-600">{example.consideration}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.onboarding_connection?.pathways && dashboard.onboarding_connection.pathways.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.onboardingConnection}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.onboarding_connection.pathways.map((pathway) =>
              pathway.route ? (
                <Link
                  key={pathway.key ?? pathway.label}
                  href={pathway.route}
                  className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <p className="font-medium">{pathway.label}</p>
                  {pathway.description ? <p className="mt-1 text-xs text-gray-600">{pathway.description}</p> : null}
                </Link>
              ) : (
                <ObjectiveCard key={pathway.key ?? pathway.label} objective={pathway} />
              )
            )}
          </div>
        </section>
      ) : null}

      {dashboard.blueprint_self_love_connection?.practices &&
      dashboard.blueprint_self_love_connection.practices.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          {dashboard.blueprint_self_love_connection.journey_phrase ? (
            <p className="mt-2 text-sm italic text-gray-700">{dashboard.blueprint_self_love_connection.journey_phrase}</p>
          ) : null}
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
            {dashboard.blueprint_self_love_connection.practices.map((practice) => (
              <li key={typeof practice === "string" ? practice : practice.key}>{typeof practice === "string" ? practice : practice.label}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.privacy_principles?.rules && dashboard.privacy_principles.rules.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-6">
          <h3 className="text-sm font-semibold text-amber-900">{labels.privacyPrinciples}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {dashboard.privacy_principles.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          {dashboard.blueprint_privacy_note ? (
            <p className="mt-3 text-xs text-amber-800">{dashboard.blueprint_privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.blueprint_success_criteria && dashboard.blueprint_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.blueprint_success_criteria.map((criterion) => (
              <li key={criterion.key ?? criterion.label} className="flex items-start gap-2">
                <span className={criterion.met ? "text-emerald-600" : "text-gray-400"}>
                  {criterion.met ? "✓" : "○"}
                </span>
                <span>
                  {criterion.label}
                  {criterion.note ? <span className="mt-0.5 block text-xs text-gray-500">{criterion.note}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.blueprint_vision_phrases && dashboard.blueprint_vision_phrases.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-3 space-y-2 text-sm italic text-gray-700">
            {dashboard.blueprint_vision_phrases.map((phrase) => (
              <li key={phrase}>&ldquo;{phrase}&rdquo;</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
        <h2 className="text-sm font-semibold text-rose-900">{labels.readinessScore}</h2>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          {dashboard.overall_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium capitalize ${bandClass(dashboard.readiness_band)}`}>
          {dashboard.readiness_band?.replace(/_/g, " ")}
        </p>
        <p className="mt-3 text-xs text-rose-800">{labels.humanLeadership}</p>
        {modeActive ? (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
            {labels.incidentModeActive} — {labels.incidentModeNote}
            <button
              type="button"
              disabled={activating}
              onClick={() => void deactivateIncidentMode()}
              className="ml-3 rounded border border-red-400 px-2 py-0.5 text-xs font-medium hover:bg-red-100 disabled:opacity-50"
            >
              {labels.deactivateIncidentMode}
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={activating}
            onClick={() => void activateIncidentMode()}
            className="mt-4 rounded-lg border border-rose-400 px-3 py-1.5 text-sm font-medium text-rose-900 hover:bg-rose-100 disabled:opacity-50"
          >
            {activating ? labels.activating : labels.activateIncidentMode}
          </button>
        )}
      </section>

      <section>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-900 hover:bg-rose-50"
        >
          {labels.generateBriefing}
        </button>
        {dashboard.briefings.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                {b.summary}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.criticalProcesses}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.critical_processes.map((proc) => (
            <li key={proc.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium">{proc.process_name}</p>
              <p className="mt-1 text-xs capitalize text-gray-500">{proc.criticality_level}</p>
              {proc.backup ? (
                <p className="mt-1 text-xs text-gray-600">
                  {labels.backupOwners}: {proc.backup.primary}
                  {proc.backup.secondary ? ` → ${proc.backup.secondary}` : ""}
                  {proc.backup.tertiary ? ` → ${proc.backup.tertiary}` : ""}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.incidentsSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.incidents.map((inc) => (
            <li key={inc.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <Link href={`/app/continuity/incidents/${inc.id}`} className="font-medium text-rose-900 hover:underline">
                {inc.summary}
              </Link>
              <p className="mt-1 text-xs text-gray-500">
                Level {inc.incident_level} · {inc.level_label ?? inc.category} · {inc.status}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
