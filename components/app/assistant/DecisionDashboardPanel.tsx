"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  BUSINESS_DOMAIN_KEYS,
  CONFIDENCE_LEVELS,
  PRESENTATION_STYLES,
  PROACTIVITY_LEVELS,
  parseDecisionsCenter,
  type DecisionsCenterBundle,
  type DecisionSupportBlueprintPhase60,
  type DseSettings,
} from "@/lib/decision-support-engine";
import { formatDate } from "@/lib/i18n/format-date";

type DecisionDashboardPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    privacy: string;
    analyze: string;
    viewAttention: string;
    acceptGuidance: string;
    defer: string;
    dismiss: string;
    sections: {
      pending: string;
      business: string;
      priorities: string;
      risks: string;
      history: string;
      framework: string;
      ethics: string;
      settings: string;
    };
    settings: {
      enabled: string;
      proactivity: string;
      personal: string;
      historical: string;
      presentation: string;
      storeHistory: string;
    };
    confidenceLevels: Record<string, string>;
    proactivityLevels: Record<string, string>;
    presentationStyles: Record<string, string>;
    businessDomains: Record<string, string>;
    empty: string;
    youDecide: string;
    blueprint: {
      toggle: string;
      phase: string;
      mission: string;
      philosophy: string;
      abosPrinciple: string;
      distinction: string;
      objectives: string;
      frameworks: string;
      decisionTypes: string;
      examples: string;
      riskAwareness: string;
      scenarios: string;
      selfLove: string;
      trust: string;
      dogfooding: string;
      successCriteria: string;
      vision: string;
      integrations: string;
      met: string;
      notMet: string;
    };
  };
};

const CONFIDENCE_STYLES: Record<string, string> = {
  high: "bg-emerald-100 text-emerald-800",
  moderate: "bg-amber-100 text-amber-800",
  low: "bg-slate-100 text-slate-700",
};

function BlueprintSection({
  blueprint,
  labels,
}: {
  blueprint: DecisionSupportBlueprintPhase60;
  labels: DecisionDashboardPanelProps["labels"]["blueprint"];
}) {
  return (
    <details className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-sm">
      <summary className="cursor-pointer font-semibold text-indigo-900">{labels.toggle}</summary>
      <div className="mt-4 space-y-4 text-sm text-indigo-950">
        {blueprint.phase ? (
          <p className="text-xs text-indigo-700">
            {labels.phase}: {blueprint.phase}
            {blueprint.engine_phase ? ` · ${blueprint.engine_phase}` : ""}
          </p>
        ) : null}
        {blueprint.distinction_note ? (
          <p className="text-xs text-indigo-700">
            <span className="font-semibold">{labels.distinction}: </span>
            {blueprint.distinction_note}
          </p>
        ) : null}
        {blueprint.mission ? (
          <p>
            <span className="font-semibold">{labels.mission}: </span>
            {blueprint.mission}
          </p>
        ) : null}
        {blueprint.philosophy ? (
          <p>
            <span className="font-semibold">{labels.philosophy}: </span>
            {blueprint.philosophy}
          </p>
        ) : null}
        {blueprint.abos_principle ? (
          <p className="text-xs text-indigo-800">
            <span className="font-semibold">{labels.abosPrinciple}: </span>
            {blueprint.abos_principle}
          </p>
        ) : null}

        {Array.isArray(blueprint.objectives) && blueprint.objectives.length > 0 ? (
          <div>
            <h3 className="font-semibold">{labels.objectives}</h3>
            <ul className="mt-2 space-y-2">
              {blueprint.objectives.map((item) => (
                <li key={item.key}>
                  <span className="font-medium">{item.label}</span>
                  {item.description ? ` — ${item.description}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {Array.isArray(blueprint.decision_frameworks) && blueprint.decision_frameworks.length > 0 ? (
          <div>
            <h3 className="font-semibold">{labels.frameworks}</h3>
            <ul className="mt-2 space-y-2">
              {blueprint.decision_frameworks.map((item) => (
                <li key={item.key}>
                  <span className="font-medium">{item.question}</span>
                  {item.purpose ? ` — ${item.purpose}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {Array.isArray(blueprint.decision_types) && blueprint.decision_types.length > 0 ? (
          <div>
            <h3 className="font-semibold">{labels.decisionTypes}</h3>
            <ul className="mt-2 space-y-3">
              {blueprint.decision_types.map((item) => (
                <li key={item.key}>
                  <span className="font-medium">{item.label}</span>
                  {item.description ? ` — ${item.description}` : ""}
                  {Array.isArray(item.examples) && item.examples.length > 0 ? (
                    <ul className="mt-1 list-inside list-disc text-xs text-indigo-800">
                      {item.examples.map((ex) => (
                        <li key={ex}>{ex}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {Array.isArray(blueprint.option_comparison_examples) &&
        blueprint.option_comparison_examples.length > 0 ? (
          <div>
            <h3 className="font-semibold">{labels.examples}</h3>
            <ul className="mt-2 space-y-2">
              {blueprint.option_comparison_examples.map((item) => (
                <li key={item.key}>
                  {item.example}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {blueprint.risk_awareness?.principle ? (
          <div>
            <h3 className="font-semibold">{labels.riskAwareness}</h3>
            <p className="mt-1">{blueprint.risk_awareness.principle}</p>
            {Array.isArray(blueprint.risk_awareness.categories) ? (
              <ul className="mt-2 space-y-1">
                {blueprint.risk_awareness.categories.map((cat) => (
                  <li key={cat.key}>
                    <span className="font-medium">{cat.label}</span>
                    {cat.description ? ` — ${cat.description}` : ""}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {blueprint.scenario_exploration?.principle ? (
          <div>
            <h3 className="font-semibold">{labels.scenarios}</h3>
            <p className="mt-1">{blueprint.scenario_exploration.principle}</p>
            {Array.isArray(blueprint.scenario_exploration.scenarios) ? (
              <ul className="mt-2 space-y-1">
                {blueprint.scenario_exploration.scenarios.map((s) => (
                  <li key={s.key}>
                    <span className="font-medium">{s.label}</span>
                    {s.description ? ` — ${s.description}` : ""}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {blueprint.self_love_connection?.principle ? (
          <div>
            <h3 className="font-semibold">{labels.selfLove}</h3>
            <p className="mt-1">{blueprint.self_love_connection.principle}</p>
            {Array.isArray(blueprint.self_love_connection.practices) ? (
              <ul className="mt-2 list-inside list-disc space-y-1">
                {blueprint.self_love_connection.practices.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {blueprint.trust_connection?.principle ? (
          <div>
            <h3 className="font-semibold">{labels.trust}</h3>
            <p className="mt-1">{blueprint.trust_connection.principle}</p>
            {Array.isArray(blueprint.trust_connection.users_should_see) ? (
              <ul className="mt-2 list-inside list-disc space-y-1">
                {blueprint.trust_connection.users_should_see.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {blueprint.dogfooding?.principle ? (
          <div>
            <h3 className="font-semibold">{labels.dogfooding}</h3>
            <p className="mt-1">{blueprint.dogfooding.principle}</p>
            {blueprint.dogfooding.aipify_group?.focus ? (
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                {blueprint.dogfooding.aipify_group.focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {Array.isArray(blueprint.success_criteria) && blueprint.success_criteria.length > 0 ? (
          <div>
            <h3 className="font-semibold">{labels.successCriteria}</h3>
            <ul className="mt-2 space-y-2">
              {blueprint.success_criteria.map((c) => (
                <li key={c.key}>
                  <span className="font-medium">{c.label}</span>
                  <span className="ml-2 text-xs">
                    {c.met ? labels.met : labels.notMet}
                  </span>
                  {c.note ? <p className="mt-0.5 text-xs text-indigo-700">{c.note}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {Array.isArray(blueprint.vision_phrases) && blueprint.vision_phrases.length > 0 ? (
          <div>
            <h3 className="font-semibold">{labels.vision}</h3>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {blueprint.vision_phrases.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {Array.isArray(blueprint.integration_links) && blueprint.integration_links.length > 0 ? (
          <div>
            <h3 className="font-semibold">{labels.integrations}</h3>
            <ul className="mt-2 space-y-2">
              {blueprint.integration_links.map((link) => (
                <li key={link.route}>
                  <Link href={link.route} className="text-indigo-700 hover:underline">
                    {link.label}
                  </Link>
                  {link.note ? <span className="text-xs text-indigo-600"> — {link.note}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}

export function DecisionDashboardPanel({ locale, labels }: DecisionDashboardPanelProps) {
  const [center, setCenter] = useState<DecisionsCenterBundle | null>(null);
  const [settings, setSettings] = useState<DseSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assistant/decisions");
    if (res.ok) {
      const data = parseDecisionsCenter(await res.json());
      setCenter(data);
      if (data.settings) setSettings(data.settings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveSettings() {
    if (!settings) return;
    await fetch("/api/assistant/decisions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function runAnalysis() {
    await fetch("/api/assistant/decisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "analyze" }),
    });
    await refresh();
  }

  async function respond(id: string, response: string) {
    await fetch("/api/assistant/decisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "respond", recommendation_id: id, response }),
    });
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  const pending = center?.pending_decisions ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/assistant" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-2 text-sm font-medium text-indigo-800">{labels.youDecide}</p>
        {(center?.privacy_note || labels.privacy) && (
          <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {center?.privacy_note ?? labels.privacy}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void runAnalysis()}
            className="text-sm text-indigo-600 hover:underline"
          >
            {labels.analyze}
          </button>
          <Link href="/app/assistant/attention" className="text-sm text-gray-600 hover:underline">
            {labels.viewAttention}
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.pending}</h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.empty}</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {pending.map((rec) => (
              <li key={rec.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{rec.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                      {rec.domain} · {rec.decision_type}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${CONFIDENCE_STYLES[rec.confidence] ?? CONFIDENCE_STYLES.moderate}`}
                  >
                    {labels.confidenceLevels[rec.confidence] ?? rec.confidence}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{rec.recommendation}</p>
                {rec.reasoning.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">Reasoning</p>
                    <ul className="mt-1 space-y-1 text-sm text-gray-600">
                      {rec.reasoning.map((r, i) => (
                        <li key={i}>· {r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {rec.trade_offs.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-amber-800">
                    {rec.trade_offs.map((t, i) => (
                      <li key={i}>↔ {t}</li>
                    ))}
                  </ul>
                )}
                {rec.risk_indicators.length > 0 && (
                  <p className="mt-2 text-xs text-rose-700">
                    {rec.risk_indicators.join(" · ")}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void respond(rec.id, "accept")}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
                  >
                    {labels.acceptGuidance}
                  </button>
                  <button
                    type="button"
                    onClick={() => void respond(rec.id, "defer")}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700"
                  >
                    {labels.defer}
                  </button>
                  <button
                    type="button"
                    onClick={() => void respond(rec.id, "dismiss")}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500"
                  >
                    {labels.dismiss}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {Array.isArray(center?.business_insights) && center.business_insights.length > 0 && (
        <section className="rounded-2xl border border-sky-100 bg-sky-50/50 p-5">
          <h2 className="font-semibold text-sky-900">{labels.sections.business}</h2>
          <ul className="mt-3 space-y-2 text-sm text-sky-900">
            {center.business_insights.map((item) => (
              <li key={item.id}>
                <span className="font-medium">{item.title}</span> — {item.recommendation}
              </li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.priority_opportunities) && center.priority_opportunities.length > 0 && (
        <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
          <h2 className="font-semibold text-rose-900">{labels.sections.priorities}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {center.priority_opportunities.map((item) => (
              <li key={item.id} className="rounded-lg bg-white/80 px-3 py-2">
                <span className="font-medium">{item.title}</span>
                <span className="ml-2 text-xs text-rose-700">
                  risk {item.risk_level} · {labels.confidenceLevels[item.confidence] ?? item.confidence}
                </span>
                {item.description && <p className="mt-1 text-gray-600">{item.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.risk_indicators) && center.risk_indicators.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">{labels.sections.risks}</h2>
          <ul className="mt-2 space-y-1 text-sm text-amber-800">
            {center.risk_indicators.map((risk, i) => (
              <li key={i}>· {risk}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.framework) && center.framework.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.framework}</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-gray-700">
            {center.framework.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {Array.isArray(center?.ethical_principles) && center.ethical_principles.length > 0 && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.sections.ethics}</h2>
          <ul className="mt-2 space-y-1 text-sm text-violet-800">
            {center.ethical_principles.map((p, i) => (
              <li key={i}>· {p}</li>
            ))}
          </ul>
        </section>
      )}

      {center?.implementation_blueprint_phase60 ? (
        <BlueprintSection
          blueprint={center.implementation_blueprint_phase60}
          labels={labels.blueprint}
        />
      ) : null}

      {Array.isArray(center?.decision_history) && center.decision_history.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.history}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {center.decision_history.map((h) => (
              <li key={h.id} className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium">{h.title}</span>
                <span className="ml-2 text-xs text-gray-500">{h.user_response}</span>
                <span className="ml-2 text-xs text-gray-400">
                  {formatDate(h.created_at, locale)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {settings && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.settings}</h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.recommendations_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, recommendations_enabled: e.target.checked })
                }
              />
              {labels.settings.enabled}
            </label>
            <label className="block text-sm">
              <span className="text-gray-700">{labels.settings.proactivity}</span>
              <select
                value={settings.proactivity_level}
                onChange={(e) =>
                  setSettings({ ...settings, proactivity_level: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {PROACTIVITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {labels.proactivityLevels[level] ?? level}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.personal_decisions_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, personal_decisions_enabled: e.target.checked })
                }
              />
              {labels.settings.personal}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.use_historical_data}
                onChange={(e) =>
                  setSettings({ ...settings, use_historical_data: e.target.checked })
                }
              />
              {labels.settings.historical}
            </label>
            <label className="block text-sm">
              <span className="text-gray-700">{labels.settings.presentation}</span>
              <select
                value={settings.presentation_style}
                onChange={(e) =>
                  setSettings({ ...settings, presentation_style: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {PRESENTATION_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {labels.presentationStyles[style] ?? style}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="text-sm">
              <legend className="text-gray-700">Business domains</legend>
              <div className="mt-2 space-y-2">
                {BUSINESS_DOMAIN_KEYS.map((key) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(settings.business_domains_enabled?.[key])}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          business_domains_enabled: {
                            ...settings.business_domains_enabled,
                            [key]: e.target.checked,
                          },
                        })
                      }
                    />
                    {labels.businessDomains[key] ?? key}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  (settings.privacy_settings?.store_decision_history as boolean) !== false
                }
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privacy_settings: {
                      ...settings.privacy_settings,
                      store_decision_history: e.target.checked,
                    },
                  })
                }
              />
              {labels.settings.storeHistory}
            </label>
            <button
              type="button"
              onClick={() => void saveSettings()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              {saved ? labels.saved : labels.save}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
