"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import {
  parseBusinessContinuityCenter,
  type BusinessContinuityCenter,
} from "@/lib/business-continuity-engine/parse";
import type { buildBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";

type Labels = ReturnType<typeof buildBusinessContinuityLabels>;

function statusKeyToKind(statusKey?: string): AipifyStatusKind {
  if (statusKey === "critical_unavailable") return "not_allowed";
  if (statusKey === "continuity_risk") return "needs_attention";
  return "information";
}

export function CrisisOperationsPanel({ labels }: { labels: Labels }) {
  const [center, setCenter] = useState<BusinessContinuityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/business-continuity/center?section=crisis");
    if (res.ok) setCenter(parseBusinessContinuityCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.crisisDashboard}</h2>
          <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.continuity_status?.status_label ? (
        <AipifyStatusBadge
          kind={statusKeyToKind(center.continuity_status.status_key)}
          label={center.continuity_status.status_label}
        />
      ) : null}

      {[
        { title: labels.groups.crisisModes, items: center.crisis_modes, titleKey: "crisis_title" },
        { title: labels.groups.crisisCommand, items: center.crisis_command, titleKey: "role_title" },
        { title: labels.groups.crisisTimeline, items: center.crisis_timeline, titleKey: "event_title" },
        { title: labels.groups.crisisDecisions, items: center.crisis_decisions, titleKey: "decision_title" },
        { title: labels.groups.minimumOperating, items: center.minimum_operating_modes, titleKey: "mode_title" },
        { title: labels.groups.temporaryWorkflows, items: center.temporary_workflows, titleKey: "workflow_title" },
      ].map((section) =>
        section.items?.length ? (
          <section key={section.title} className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{section.title}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {section.items.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-zinc-900">{String(item[section.titleKey] ?? "")}</p>
                    {typeof item.status_label === "string" ? (
                      <AipifyStatusBadge
                        kind={statusKeyToKind(String(item.status_key ?? ""))}
                        label={item.status_label}
                      />
                    ) : null}
                  </div>
                  {typeof item.summary === "string" ? (
                    <p className="mt-2 text-sm text-zinc-600">{item.summary}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
