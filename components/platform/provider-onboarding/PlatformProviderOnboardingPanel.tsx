"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CORE_PROVIDER_ONBOARDING_FIXTURES,
  parseCoreProviderOnboardingContract,
  type CoreProviderOnboardingContract,
  type CoreProviderOnboardingParseFailure,
} from "@/lib/app-portal/integrations/onboarding";
import { ProviderOnboardingOverview } from "@/components/app/app-portal/ProviderOnboardingOverview";
import type { PlatformProviderOnboardingLabels } from "@/lib/platform/provider-onboarding/panel-props";

export type { PlatformProviderOnboardingLabels };

type ProviderListItem = {
  provider_key: string;
  display_name: string;
  is_available: boolean;
  onboarding_mode?: string | null;
  readiness_level?: string | null;
  support_level?: string | null;
  has_onboarding_contract?: boolean;
};

type PlatformProviderOnboardingPanelProps = {
  labels: PlatformProviderOnboardingLabels;
  /** Pre-resolved i18n strings only — never pass functions from Server Components. */
  messageCatalog: Record<string, string>;
};

function catalogTranslate(
  catalog: Record<string, string>,
  key: string,
  params?: Record<string, string>
): string {
  const template = catalog[key] ?? key;
  if (!params) return template;
  return Object.entries(params).reduce(
    (acc, [name, value]) => acc.replaceAll(`{${name}}`, value),
    template
  );
}

function InvalidContractCard({
  labels,
  providerName,
  parseCode,
  onOpenEditor,
}: {
  labels: PlatformProviderOnboardingLabels;
  providerName: string;
  parseCode?: CoreProviderOnboardingParseFailure | string;
  onOpenEditor: () => void;
}) {
  return (
    <section
      className="rounded-xl border border-rose-300 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/40"
      role="alert"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-100">
        {labels.invalidContract}
      </h3>
      <p className="mt-2 text-sm text-rose-900 dark:text-rose-100">
        {labels.invalidContractBody}
      </p>
      <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">{providerName}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenEditor}
          className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
        >
          {labels.openContract}
        </button>
        <p className="self-center text-xs text-rose-800 dark:text-rose-200">
          {labels.contactAdmin}
        </p>
      </div>
      {parseCode ? (
        <p className="mt-3 text-xs text-rose-700 dark:text-rose-300">
          {labels.technicalReference}: {parseCode}
        </p>
      ) : null}
    </section>
  );
}

export function PlatformProviderOnboardingPanel({
  labels,
  messageCatalog,
}: PlatformProviderOnboardingPanelProps) {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [errorReference, setErrorReference] = useState<string | null>(null);
  const [providers, setProviders] = useState<ProviderListItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editorJson, setEditorJson] = useState("");
  const [detailLoadError, setDetailLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fixtureKey, setFixtureKey] = useState(CORE_PROVIDER_ONBOARDING_FIXTURES[0]?.providerKey ?? "");
  const [acting, setActing] = useState(false);
  const [editorFocused, setEditorFocused] = useState(false);

  const t = useCallback(
    (key: string, params?: Record<string, string>) =>
      catalogTranslate(messageCatalog, key, params),
    [messageCatalog]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    setErrorReference(null);
    try {
      const res = await fetch("/api/platform/provider-onboarding");
      if (!res.ok) {
        setLoadFailed(true);
        setErrorReference(`HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      const rows = Array.isArray(data?.providers) ? (data.providers as ProviderListItem[]) : [];
      setProviders(rows);
      setSelectedKey((current) => current ?? rows[0]?.provider_key ?? null);
      setLoading(false);
    } catch {
      setLoadFailed(true);
      setErrorReference("network_error");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selectedKey) return;
    let cancelled = false;
    void (async () => {
      setDetailLoadError(null);
      try {
        const res = await fetch(
          `/api/platform/provider-onboarding/${encodeURIComponent(selectedKey)}`
        );
        if (cancelled) return;
        if (!res.ok) {
          setDetailLoadError(`HTTP ${res.status}`);
          setEditorJson("{}");
          return;
        }
        const data = await res.json();
        setEditorJson(JSON.stringify(data?.onboarding_contract ?? {}, null, 2));
        setMessage(null);
      } catch {
        if (!cancelled) {
          setDetailLoadError("network_error");
          setEditorJson("{}");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
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

  const fixtureParse = useMemo(() => {
    const fixture =
      CORE_PROVIDER_ONBOARDING_FIXTURES.find((item) => item.providerKey === fixtureKey) ??
      CORE_PROVIDER_ONBOARDING_FIXTURES[0];
    if (!fixture) return { ok: false as const, code: "missing_contract" as const };
    return parseCoreProviderOnboardingContract(fixture, {
      expectedProviderKey: fixture.providerKey,
    });
  }, [fixtureKey]);

  const providersMissingContract = useMemo(
    () => providers.filter((row) => row.has_onboarding_contract === false),
    [providers]
  );

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
    return (
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8" aria-busy="true">
        <p className="text-sm text-slate-600 dark:text-slate-300">{labels.loading}</p>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="mx-auto max-w-[960px] space-y-4 p-4 sm:p-6 lg:p-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {labels.pageLoadFailed}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{labels.loadFailed}</p>
        </header>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            {labels.retry}
          </button>
          <Link
            href={labels.backHref}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            {labels.goBack}
          </Link>
        </div>
        {errorReference ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {labels.technicalReference}: {errorReference}
          </p>
        ) : null}
      </div>
    );
  }

  const selectedName =
    providers.find((p) => p.provider_key === selectedKey)?.display_name ?? selectedKey ?? "";

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{labels.title}</h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
      </header>

      {providersMissingContract.length > 0 ? (
        <p
          className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
          aria-live="polite"
        >
          {labels.partialLoadWarning}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {labels.providers}
          </h2>
          <ul className="space-y-1">
            {providers.map((provider) => {
              const invalid = provider.has_onboarding_contract === false;
              return (
                <li key={provider.provider_key}>
                  <button
                    type="button"
                    onClick={() => setSelectedKey(provider.provider_key)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                      selectedKey === provider.provider_key
                        ? "bg-violet-100 text-violet-950 dark:bg-violet-950 dark:text-violet-100"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-medium">{provider.display_name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {provider.onboarding_mode ?? "—"} ·{" "}
                      {provider.is_available ? labels.available : labels.unavailable}
                      {invalid ? ` · ${labels.invalidContract}` : ""}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="space-y-4">
          {!selectedKey ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">{labels.selectProvider}</p>
          ) : (
            <>
              {detailLoadError ? (
                <InvalidContractCard
                  labels={labels}
                  providerName={selectedName}
                  parseCode={detailLoadError}
                  onOpenEditor={() => setEditorFocused(true)}
                />
              ) : null}

              {parsedEditor.ok ? (
                <ProviderOnboardingOverview
                  contract={parsedEditor.contract as CoreProviderOnboardingContract}
                  installationState="not_started"
                  providerDisplayName={selectedName}
                  t={t}
                />
              ) : (
                <InvalidContractCard
                  labels={labels}
                  providerName={selectedName}
                  parseCode={!parsedEditor.ok ? parsedEditor.code : undefined}
                  onOpenEditor={() => setEditorFocused(true)}
                />
              )}

              <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {labels.advancedEditor}
                </h2>
                <textarea
                  value={editorJson}
                  onChange={(event) => setEditorJson(event.target.value)}
                  rows={18}
                  autoFocus={editorFocused}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                  spellCheck={false}
                  aria-label={labels.advancedEditor}
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={acting || !parsedEditor.ok}
                    onClick={() => void save()}
                    className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                  >
                    {labels.save}
                  </button>
                  {message ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
                  ) : null}
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{labels.fixtures}</h2>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
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
        {fixtureParse.ok ? (
          <ProviderOnboardingOverview
            contract={fixtureParse.contract}
            installationState="awaiting_customer_action"
            providerDisplayName={fixtureParse.contract.providerKey}
            t={t}
          />
        ) : (
          <InvalidContractCard
            labels={labels}
            providerName={fixtureKey}
            parseCode={!fixtureParse.ok ? fixtureParse.code : undefined}
            onOpenEditor={() => undefined}
          />
        )}
      </section>
    </div>
  );
}
