"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCompanionIdentityEngineDashboard,
  type CompanionIdentityEngineDashboard,
  type IdentityTrait,
  type ModuleConsistencyEntry,
  type SignatureElement,
} from "@/lib/aipify/companion-identity-engine";

type Props = { labels: Record<string, string> };

export function CompanionIdentityEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CompanionIdentityEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [signatureEnabled, setSignatureEnabled] = useState(true);
  const [bellMomentsEnabled, setBellMomentsEnabled] = useState(true);
  const [selfLoveRefsEnabled, setSelfLoveRefsEnabled] = useState(true);
  const [playfulEnabled, setPlayfulEnabled] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/companion-identity-engine/dashboard");
    if (res.ok) {
      const parsed = parseCompanionIdentityEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.signature_elements_enabled === "boolean") {
        setSignatureEnabled(parsed.settings.signature_elements_enabled);
      }
      if (typeof parsed.settings?.bell_moments_enabled === "boolean") {
        setBellMomentsEnabled(parsed.settings.bell_moments_enabled);
      }
      if (typeof parsed.settings?.self_love_refs_enabled === "boolean") {
        setSelfLoveRefsEnabled(parsed.settings.self_love_refs_enabled);
      }
      if (typeof parsed.settings?.playful_when_appropriate === "boolean") {
        setPlayfulEnabled(parsed.settings.playful_when_appropriate);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings() {
    setSavingSettings(true);
    setActionError(null);
    const res = await fetch("/api/aipify/companion-identity-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signature_elements_enabled: signatureEnabled,
        bell_moments_enabled: bellMomentsEnabled,
        self_love_refs_enabled: selfLoveRefsEnabled,
        playful_when_appropriate: playfulEnabled,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.settingsFailed);
    } else {
      await load();
    }
    setSavingSettings(false);
  }

  async function exportReport() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/companion-identity-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const traits = dashboard.core_identity_traits ?? [];
  const commRules = dashboard.communication_style_rules ?? [];
  const personalityTraits = dashboard.personality_traits ?? [];
  const signatureElements = dashboard.signature_elements ?? [];
  const modules = dashboard.module_consistency ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const fox = dashboard.fox_exchange;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-indigo-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs text-indigo-700">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs text-indigo-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-indigo-700">
          {dashboard.distinction_note ?? labels.distinctionNote}
        </p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {canExport ? (
          <button
            type="button"
            className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
            disabled={exporting}
            onClick={() => void exportReport()}
          >
            {exporting ? labels.exporting : labels.exportReport}
          </button>
        ) : null}
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-gray-500">{labels.modulesTracked}</dt>
            <dd className="font-medium">{String(summary.modules_tracked ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{labels.modulesAligned}</dt>
            <dd className="font-medium">{String(summary.modules_aligned ?? 0)}</dd>
          </div>
        </dl>
      </section>

      {traits.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.coreIdentityTraits}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {traits.map((t: IdentityTrait) => (
              <li key={t.key ?? t.label} className="rounded border border-indigo-50 p-2">
                <div className="font-medium">{t.label}</div>
                {t.description ? <div className="mt-1 text-xs text-gray-600">{t.description}</div> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {commRules.length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.communicationStyle}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {commRules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </section>
      )}

      {personalityTraits.length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.personalityTraits}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {personalityTraits.map((trait, i) => (
              <li key={i}>{trait}</li>
            ))}
          </ul>
        </section>
      )}

      {signatureElements.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.signatureElements}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {signatureElements.map((el: SignatureElement) => (
              <li key={el.key ?? el.label} className="rounded border border-indigo-50 p-2">
                <div className="font-medium">{el.label}</div>
                {el.description ? <div className="mt-1 text-xs text-gray-600">{el.description}</div> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {fox && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.foxExchange}</h3>
          {fox.title ? <p className="mt-1 text-xs text-amber-800">{fox.title}</p> : null}
          {fox.setup ? <p className="mt-2 text-sm italic text-gray-700">{fox.setup}</p> : null}
          {fox.response ? <p className="mt-1 text-sm text-gray-800">{fox.response}</p> : null}
          {fox.note ? <p className="mt-2 text-xs text-gray-600">{fox.note}</p> : null}
        </section>
      )}

      {dashboard.self_love_note && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.selfLoveNote}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.self_love_note}</p>
        </section>
      )}

      {dashboard.learning_journey_philosophy && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.learningJourneyTitle}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.learning_journey_philosophy}</p>
          {dashboard.learning_journey_standard_note ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.learning_journey_standard_note}</p>
          ) : null}
          {dashboard.vision_rose_phrase ? (
            <p className="mt-3 text-sm italic text-violet-900">{dashboard.vision_rose_phrase}</p>
          ) : null}
        </section>
      )}

      {dashboard.capability_gap_examples && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.capabilityGapExamples}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {(dashboard.capability_gap_examples.avoid?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-red-700">{labels.capabilityGapAvoid}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {dashboard.capability_gap_examples.avoid?.map((phrase, i) => (
                    <li key={i}>{phrase}</li>
                  ))}
                </ul>
              </div>
            )}
            {(dashboard.capability_gap_examples.prefer?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-emerald-700">{labels.capabilityGapPrefer}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {dashboard.capability_gap_examples.prefer?.map((phrase, i) => (
                    <li key={i}>{phrase}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {(dashboard.growth_principle_phrases?.length ?? 0) > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.growthPrinciplePhrases}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.growth_principle_phrases?.map((phrase, i) => (
              <li key={i}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      {modules.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.moduleConsistency}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {modules.map((m: ModuleConsistencyEntry) => (
              <li
                key={m.id ?? m.module_key}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 p-2"
              >
                <div>
                  <div className="font-medium">{m.label}</div>
                  {m.route ? (
                    <Link href={m.route} className="text-xs text-indigo-600 hover:underline">
                      {m.route}
                    </Link>
                  ) : null}
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    m.identity_aligned ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {m.identity_aligned ? labels.aligned : labels.reviewNeeded}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {canManage && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.identitySettings}</h3>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={signatureEnabled}
                onChange={(e) => setSignatureEnabled(e.target.checked)}
              />
              {labels.signatureElementsEnabled}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bellMomentsEnabled}
                onChange={(e) => setBellMomentsEnabled(e.target.checked)}
              />
              {labels.bellMomentsEnabled}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selfLoveRefsEnabled}
                onChange={(e) => setSelfLoveRefsEnabled(e.target.checked)}
              />
              {labels.selfLoveRefsEnabled}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={playfulEnabled}
                onChange={(e) => setPlayfulEnabled(e.target.checked)}
              />
              {labels.playfulWhenAppropriate}
            </label>
          </div>
          <button
            type="button"
            disabled={savingSettings}
            onClick={() => void saveSettings()}
            className="mt-3 rounded bg-indigo-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
          >
            {savingSettings ? labels.saving : labels.saveSettings}
          </button>
        </section>
      )}

      {Object.keys(integrationLinks).length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {Object.entries(integrationLinks).map(([key, href]) => {
              const path = String(href);
              const isExternalDoc = path.endsWith(".md");
              return (
                <li key={key}>
                  {isExternalDoc ? (
                    <span className="text-gray-600">{key}: {path}</span>
                  ) : (
                    <Link href={path} className="text-indigo-600 hover:underline">
                      {key}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
