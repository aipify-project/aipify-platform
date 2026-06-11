"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseFrictionCenter,
  type FrictionCategoryCard,
  type FrictionCenter,
  type FrictionEvent,
  type FrictionRecommendation,
} from "@/lib/aipify/friction-intelligence";

type FrictionIntelligencePanelProps = {
  executiveReport?: boolean;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    youControl: string;
    privacy: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    refresh: string;
    executiveReport: string;
    viewExecutiveReport: string;
    sections: {
      overview: string;
      categories: string;
      events: string;
      recommendations: string;
      history: string;
    };
    scoreLevels: Record<string, string>;
    categories: Record<string, string>;
    actions: {
      accept: string;
      dismiss: string;
      sendToActionCenter: string;
    };
    emptyEvents: string;
    emptyRecommendations: string;
    emptyHistory: string;
    eventCount: string;
  };
};

const SCORE_STYLES: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-800 border-emerald-100",
  moderate: "bg-sky-50 text-sky-800 border-sky-100",
  elevated: "bg-amber-50 text-amber-900 border-amber-100",
  high: "bg-orange-50 text-orange-900 border-orange-100",
};

export function FrictionIntelligencePanel({
  executiveReport = false,
  labels,
}: FrictionIntelligencePanelProps) {
  const [center, setCenter] = useState<FrictionCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/friction");
    if (res.ok) setCenter(parseFrictionCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function acceptRec(id: string) {
    await fetch(`/api/aipify/friction/${id}/accept`, { method: "POST" });
    void refresh();
  }

  async function dismissRec(id: string) {
    await fetch(`/api/aipify/friction/${id}/dismiss`, { method: "POST" });
    void refresh();
  }

  async function sendToActionCenter(id: string) {
    await fetch(`/api/aipify/friction/${id}/send-to-action-center`, { method: "POST" });
    void refresh();
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;
  if (!center?.has_customer) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  if (center.upgrade_required || !center.has_access) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">
          {labels.back}
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">{labels.upgradeTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.upgradeBody}</p>
          <Link
            href="/app/settings/billing"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.upgradeCta}
          </Link>
        </div>
      </div>
    );
  }

  const cards = center.category_cards ?? [];
  const events = center.events ?? [];
  const recommendations = center.recommendations ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={executiveReport ? "/app/friction" : "/app"}
            className="text-sm text-indigo-600 hover:underline"
          >
            {labels.back}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            {executiveReport ? labels.executiveReport : labels.title}
          </h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <div className="flex gap-2">
          {!executiveReport && center.enterprise_features ? (
            <Link
              href="/app/friction/executive-report"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {labels.viewExecutiveReport}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.refresh}
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
        {labels.youControl}
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.overview}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-sm font-medium ${SCORE_STYLES[center.overall_score_level ?? "low"]}`}
          >
            {labels.scoreLevels[center.overall_score_level ?? "low"]}
          </span>
          <p className="text-sm text-gray-700">{center.briefing}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.categories}</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card: FrictionCategoryCard) => (
            <div key={card.category} className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {labels.categories[card.category] ?? card.category}
                </h3>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${SCORE_STYLES[card.score_level]}`}
                >
                  {labels.scoreLevels[card.score_level]}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{card.explanation}</p>
              <p className="mt-1 text-xs text-gray-500">
                {labels.eventCount}: {card.event_count}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.events}</h2>
        {events.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.emptyEvents}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {events.map((event: FrictionEvent) => (
              <li key={event.id} className="rounded-xl border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="mt-1 text-sm text-gray-500">{event.recommendation_text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.recommendations}</h2>
        {recommendations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.emptyRecommendations}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {recommendations.map((rec: FrictionRecommendation) => (
              <li key={rec.id} className="rounded-xl border border-gray-100 p-3">
                <p className="text-sm text-gray-700">{rec.recommendation_text}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void acceptRec(rec.id)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    {labels.actions.accept}
                  </button>
                  <button
                    type="button"
                    onClick={() => void sendToActionCenter(rec.id)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    {labels.actions.sendToActionCenter}
                  </button>
                  <button
                    type="button"
                    onClick={() => void dismissRec(rec.id)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {labels.actions.dismiss}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.history}</h2>
        {(center.history ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.emptyHistory}</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {center.history!.map((h, i) => (
              <li key={`${h.category}-${i}`} className="flex justify-between gap-4 border-b border-gray-50 pb-2">
                <span>
                  {labels.categories[h.category] ?? h.category} — {labels.scoreLevels[h.score_level]}
                </span>
                <span className="shrink-0 text-gray-500">
                  {new Date(h.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {center.privacy_note ? (
        <p className="text-xs text-gray-500">
          {labels.privacy}: {center.privacy_note}
        </p>
      ) : null}
    </div>
  );
}
