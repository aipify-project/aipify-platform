"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CORE_PROVIDER_ONBOARDING_FIXTURES,
  getOnboardingModePresentation,
  getReadinessPresentation,
  getSupportPresentation,
  parseCoreProviderOnboardingContract,
  type CoreProviderOnboardingContract,
} from "@/lib/app-portal/integrations/onboarding";
import { ProviderOnboardingOverview } from "@/components/app/app-portal/ProviderOnboardingOverview";
import {
  actionableContractIssues,
  classifyProviderList,
  type PlatformProviderListRow,
  type ProviderAdminStatus,
} from "@/lib/platform/provider-onboarding/classify";
import { buildDefaultOnboardingContractDraft } from "@/lib/platform/provider-onboarding/default-contract";
import type { PlatformProviderOnboardingLabels } from "@/lib/platform/provider-onboarding/panel-props";
import { StructuredContractEditor } from "./StructuredContractEditor";

export type { PlatformProviderOnboardingLabels };

type TabId = "overview" | "edit" | "preview" | "json";
type FilterId = "all" | "available" | "reference" | "needs_contract" | "invalid";

type PlatformProviderOnboardingPanelProps = {
  labels: PlatformProviderOnboardingLabels;
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

function statusTone(status: ProviderAdminStatus): string {
  switch (status) {
    case "active":
    case "production_ready":
      return "bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100";
    case "preview":
    case "development":
      return "bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-100";
    case "contract_required":
    case "not_available_yet":
    case "reference_only":
      return "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100";
    case "contract_invalid":
    case "blocked":
      return "bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100";
    case "deprecated":
      return "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
    default:
      return "bg-violet-100 text-violet-950 dark:bg-violet-950 dark:text-violet-100";
  }
}

export function PlatformProviderOnboardingPanel({
  labels,
  messageCatalog,
}: PlatformProviderOnboardingPanelProps) {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [errorReference, setErrorReference] = useState<string | null>(null);
  const [rows, setRows] = useState<PlatformProviderListRow[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [contract, setContract] = useState<CoreProviderOnboardingContract | null>(null);
  const [savedJson, setSavedJson] = useState("");
  const [editorJson, setEditorJson] = useState("");
  const [detailError, setDetailError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [tab, setTab] = useState<TabId>("overview");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [listOpen, setListOpen] = useState(false);
  const [showIssueDetails, setShowIssueDetails] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [fixtureKey, setFixtureKey] = useState(
    CORE_PROVIDER_ONBOARDING_FIXTURES[0]?.providerKey ?? ""
  );
  const [history, setHistory] = useState<
    Array<{ created_at: string; action: string; onboarding_mode: string | null }>
  >([]);

  const t = useCallback(
    (key: string, params?: Record<string, string>) =>
      catalogTranslate(messageCatalog, key, params),
    [messageCatalog]
  );

  const classified = useMemo(() => classifyProviderList(rows), [rows]);
  const issues = useMemo(() => actionableContractIssues(classified), [classified]);

  const filtered = useMemo(() => {
    return classified.filter((item) => {
      const haystack = `${item.row.display_name} ${item.row.provider_key}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (filter === "available") return item.row.is_available && !item.isReference;
      if (filter === "reference") return item.isReference;
      if (filter === "needs_contract") return item.status === "contract_required";
      if (filter === "invalid") return item.status === "contract_invalid";
      return true;
    });
  }, [classified, filter, query]);

  const selected = useMemo(
    () => classified.find((item) => item.row.provider_key === selectedKey) ?? null,
    [classified, selectedKey]
  );

  const dirty = useMemo(() => {
    if (!contract) return false;
    return JSON.stringify(contract, null, 2) !== savedJson;
  }, [contract, savedJson]);

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
      const nextRows = Array.isArray(data?.providers)
        ? (data.providers as PlatformProviderListRow[])
        : [];
      setRows(nextRows);
      setSelectedKey((current) => current ?? nextRows[0]?.provider_key ?? null);
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
      setDetailError(null);
      setMessage(null);
      try {
        const res = await fetch(
          `/api/platform/provider-onboarding/${encodeURIComponent(selectedKey)}`
        );
        if (cancelled) return;
        if (!res.ok) {
          setDetailError(`HTTP ${res.status}`);
          setContract(null);
          setSavedJson("");
          setEditorJson("{}");
          return;
        }
        const data = await res.json();
        const raw = data?.onboarding_contract;
        const parsed = parseCoreProviderOnboardingContract(raw, {
          expectedProviderKey: selectedKey,
        });
        if (parsed.ok) {
          const json = JSON.stringify(parsed.contract, null, 2);
          setContract(parsed.contract);
          setSavedJson(json);
          setEditorJson(json);
        } else if (!raw || Object.keys(raw).length === 0) {
          const draft = buildDefaultOnboardingContractDraft({ providerKey: selectedKey });
          const json = JSON.stringify(draft, null, 2);
          setContract(draft);
          setSavedJson("");
          setEditorJson(json);
        } else {
          setContract(null);
          setSavedJson(JSON.stringify(raw ?? {}, null, 2));
          setEditorJson(JSON.stringify(raw ?? {}, null, 2));
          setDetailError(parsed.code);
        }
        setHistory(Array.isArray(data?.history) ? data.history : []);
      } catch {
        if (!cancelled) {
          setDetailError("network_error");
          setContract(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedKey]);

  async function saveContract(next: CoreProviderOnboardingContract) {
    if (!selectedKey) return;
    const parsed = parseCoreProviderOnboardingContract(next, {
      expectedProviderKey: selectedKey,
    });
    if (!parsed.ok) {
      setMessage(`${labels.validationFailed}: ${parsed.code}`);
      return;
    }
    setActing(true);
    const res = await fetch(
      `/api/platform/provider-onboarding/${encodeURIComponent(selectedKey)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboarding_contract: parsed.contract }),
      }
    );
    setActing(false);
    if (res.status === 403) {
      setMessage(labels.denied);
      return;
    }
    if (!res.ok) {
      setMessage(labels.validationFailed);
      return;
    }
    const json = JSON.stringify(parsed.contract, null, 2);
    setContract(parsed.contract);
    setSavedJson(json);
    setEditorJson(json);
    setMessage(labels.saved);
    await load();
  }

  function validateCurrent() {
    if (!contract || !selectedKey) return;
    const parsed = parseCoreProviderOnboardingContract(contract, {
      expectedProviderKey: selectedKey,
    });
    setMessage(
      parsed.ok
        ? labels.validationPassed
        : `${labels.validationFailed}: ${parsed.code}${parsed.detail ? ` (${parsed.detail})` : ""}`
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1680px] p-4 sm:p-6 lg:p-8" aria-busy="true">
        <p className="text-sm text-slate-600 dark:text-slate-300">{labels.loading}</p>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="mx-auto max-w-[960px] space-y-4 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {labels.pageLoadFailed}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{labels.loadFailed}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white"
          >
            {labels.retry}
          </button>
          <Link
            href={labels.backHref}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-600"
          >
            {labels.goBack}
          </Link>
        </div>
        {errorReference ? (
          <p className="text-xs text-slate-500">
            {labels.technicalReference}: {errorReference}
          </p>
        ) : null}
      </div>
    );
  }

  const selectedStatusLabel = selected
    ? labels.status[selected.status]
    : labels.selectProvider;

  return (
    <div className="mx-auto max-w-[1680px] space-y-5 p-4 sm:p-6 lg:p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{labels.title}</h1>
        <p className="max-w-4xl text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
      </header>

      {issues.length > 0 ? (
        <section
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-medium text-amber-950 dark:text-amber-100">
            {labels.issuesCount.replace("{count}", String(issues.length))}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-amber-400 px-3 py-1.5 text-sm dark:border-amber-700"
              onClick={() => setShowIssueDetails((value) => !value)}
            >
              {labels.showDetails}
            </button>
            <button
              type="button"
              className="rounded-lg border border-amber-400 px-3 py-1.5 text-sm dark:border-amber-700"
              onClick={() => {
                setFilter("needs_contract");
                setShowIssueDetails(true);
              }}
            >
              {labels.validateContracts}
            </button>
            <button
              type="button"
              className="rounded-lg bg-amber-700 px-3 py-1.5 text-sm font-medium text-white"
              onClick={() => {
                const first = issues[0];
                if (!first) return;
                setSelectedKey(first.row.provider_key);
                setTab(first.status === "contract_invalid" ? "edit" : "edit");
                setListOpen(false);
              }}
            >
              {labels.openFirstIssue}
            </button>
          </div>
          {showIssueDetails ? (
            <ul className="mt-3 space-y-1 text-sm text-amber-950 dark:text-amber-100">
              {issues.map((item) => (
                <li key={item.row.provider_key}>
                  <button
                    type="button"
                    className="underline-offset-2 hover:underline"
                    onClick={() => {
                      setSelectedKey(item.row.provider_key);
                      setTab("edit");
                    }}
                  >
                    {item.row.display_name} · {labels.status[item.status]}
                    {item.parseCode ? ` · ${item.parseCode}` : ""}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setListOpen(true)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
        >
          {labels.openProviderList}
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside
          className={`rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 ${
            listOpen
              ? "fixed inset-0 z-40 overflow-y-auto p-4 lg:static lg:inset-auto lg:z-auto lg:overflow-visible lg:p-3"
              : "hidden lg:block"
          }`}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {labels.providers}
            </h2>
            <button
              type="button"
              className="text-sm text-slate-600 lg:hidden dark:text-slate-300"
              onClick={() => setListOpen(false)}
            >
              {labels.closeProviderList}
            </button>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="mb-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
          />
          <div className="mb-3 flex flex-wrap gap-1">
            {(
              [
                ["all", labels.filterAll],
                ["available", labels.filterAvailable],
                ["reference", labels.filterReference],
                ["needs_contract", labels.filterNeedsContract],
                ["invalid", labels.filterInvalid],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`rounded-md px-2 py-1 text-xs ${
                  filter === id
                    ? "bg-violet-100 text-violet-950 dark:bg-violet-950 dark:text-violet-100"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ul className="space-y-1" role="listbox" aria-label={labels.providers}>
            {filtered.map((item) => {
              const modeLabel = item.onboardingMode
                ? t(getOnboardingModePresentation(item.onboardingMode).labelKey)
                : null;
              return (
                <li key={item.row.provider_key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedKey === item.row.provider_key}
                    onClick={() => {
                      setSelectedKey(item.row.provider_key);
                      setListOpen(false);
                      setTab("overview");
                    }}
                    className={`w-full rounded-lg px-3 py-2.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                      selectedKey === item.row.provider_key
                        ? "bg-violet-100 dark:bg-violet-950"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                          {item.row.display_name}
                        </div>
                        {modeLabel ? (
                          <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {modeLabel}
                          </div>
                        ) : null}
                      </div>
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${statusTone(item.status)}`}
                      >
                        {labels.status[item.status]}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="min-w-0 space-y-4">
          {!selected ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">{labels.selectProvider}</p>
          ) : (
            <>
              <header className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                        {selected.row.display_name}
                      </h2>
                      {selected.isReference ? (
                        <span className="rounded-md bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                          {labels.referenceBadge}
                        </span>
                      ) : null}
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusTone(selected.status)}`}
                      >
                        {selectedStatusLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {labels.providerKeySecondary}: {selected.row.provider_key}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {selected.onboardingMode ? (
                        <span className="rounded-md bg-violet-50 px-2 py-1 text-violet-950 dark:bg-violet-950/50 dark:text-violet-100">
                          {t(getOnboardingModePresentation(selected.onboardingMode).labelKey)}
                        </span>
                      ) : null}
                      {selected.readiness ? (
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100">
                          {t(getReadinessPresentation(selected.readiness).labelKey)}
                        </span>
                      ) : null}
                      {selected.support ? (
                        <span className="rounded-md bg-sky-50 px-2 py-1 text-sky-950 dark:bg-sky-950/40 dark:text-sky-100">
                          {t(getSupportPresentation(selected.support).labelKey)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setTab("edit")}
                      className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-medium text-white"
                    >
                      {selected.status === "contract_required"
                        ? labels.createContract
                        : labels.editContract}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab("preview")}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
                    >
                      {labels.previewInApp}
                    </button>
                    <button
                      type="button"
                      onClick={validateCurrent}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
                    >
                      {labels.validateContract}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab("overview")}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
                    >
                      {labels.viewHistory}
                    </button>
                  </div>
                </div>
                {selected.isReference ? (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {labels.referenceOnlyNotice}
                  </p>
                ) : null}
                {selected.status === "contract_required" ? (
                  <p className="mt-3 text-sm text-amber-900 dark:text-amber-100">
                    {labels.contractMissingBody}
                  </p>
                ) : null}
              </header>

              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
                {(
                  [
                    ["overview", labels.tabOverview],
                    ["edit", labels.tabEdit],
                    ["preview", labels.tabPreview],
                    ["json", labels.tabAdvancedJson],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${
                      tab === id
                        ? "bg-violet-100 font-medium text-violet-950 dark:bg-violet-950 dark:text-violet-100"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "overview" ? (
                <div className="space-y-4">
                  {selected.status === "contract_invalid" || detailError ? (
                    <section className="rounded-xl border border-rose-300 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/40">
                      <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-100">
                        {labels.invalidContract}
                      </h3>
                      <p className="mt-2 text-sm text-rose-900 dark:text-rose-100">
                        {labels.invalidContractBody}
                      </p>
                      <button
                        type="button"
                        className="mt-3 rounded-lg bg-rose-700 px-3 py-2 text-sm text-white"
                        onClick={() => setTab("edit")}
                      >
                        {labels.openContract}
                      </button>
                      {detailError ? (
                        <p className="mt-2 text-xs text-rose-800">
                          {labels.technicalReference}: {detailError}
                        </p>
                      ) : null}
                    </section>
                  ) : null}

                  {contract && selected.isContractValid !== false ? (
                    <ProviderOnboardingOverview
                      contract={contract}
                      installationState="not_started"
                      providerDisplayName={selected.row.display_name}
                      t={t}
                    />
                  ) : null}

                  <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="mb-2 text-sm font-semibold">{labels.viewHistory}</h3>
                    {history.length === 0 ? (
                      <p className="text-sm text-slate-500">—</p>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {history.map((entry, index) => (
                          <li key={`${entry.created_at}-${index}`} className="text-slate-700 dark:text-slate-200">
                            {new Date(entry.created_at).toLocaleString()} · {entry.action}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              ) : null}

              {tab === "edit" && contract ? (
                <StructuredContractEditor
                  contract={contract}
                  labels={labels}
                  t={t}
                  dirty={dirty}
                  acting={acting}
                  message={message}
                  onChange={setContract}
                  onSave={() => void saveContract(contract)}
                  onCancel={() => {
                    if (!savedJson) return;
                    setContract(JSON.parse(savedJson) as CoreProviderOnboardingContract);
                    setEditorJson(savedJson);
                    setMessage(null);
                  }}
                  onValidate={validateCurrent}
                />
              ) : null}

              {tab === "edit" && !contract ? (
                <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
                  <h3 className="text-sm font-semibold">{labels.contractMissing}</h3>
                  <p className="mt-2 text-sm">{labels.contractMissingBody}</p>
                  <button
                    type="button"
                    className="mt-3 rounded-lg bg-violet-700 px-3 py-2 text-sm text-white"
                    onClick={() => {
                      if (!selectedKey) return;
                      const draft = buildDefaultOnboardingContractDraft({
                        providerKey: selectedKey,
                      });
                      setContract(draft);
                      setEditorJson(JSON.stringify(draft, null, 2));
                    }}
                  >
                    {labels.createContract}
                  </button>
                </section>
              ) : null}

              {tab === "preview" ? (
                <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm text-slate-600 dark:text-slate-300">{labels.previewPurpose}</p>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <span>{labels.fixtures}</span>
                      <select
                        value={fixtureKey}
                        onChange={(event) => setFixtureKey(event.target.value)}
                        className="rounded-md border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-950"
                      >
                        {CORE_PROVIDER_ONBOARDING_FIXTURES.map((fixture) => (
                          <option key={fixture.providerKey} value={fixture.providerKey}>
                            {fixture.providerKey}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={`rounded-md px-3 py-1 text-sm ${previewMode === "desktop" ? "bg-violet-100" : "bg-slate-100 dark:bg-slate-800"}`}
                    >
                      {labels.previewDesktop}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={`rounded-md px-3 py-1 text-sm ${previewMode === "mobile" ? "bg-violet-100" : "bg-slate-100 dark:bg-slate-800"}`}
                    >
                      {labels.previewMobile}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTheme("light")}
                      className={`rounded-md px-3 py-1 text-sm ${previewTheme === "light" ? "bg-violet-100" : "bg-slate-100 dark:bg-slate-800"}`}
                    >
                      {labels.previewLight}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTheme("dark")}
                      className={`rounded-md px-3 py-1 text-sm ${previewTheme === "dark" ? "bg-violet-100" : "bg-slate-100 dark:bg-slate-800"}`}
                    >
                      {labels.previewDark}
                    </button>
                  </div>
                  <p className="text-xs font-medium text-slate-500">{labels.referenceBadge}</p>
                  <div
                    className={`${previewMode === "mobile" ? "mx-auto max-w-[390px]" : "w-full"} ${
                      previewTheme === "dark" ? "dark rounded-xl bg-slate-950 p-3" : ""
                    }`}
                  >
                    {(() => {
                      const fixture =
                        CORE_PROVIDER_ONBOARDING_FIXTURES.find(
                          (item) => item.providerKey === fixtureKey
                        ) ?? CORE_PROVIDER_ONBOARDING_FIXTURES[0];
                      if (!fixture) return null;
                      const parsed = parseCoreProviderOnboardingContract(fixture, {
                        expectedProviderKey: fixture.providerKey,
                      });
                      if (!parsed.ok) return null;
                      return (
                        <ProviderOnboardingOverview
                          contract={parsed.contract}
                          installationState="awaiting_customer_action"
                          providerDisplayName={fixture.providerKey}
                          t={t}
                        />
                      );
                    })()}
                  </div>
                </section>
              ) : null}

              {tab === "json" ? (
                <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                    {labels.advancedJsonWarning}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
                      onClick={() => {
                        try {
                          setEditorJson(JSON.stringify(JSON.parse(editorJson || "{}"), null, 2));
                        } catch {
                          setMessage(labels.validationFailed);
                        }
                      }}
                    >
                      {labels.formatJson}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
                      onClick={() => void navigator.clipboard.writeText(editorJson)}
                    >
                      {labels.copyJson}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
                      onClick={() => {
                        if (!savedJson) return;
                        setEditorJson(savedJson);
                        setContract(JSON.parse(savedJson) as CoreProviderOnboardingContract);
                      }}
                    >
                      {labels.resetJson}
                    </button>
                    <button
                      type="button"
                      disabled={acting}
                      className="rounded-lg bg-violet-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                      onClick={() => {
                        try {
                          const parsed = parseCoreProviderOnboardingContract(
                            JSON.parse(editorJson || "{}"),
                            { expectedProviderKey: selectedKey ?? undefined }
                          );
                          if (!parsed.ok) {
                            setMessage(`${labels.validationFailed}: ${parsed.code}`);
                            return;
                          }
                          void saveContract(parsed.contract);
                        } catch {
                          setMessage(labels.validationFailed);
                        }
                      }}
                    >
                      {labels.save}
                    </button>
                  </div>
                  <textarea
                    value={editorJson}
                    onChange={(event) => {
                      setEditorJson(event.target.value);
                      try {
                        const parsed = parseCoreProviderOnboardingContract(
                          JSON.parse(event.target.value || "{}"),
                          { expectedProviderKey: selectedKey ?? undefined }
                        );
                        if (parsed.ok) setContract(parsed.contract);
                      } catch {
                        // keep typing
                      }
                    }}
                    rows={22}
                    spellCheck={false}
                    aria-label={labels.advancedEditor}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                  />
                  {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
                </section>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
