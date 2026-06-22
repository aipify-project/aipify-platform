"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  APP_PORTAL_INTEGRATIONS_FAQ_ARTICLES,
  parseAppPortalIntegrationsHub,
  type AppPortalIntegrationsHub,
  type AppPortalIntegrationsLabels,
} from "@/lib/app-portal/integrations";
import { IntegrationConnectionRow } from "@/components/app/app-portal/IntegrationConnectionRow";

type AppPortalIntegrationsHubPanelProps = {
  labels: AppPortalIntegrationsLabels;
  faqLabels: Record<string, string>;
  answerLabels: Record<string, string>;
};

export function AppPortalIntegrationsHubPanel({
  labels,
  faqLabels,
  answerLabels,
}: AppPortalIntegrationsHubPanelProps) {
  const [hub, setHub] = useState<AppPortalIntegrationsHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app-portal/integrations");
    if (res.ok) setHub(parseAppPortalIntegrationsHub(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !hub) {
    return <p className="p-6 text-sm text-slate-500">{labels.hub.loading}</p>;
  }

  if (!hub) {
    return <p className="p-6 text-sm text-red-600">{labels.hub.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{labels.hub.title}</h1>
        <p className="mt-2 text-slate-600">{labels.hub.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">
          {hub.read_only_principle || labels.hub.readOnlyPrinciple}
        </p>
        <p className="mt-2 text-xs text-slate-500">{hub.privacy_note || labels.hub.privacyNote}</p>
        {!hub.can_manage ? (
          <p className="mt-2 text-sm text-amber-800">{labels.hub.viewOnlyNote}</p>
        ) : (
          <p className="mt-2 text-sm text-slate-600">{labels.hub.canManageNote}</p>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold text-slate-900">{labels.hub.connectedTitle}</h2>
          {hub.can_manage ? (
            <Link
              href="/app/platform/integrations/connect"
              className="text-sm font-medium text-indigo-700 hover:text-indigo-800"
            >
              {labels.hub.connectCta}
            </Link>
          ) : null}
        </div>
        {hub.connections.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{labels.hub.noConnections}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {hub.connections.map((conn) => (
              <IntegrationConnectionRow
                key={conn.id}
                connection={conn}
                providers={hub.providers}
                labels={labels}
                canManage={hub.can_manage}
                onRefresh={load}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.hub.providersTitle}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {hub.providers.map((provider) => (
            <li key={provider.provider_key} className="rounded-xl border border-slate-100 p-4">
              <p className="font-medium text-slate-900">{provider.display_name}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{provider.category}</p>
              {hub.can_manage ? (
                <Link
                  href={`/app/platform/integrations/connect/${provider.provider_key}`}
                  className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:text-indigo-800"
                >
                  {labels.hub.connectCta}
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.guidance.whyAccess}</h2>
        <dl className="mt-4 space-y-3 text-sm text-slate-600">
          <div><dt className="font-medium text-slate-800">{labels.guidance.whatCanRead}</dt></div>
          <div><dt className="font-medium text-slate-800">{labels.guidance.whatCannotDo}</dt></div>
          <div><dt className="font-medium text-slate-800">{labels.guidance.howStored}</dt></div>
          <div><dt className="font-medium text-slate-800">{labels.guidance.howRevoke}</dt></div>
          <div><dt className="font-medium text-slate-800">{labels.guidance.howRotate}</dt></div>
          <div><dt className="font-medium text-slate-800">{labels.guidance.ifFails}</dt></div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.hub.helpTitle}</h2>
        {APP_PORTAL_INTEGRATIONS_FAQ_ARTICLES.map((article) => {
          const question = faqLabels[article.titleKey] ?? article.slug;
          const answer = answerLabels[`customerApp.portalStructure.integrations.faqAnswers.${article.slug}`] ?? "";
          const isOpen = openFaq === article.slug;
          return (
            <article key={article.slug} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : article.slug)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-slate-900">{question}</span>
                <span className="text-slate-400">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && answer ? (
                <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-600">{answer}</div>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
