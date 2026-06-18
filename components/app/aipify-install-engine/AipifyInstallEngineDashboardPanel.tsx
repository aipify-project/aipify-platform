"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAipifyInstallEngineDashboard,
  type AipifyInstallEngineDashboard,
} from "@/lib/aipify/aipify-install-engine";

type AipifyInstallEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "completed":
    case "approved":
    case "accepted":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "failed":
    case "rejected":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatKey(key?: string) {
  return (key ?? "").replace(/_/g, " ");
}

export function AipifyInstallEngineDashboardPanel({
  labels,
}: AipifyInstallEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AipifyInstallEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/aipify-install-engine/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyInstallEngineDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(action: string, body?: Record<string, unknown>) {
    setActionKey(action);
    await fetch(`/api/install-engine/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
    await load();
    setActionKey(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const installation = dashboard.installation;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(dashboard.blueprint_integration_links ?? dashboard.integration_links)?.map((link) =>
          link.route ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label}
            </Link>
          ) : null
        )}
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.installEngine}</h2>
        {dashboard.implementation_blueprint?.title ? (
          <p className="mt-1 text-xs text-teal-700">
            {dashboard.implementation_blueprint.title}
            {dashboard.implementation_blueprint.phase ? ` · Phase ${dashboard.implementation_blueprint.phase}` : ""}
          </p>
        ) : null}
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-teal-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-2 text-xs text-gray-600">{dashboard.vision}</p> : null}
        {dashboard.install_adoption_engine_note && (
          <p className="mt-1 text-xs text-teal-700">{dashboard.install_adoption_engine_note}</p>
        )}
        {dashboard.install_engine_note && (
          <p className="mt-1 text-xs text-teal-700">{dashboard.install_engine_note}</p>
        )}
      </section>

      {dashboard.discovery_objectives && dashboard.discovery_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.discoveryObjectives}</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.discovery_objectives.map((item) => (
              <li key={String(item.key ?? item.label)}>
                <span className="font-medium text-gray-800">{String(item.label ?? "")}</span>
                {item.description ? <span className="text-gray-500"> — {String(item.description)}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.supported_environments ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.supportedEnvironments}</h3>
          {Array.isArray(dashboard.supported_environments.initial_priorities) ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {(dashboard.supported_environments.initial_priorities as Array<Record<string, unknown>>).map((env) => (
                <li key={String(env.key)} className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs">
                  {String(env.label ?? env.key)}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.discovery_capabilities_blueprint && dashboard.discovery_capabilities_blueprint.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.discoveryCapabilities}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.discovery_capabilities_blueprint.map((cap) => (
              <li key={cap}>{cap}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recommendation_experiences && dashboard.recommendation_experiences.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4">
          <h3 className="text-sm font-semibold text-violet-900">{labels.recommendationExperiences}</h3>
          <ul className="mt-2 space-y-2 text-sm text-violet-900">
            {dashboard.recommendation_experiences.map((exp) => (
              <li key={exp.key ?? exp.example}>
                {exp.emoji ? `${exp.emoji} ` : ""}
                {exp.example}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.human_approval_principles ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.humanApproval}</h3>
          {dashboard.human_approval_principles.principle ? (
            <p className="mt-2 text-gray-600">{dashboard.human_approval_principles.principle}</p>
          ) : null}
          {dashboard.human_approval_principles.should_not && dashboard.human_approval_principles.should_not.length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
              {dashboard.human_approval_principles.should_not.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.blueprint_success_criteria) && dashboard.blueprint_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.blueprint_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.trust_connection_blueprint &&
      typeof dashboard.trust_connection_blueprint.principle === "string" ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnectionBlueprint}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection_blueprint.principle as string}</p>
        </section>
      ) : null}

      {dashboard.phase28_distinction ? (
        <p className="text-xs text-gray-500">{dashboard.phase28_distinction}</p>
      ) : null}

      {dashboard.adoption_journey && dashboard.adoption_journey.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.adoptionJourney}</h3>
          <ol className="mt-3 space-y-3">
            {dashboard.adoption_journey.map((stage) => (
              <li key={stage.key ?? stage.stage} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">
                  {stage.stage ? `${stage.stage}. ` : ""}
                  {stage.label}
                </span>
                {stage.focus && stage.focus.length > 0 ? (
                  <ul className="mt-1 list-inside list-disc text-xs text-gray-500">
                    {stage.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {dashboard.supported_platforms && dashboard.supported_platforms.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.supportedPlatforms}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {dashboard.supported_platforms.map((platform) => (
              <li
                key={platform.key ?? platform.label}
                className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs"
              >
                {platform.label}
                {platform.status === "planned" ? ` (${labels.planned})` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_note ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          {dashboard.self_love_note}
        </section>
      ) : null}

      {dashboard.trust_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          {dashboard.trust_connection.principle ? (
            <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
          ) : null}
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.completion}</p>
          <p className="mt-1 text-2xl font-semibold">{summary.completion_percentage ?? 0}%</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.currentStep}</p>
          <p className="mt-1 text-lg font-semibold capitalize">
            {formatKey(summary.current_step ?? installation?.current_step)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.discoveries}</p>
          <p className="mt-1 text-2xl font-semibold">{summary.discoveries ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.pendingPermissions}</p>
          <p className="mt-1 text-2xl font-semibold">{summary.pending_permissions ?? 0}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-900">{labels.installActions}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={actionKey !== null}
              onClick={() => void runAction("start")}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              {labels.startInstall}
            </button>
            <button
              type="button"
              disabled={actionKey !== null}
              onClick={() => void runAction("advance")}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
            >
              {labels.advanceStep}
            </button>
            <button
              type="button"
              disabled={actionKey !== null}
              onClick={() => void runAction("discover")}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
            >
              {labels.runDiscovery}
            </button>
            <button
              type="button"
              disabled={actionKey !== null}
              onClick={() => void runAction("approve-permissions")}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
            >
              {labels.approvePermissions}
            </button>
            <button
              type="button"
              disabled={actionKey !== null}
              onClick={() => void runAction("accept-recommendations")}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
            >
              {labels.acceptRecommendations}
            </button>
            <button
              type="button"
              disabled={actionKey !== null}
              onClick={() => void runAction("complete")}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
            >
              {labels.completeInstall}
            </button>
          </div>
        </div>
        {installation && (
          <p className="mt-3 text-xs text-gray-500">
            {labels.status}:{" "}
            <span className={`inline rounded px-1.5 py-0.5 capitalize ${statusClass(installation.installation_status)}`}>
              {installation.installation_status}
            </span>
          </p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.discoveryResults}</h3>
        {dashboard.discoveries.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noDiscoveries}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.discoveries.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span>
                  <span className="font-medium">{d.entity_label ?? d.entity_key}</span>
                  <span className="ml-2 text-xs text-gray-500">{formatKey(d.discovery_type)}</span>
                </span>
                <span className="text-xs text-gray-500">{d.confidence_score}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.permissionReviews}</h3>
        {dashboard.permission_reviews.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noPermissions}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.permission_reviews.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span>{p.permission_label ?? p.permission_key}</span>
                <span className={`rounded px-1.5 py-0.5 text-xs capitalize ${statusClass(p.review_status)}`}>
                  {p.review_status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h3>
        {dashboard.recommendations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noRecommendations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.recommendations.map((r) => (
              <li key={r.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.recommendation_label ?? r.recommendation_key}</span>
                  <span className={`rounded px-1.5 py-0.5 text-xs capitalize ${statusClass(r.status)}`}>
                    {r.status}
                  </span>
                </div>
                {r.rationale && <p className="mt-1 text-xs text-gray-500">{r.rationale}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.integration_links && dashboard.integration_links.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {dashboard.integration_links.map((link) => {
              const route = typeof link.route === "string" ? link.route : null;
              const label = typeof link.label === "string" ? link.label : route ?? "";
              return (
                <li key={label}>
                  {route ? (
                    <Link href={route} className="text-teal-600 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.vision_phrases && dashboard.vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4 text-sm italic text-teal-900">
          {dashboard.vision_phrases.map((phrase) => (
            <p key={phrase}>&ldquo;{phrase}&rdquo;</p>
          ))}
        </section>
      ) : null}
    </div>
  );
}
