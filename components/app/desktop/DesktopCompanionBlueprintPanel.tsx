"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseDesktopCompanionEngineDashboard,
  type BlueprintLabeledItem,
  type DesktopCompanionEngineDashboard,
} from "@/lib/aipify/desktop";

export type DesktopCompanionBlueprintLabels = {
  loading: string;
  engineTitle: string;
  mission: string;
  philosophy: string;
  abosPrinciple: string;
  distinctionNote: string;
  companionExperiences: string;
  miniPanel: string;
  successCriteria: string;
  selfLove: string;
  trust: string;
  configuration: string;
  sinceLastTime: string;
  integrationLinks: string;
  visionPhrases: string;
  engagement: string;
  open: string;
  met: string;
  notMet: string;
  sinceSource: string;
  noSinceLastTime: string;
};

type Props = { labels: DesktopCompanionBlueprintLabels };

function LabeledLinkList({ items }: { items: BlueprintLabeledItem[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.key ?? item.label} className="rounded border border-gray-100 p-3 text-sm">
          <div className="font-medium">
            {item.emoji ? `${item.emoji} ` : ""}
            {item.label}
          </div>
          {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
          {item.scenario ? <p className="mt-1 text-xs text-gray-500">{item.scenario}</p> : null}
          {item.example ? <p className="mt-1 text-xs italic text-indigo-800">{item.example}</p> : null}
          {item.route ? (
            <Link href={item.route} className="mt-1 inline-block text-xs text-indigo-700 hover:underline">
              {item.route}
            </Link>
          ) : null}
          {item.note ? <p className="mt-1 text-xs text-gray-500">{item.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function DesktopCompanionBlueprintPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<DesktopCompanionEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/desktop/engine-dashboard");
    if (res.ok) setDashboard(parseDesktopCompanionEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const since = dashboard.since_last_time;
  const engagement = dashboard.engagement_summary;
  const configOptions = Array.isArray(dashboard.configuration_options?.options)
    ? (dashboard.configuration_options.options as BlueprintLabeledItem[])
    : [];
  const trustItems = Array.isArray(dashboard.trust_connection?.users_should_know)
    ? (dashboard.trust_connection.users_should_know as string[])
    : [];
  const selfLovePatterns = Array.isArray(dashboard.self_love_connection?.companion_patterns)
    ? (dashboard.self_love_connection.companion_patterns as string[])
    : [];

  return (
    <div className="space-y-6">
      {(dashboard.integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.integration_links?.map((link) =>
            link.route ? (
              <Link
                key={link.route}
                href={link.route}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
              >
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium">
            {labels.mission}: {dashboard.mission}
          </p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm">
            {labels.philosophy}: {dashboard.philosophy}
          </p>
        ) : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">
            {labels.abosPrinciple}: {dashboard.abos_principle}
          </p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{labels.distinctionNote}: {dashboard.distinction_note}</p>
        ) : null}
        {dashboard.desktop_companion_engine_note ? (
          <p className="mt-1 text-xs text-indigo-600">{dashboard.desktop_companion_engine_note}</p>
        ) : null}
      </section>

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.engagement}</h3>
          <dl className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
            <div>
              <dt className="text-xs text-gray-500">{labels.open}</dt>
              <dd>{engagement.unread_notifications ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">24h</dt>
              <dd>{engagement.notifications_last_24h ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Reminders</dt>
              <dd>{engagement.reminders_due_24h ?? 0}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {(dashboard.success_criteria ?? []).length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria?.map((item) => {
              const label = item.label ?? item.key ?? "";
              const met = Boolean(item.met);
              return (
                <li key={label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? labels.met : labels.notMet} {label}
                  </span>
                  {item.note ? <p className="text-xs text-gray-500">{item.note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {(dashboard.companion_experiences ?? []).length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.companionExperiences}</h3>
          <LabeledLinkList items={dashboard.companion_experiences ?? []} />
        </section>
      )}

      {(dashboard.mini_panel_capabilities ?? []).length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.miniPanel}</h3>
          <LabeledLinkList items={dashboard.mini_panel_capabilities ?? []} />
        </section>
      )}

      <section className="rounded-lg border border-emerald-100 bg-white p-4">
        <h3 className="text-sm font-semibold">{labels.sinceLastTime}</h3>
        {since?.trend_summary ? (
          <>
            <p className="mt-2 text-sm text-gray-700">{since.trend_summary}</p>
            {since.since_source ? (
              <p className="mt-1 text-xs text-gray-500">
                {labels.sinceSource}: {since.since_source}
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.noSinceLastTime}</p>
        )}
      </section>

      {selfLovePatterns.length > 0 && (
        <section className="rounded-lg border border-rose-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.selfLove}</h3>
          {typeof dashboard.self_love_connection?.principle === "string" ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.self_love_connection.principle}</p>
          ) : null}
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {selfLovePatterns.map((pattern) => (
              <li key={pattern}>{pattern}</li>
            ))}
          </ul>
          {typeof dashboard.self_love_connection?.self_love_route === "string" ? (
            <Link
              href={dashboard.self_love_connection.self_love_route}
              className="mt-2 inline-block text-xs text-indigo-700 hover:underline"
            >
              {dashboard.self_love_connection.self_love_route}
            </Link>
          ) : null}
        </section>
      )}

      {trustItems.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.trust}</h3>
          {typeof dashboard.trust_connection?.principle === "string" ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.trust_connection.principle}</p>
          ) : null}
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {trustItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {configOptions.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.configuration}</h3>
          <LabeledLinkList items={configOptions} />
        </section>
      )}

      {(dashboard.vision_phrases ?? []).length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {dashboard.vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-gray-100 bg-white p-4">
        <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
        <LabeledLinkList items={dashboard.integration_links ?? []} />
      </section>
    </div>
  );
}
