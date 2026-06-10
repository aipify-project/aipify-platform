"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import {
  parseIntelligenceAuditLog,
  type IntelligenceAuditEntry,
  type IntelligenceAuditFilters,
} from "@/lib/platform/intelligence-engine";

type PlatformIntelligenceAuditPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    type: string;
    action: string;
    pattern: string;
    reviewer: string;
    notes: string;
    timestamp: string;
    explanation: string;
    filters: {
      title: string;
      eventType: string;
      environment: string;
      action: string;
      reviewer: string;
      riskLevel: string;
      dateFrom: string;
      dateTo: string;
      apply: string;
      clear: string;
      all: string;
    };
    eventTypes: Record<string, string>;
    riskLevels: Record<string, string>;
  };
};

const EMPTY_FILTERS: IntelligenceAuditFilters = {};

export default function PlatformIntelligenceAuditPanel({
  locale,
  labels,
}: PlatformIntelligenceAuditPanelProps) {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<IntelligenceAuditEntry[]>([]);
  const [filters, setFilters] = useState<IntelligenceAuditFilters>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<IntelligenceAuditFilters>(EMPTY_FILTERS);

  const load = useCallback(async (activeFilters: IntelligenceAuditFilters) => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_intelligence_audit_log", {
      p_event_type: activeFilters.event_type || null,
      p_environment: activeFilters.environment || null,
      p_action: activeFilters.action || null,
      p_reviewer: activeFilters.reviewer || null,
      p_risk_level: activeFilters.risk_level || null,
      p_since: activeFilters.since || null,
      p_until: activeFilters.until || null,
    });

    setEntries(error || !data ? [] : parseIntelligenceAuditLog(data));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(EMPTY_FILTERS);
  }, [load]);

  function applyFilters() {
    setFilters(draft);
    void load(draft);
  }

  function clearFilters() {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    void load(EMPTY_FILTERS);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">{labels.filters.title}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            label={labels.filters.eventType}
            value={draft.event_type ?? ""}
            onChange={(value) => setDraft((prev) => ({ ...prev, event_type: value || undefined }))}
            options={[
              { value: "", label: labels.filters.all },
              ...Object.entries(labels.eventTypes).map(([value, label]) => ({ value, label })),
            ]}
          />
          <FilterInput
            label={labels.filters.environment}
            value={draft.environment ?? ""}
            onChange={(value) => setDraft((prev) => ({ ...prev, environment: value || undefined }))}
          />
          <FilterInput
            label={labels.filters.action}
            value={draft.action ?? ""}
            onChange={(value) => setDraft((prev) => ({ ...prev, action: value || undefined }))}
          />
          <FilterInput
            label={labels.filters.reviewer}
            value={draft.reviewer ?? ""}
            onChange={(value) => setDraft((prev) => ({ ...prev, reviewer: value || undefined }))}
          />
          <FilterSelect
            label={labels.filters.riskLevel}
            value={draft.risk_level ?? ""}
            onChange={(value) => setDraft((prev) => ({ ...prev, risk_level: value || undefined }))}
            options={[
              { value: "", label: labels.filters.all },
              ...Object.entries(labels.riskLevels).map(([value, label]) => ({ value, label })),
            ]}
          />
          <FilterInput
            label={labels.filters.dateFrom}
            type="date"
            value={draft.since?.slice(0, 10) ?? ""}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                since: value ? new Date(value).toISOString() : undefined,
              }))
            }
          />
          <FilterInput
            label={labels.filters.dateTo}
            type="date"
            value={draft.until?.slice(0, 10) ?? ""}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                until: value ? new Date(`${value}T23:59:59`).toISOString() : undefined,
              }))
            }
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700"
          >
            {labels.filters.apply}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            {labels.filters.clear}
          </button>
        </div>
      </section>

      {loading ? (
        <p className="text-sm text-gray-500">{labels.loading}</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <article
              key={`${entry.type}-${entry.id}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{entry.pattern_title}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDateTime(entry.created_at, locale)} · {labels.type}:{" "}
                    {labels.eventTypes[entry.type] ?? entry.type} · {labels.action}: {entry.action}
                  </p>
                </div>
                {entry.risk_level ? (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                    {labels.riskLevels[entry.risk_level] ?? entry.risk_level}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                  {labels.explanation}
                </p>
                <p className="mt-1 text-sm text-gray-800">{entry.explanation}</p>
              </div>
              {entry.reviewer_email ? (
                <p className="mt-2 text-xs text-gray-500">
                  {labels.reviewer}: {entry.reviewer_email}
                </p>
              ) : null}
              {entry.notes ? (
                <p className="mt-1 text-xs text-gray-500">
                  {labels.notes}: {entry.notes}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
      />
    </label>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
