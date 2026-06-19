"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { parseAbsenceCenter } from "@/lib/absence-coverage-engine/parse";
import type { buildAbsenceCoverageLabels } from "@/lib/absence-coverage-engine/labels";

type Labels = ReturnType<typeof buildAbsenceCoverageLabels>;

function ItemCard({ title, summary, badge }: { title: string; summary?: string; badge?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
    </div>
  );
}

export function AbsenceCoverageSettingsPanel({
  labels,
  apiBase = "/api/absence/settings",
}: {
  labels: Labels;
  apiBase?: string;
}) {
  const [data, setData] = useState<ReturnType<typeof parseAbsenceCenter> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiBase);
    if (res.ok) setData(parseAbsenceCenter(await res.json()));
    else setData(null);
    setLoading(false);
  }, [apiBase]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!data?.found) {
    return (
      <PlatformEmptyState
        title={labels.empty}
        message={data?.error ?? labels.empty}
        primaryAction={{ label: labels.refresh, onClick: () => void load() }}
      />
    );
  }

  const settings = data.settings ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">{labels.settingsTitle}</h2>
        <p className="mt-1 text-sm text-zinc-600">{labels.settingsSubtitle}</p>
        {data.privacy_note ? <p className="mt-2 text-xs text-zinc-500">{data.privacy_note}</p> : null}
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        <ItemCard title={labels.maxCoverageLevel} summary={String(settings.max_coverage_level ?? "—")} badge="admin" />
        <ItemCard title="Default coverage level" summary={String(settings.default_coverage_level ?? "—")} />
        <ItemCard title="Delegation rules" summary={settings.delegation_rules_enabled ? "Enabled" : "Disabled"} />
        <ItemCard title="Template approval" summary={settings.template_approval_required ? "Required" : "Optional"} />
        <ItemCard title="Urgency escalation" summary={settings.urgency_escalation_enabled ? "Enabled" : "Disabled"} />
        <ItemCard title="Private reasons hidden" summary={settings.private_reasons_hidden ? "Yes" : "No"} />
      </section>

      {(data.admin_policies?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.sections.policies}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.admin_policies!.map((p) => (
              <ItemCard key={String(p.policy_key)} title={String(p.policy_title)} summary={String(p.summary ?? "")} />
            ))}
          </div>
        </section>
      )}

      {(data.response_templates?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.sections.aipifyResponses}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.response_templates!.map((t) => (
              <ItemCard key={String(t.template_key)} title={String(t.template_title)} summary={String(t.summary ?? "")} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
