"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CORE_PROVIDER_ONBOARDING_FIXTURES,
  parseCoreProviderOnboardingContract,
  type CoreProviderOnboardingContract,
} from "@/lib/app-portal/integrations/onboarding";
import { ProviderOnboardingOverview } from "@/components/app/app-portal/ProviderOnboardingOverview";

export type PlatformProviderOnboardingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  loadFailed: string;
  providers: string;
  fixtures: string;
  save: string;
  saved: string;
  invalidContract: string;
  denied: string;
  advancedEditor: string;
  selectProvider: string;
  available: string;
  unavailable: string;
  preview: string;
};

type ProviderListItem = {
  provider_key: string;
  display_name: string;
  is_available: boolean;
  onboarding_mode?: string | null;
  readiness_level?: string | null;
  support_level?: string | null;
};

type PlatformProviderOnboardingPanelProps = {
  labels: PlatformProviderOnboardingLabels;
  translate: (key: string) => string;
};

export function PlatformProviderOnboardingPanel({
  labels,
  translate,
}: PlatformProviderOnboardingPanelProps) {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [providers, setProviders] = useState<ProviderListItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editorJson, setEditorJson] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [fixtureKey, setFixtureKey] = useState(CORE_PROVIDER_ONBOARDING_FIXTURES[0]?.providerKey ?? "");
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    const res = await fetch("/api/platform/provider-onboarding");
    if (!res.ok) {
      setLoadFailed(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    const rows = Array.isArray(data?.providers) ? (data.providers as ProviderListItem[]) : [];
    setProviders(rows);
    if (!selectedKey && rows[0]?.provider_key) setSelectedKey(rows[0].provider_key);
    setLoading(false);
  }, [selectedKey]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selectedKey) return;
    void (async () => {
      const res = await fetch(
        `/api/platform/provider-onboarding/${encodeURIComponent(selectedKey)}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setEditorJson(JSON.stringify(data?.onboarding_contract ?? {}, null, 2));
      setMessage(null);
    })();
  }, [selectedKey]);

  const parsedEditor = useMemo(() => {
    try {
      return parseCoreProviderOnboardingContract(JSON.parse(editorJson || "{}"), {
        expectedProviderKey: selectedKey ?? undefined,
      });
    } catch {
      return { ok: false as const, code: "malformed_contract" as const };
    }
  }, [editorJson, selectedKey]);

  const fixtureContract = useMemo(() => {
    return (
      CORE_PROVIDER_ONBOARDING_FIXTURES.find((item) => item.providerKey === fixtureKey) ??
      CORE_PROVIDER_ONBOARDING_FIXTURES[0]
    );
  }, [fixtureKey]);

  async function save() {
    if (!selectedKey || !parsedEditor.ok) {
      setMessage(labels.invalidContract);
      return;
    }
    setActing(true);
    const res = await fetch(
      `/api/platform/provider-onboarding/${encodeURIComponent(selectedKey)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboarding_contract: parsedEditor.contract }),
      }
    );
    setActing(false);
    if (res.status === 403) {
      setMessage(labels.denied);
      return;
    }
    if (!res.ok) {
      setMessage(labels.invalidContract);
      return;
    }
    setMessage(labels.saved);
    await load();
  }

  if (loading) {
    return <p className="p-6 text-sm text-slate-600 dark:text-slate-300">{labels.loading}</p>;
  }
  if (loadFailed) {
    return <p className="p-6 text-sm text-rose-700 dark:text-rose-300">{labels.loadFailed}</p>;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{labels.title}</h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {labels.providers}
          </h2>
          <ul className="space-y-1">
            {providers.map((provider) => (
              <li key={provider.provider_key}>
                <button
                  type="button"
                  onClick={() => setSelectedKey(provider.provider_key)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    selectedKey === provider.provider_key
                      ? "bg-violet-100 text-violet-950 dark:bg-violet-950 dark:text-violet-100"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="font-medium">{provider.display_name}</div>
                  <div className="text-xs text-slate-500">
                    {provider.onboarding_mode ?? "—"} ·{" "}
                    {provider.is_available ? labels.available : labels.unavailable}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-4">
          {!selectedKey ? (
            <p className="text-sm text-slate-600">{labels.selectProvider}</p>
          ) : (
            <>
              {parsedEditor.ok ? (
                <ProviderOnboardingOverview
                  contract={parsedEditor.contract as CoreProviderOnboardingContract}
                  installationState="not_started"
                  providerDisplayName={
                    providers.find((p) => p.provider_key === selectedKey)?.display_name ??
                    selectedKey
                  }
                  t={translate}
                />
              ) : (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:bg-rose-950 dark:text-rose-100">
                  {labels.invalidContract}
                </p>
              )}

              <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h2 className="mb-2 text-sm font-semibold">{labels.advancedEditor}</h2>
                <textarea
                  value={editorJson}
                  onChange={(event) => setEditorJson(event.target.value)}
                  rows={18}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                  spellCheck={false}
                  aria-label={labels.advancedEditor}
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={acting || !parsedEditor.ok}
                    onClick={() => void save()}
                    className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {labels.save}
                  </button>
                  {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">{labels.fixtures}</h2>
          <label className="flex items-center gap-2 text-sm">
            <span>{labels.preview}</span>
            <select
              value={fixtureKey}
              onChange={(event) => setFixtureKey(event.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-950"
            >
              {CORE_PROVIDER_ONBOARDING_FIXTURES.map((fixture) => (
                <option key={fixture.providerKey} value={fixture.providerKey}>
                  {fixture.providerKey} · {fixture.onboardingMode}
                </option>
              ))}
            </select>
          </label>
        </div>
        {fixtureContract ? (
          <ProviderOnboardingOverview
            contract={fixtureContract}
            installationState="awaiting_customer_action"
            providerDisplayName={fixtureContract.providerKey}
            t={translate}
          />
        ) : null}
      </section>
    </div>
  );
}
