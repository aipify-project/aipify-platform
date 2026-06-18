"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCompanionDeviceEcosystemDashboard,
  type CompanionDeviceEcosystemDashboard,
  type ContinuityExample,
  type DeviceRoadmapPhase,
  type EcosystemObjective,
  type IntegrationLink,
} from "@/lib/aipify/companion-device-ecosystem";

type Props = { labels: Record<string, string> };

function statusLabel(status: string | undefined, labels: Record<string, string>): string {
  if (!status) return "";
  const key = `status_${status}`;
  return labels[key] ?? status;
}

function ObjectiveItem({ item }: { item: EcosystemObjective }) {
  return (
    <li className="text-sm text-gray-600">
      <span className="font-medium text-gray-800">{item.label}</span>
      {item.description ? <span className="text-gray-500"> — {item.description}</span> : null}
    </li>
  );
}

function RoadmapPhaseItem({
  phase,
  labels,
}: {
  phase: DeviceRoadmapPhase;
  labels: Record<string, string>;
}) {
  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-gray-900">
          {labels.phase} {phase.phase}: {phase.label}
        </span>
        {phase.status ? (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {statusLabel(phase.status, labels)}
          </span>
        ) : null}
      </div>
      {phase.description ? <p className="mt-2 text-gray-600">{phase.description}</p> : null}
    </li>
  );
}

function ContinuityItem({ example }: { example: ContinuityExample }) {
  return (
    <li className="text-sm text-slate-800">
      {example.emoji ? `${example.emoji} ` : ""}
      {example.example}
    </li>
  );
}

function IntegrationLinkItem({ link }: { link: IntegrationLink }) {
  return (
    <li className="text-sm">
      {link.route ? (
        <Link href={link.route} className="font-medium text-teal-700 hover:underline">
          {link.label}
        </Link>
      ) : (
        <span className="font-medium">{link.label}</span>
      )}
      {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
    </li>
  );
}

export function CompanionDeviceEcosystemDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CompanionDeviceEcosystemDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/companion-device-ecosystem-engine/dashboard");
    if (res.ok) setDashboard(parseCompanionDeviceEcosystemDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.ecosystem_summary ?? {};
  const voice = dashboard.voice_companion_principles;
  const wearable = dashboard.wearable_experiences;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.engineTitle}</h2>
        {dashboard.mission ? <p className="mt-2 text-sm text-slate-700">{dashboard.mission}</p> : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-slate-600">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.device_abos_principle ? (
          <p className="mt-2 text-xs font-medium text-slate-500">{dashboard.device_abos_principle}</p>
        ) : null}
        {dashboard.device_distinction_note ? (
          <p className="mt-3 text-xs text-slate-500">{dashboard.device_distinction_note}</p>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.connectedDevices}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(summary.connected_devices ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.onlineDevices}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(summary.online_devices ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.continuityEnabled}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {summary.continuity_enabled ? labels.enabled : labels.disabled}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.mobileReady}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {summary.mobile_ready ? labels.enabled : labels.disabled}
          </p>
        </div>
      </section>

      {dashboard.objectives && dashboard.objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.objectives}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.objectives.map((item) => (
              <ObjectiveItem key={String(item.key ?? item.label)} item={item} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.device_priority_roadmap && dashboard.device_priority_roadmap.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.deviceRoadmap}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.device_priority_roadmap.map((phase) => (
              <RoadmapPhaseItem
                key={String(phase.phase ?? phase.key)}
                phase={phase}
                labels={labels}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.companion_continuity && dashboard.companion_continuity.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">{labels.companionContinuity}</h3>
          <ul className="mt-2 space-y-2">
            {dashboard.companion_continuity.map((item) => (
              <ContinuityItem key={item.key ?? item.example} example={item} />
            ))}
          </ul>
        </section>
      ) : null}

      {voice ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.voiceCompanion}</h3>
          {voice.status ? (
            <p className="mt-1 text-xs text-amber-700">
              {labels.futureScaffold}: {statusLabel(voice.status, labels)}
            </p>
          ) : null}
          {voice.principles && voice.principles.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
              {voice.principles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {voice.example_phrases && voice.example_phrases.length > 0 ? (
            <>
              <p className="mt-3 text-xs font-medium text-gray-500">{labels.examplePhrases}</p>
              <ul className="mt-1 space-y-1 text-sm text-gray-600">
                {voice.example_phrases.map((phrase) => (
                  <li key={phrase} className="italic">
                    &ldquo;{phrase}&rdquo;
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      {wearable ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.wearableExperiences}</h3>
          {wearable.status ? (
            <p className="mt-1 text-xs text-amber-700">
              {labels.futureScaffold}: {statusLabel(wearable.status, labels)}
            </p>
          ) : null}
          {wearable.experiences && wearable.experiences.length > 0 ? (
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              {wearable.experiences.map((exp) => (
                <li key={exp.key ?? exp.label}>
                  <span className="font-medium text-gray-800">{exp.label}</span>
                  {exp.description ? <span className="text-gray-500"> — {exp.description}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {wearable.boundary ? (
            <p className="mt-2 text-xs text-gray-500">{wearable.boundary}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.device_self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.device_self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.device_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.device_trust_connection.principle}</p>
          {dashboard.device_trust_connection.transparency_note ? (
            <p className="mt-2 text-xs text-gray-500">
              {dashboard.device_trust_connection.transparency_note}
            </p>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.device_success_criteria) &&
      dashboard.device_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.device_success_criteria.map((item) => {
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

      {dashboard.device_vision_phrases && dashboard.device_vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.device_vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.device_integration_links && dashboard.device_integration_links.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-2">
            {dashboard.device_integration_links.map((link) => (
              <IntegrationLinkItem key={String(link.key ?? link.route)} link={link} />
            ))}
          </ul>
        </section>
      ) : null}

      {summary.privacy_note ? (
        <p className="text-xs text-gray-500">{summary.privacy_note}</p>
      ) : null}
      {dashboard.privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.privacy_note}</p>
      ) : null}
    </div>
  );
}
