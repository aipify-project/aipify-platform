"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  parseDocumentOutputEngineDashboard,
  type DocumentOutputEngineDashboard,
  type OutputGeneration,
  type OutputSchedule,
  type OutputTemplate,
} from "@/lib/aipify/document-output-engine";

type Props = { labels: Record<string, string> };

export function DocumentOutputEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<DocumentOutputEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [scheduling, setScheduling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/document-output-engine/dashboard");
    if (res.ok) setDashboard(parseDocumentOutputEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const generateFromTemplate = async (template: OutputTemplate) => {
    if (!template.id) return;
    setGenerating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/document-output-engine/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_id: template.id,
        report_type: template.template_type,
        format: template.output_format,
        source_context: { template_name: template.template_name, metadata_only: true },
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.generateFailed);
    } else {
      await load();
    }
    setGenerating(false);
  };

  const scheduleTemplate = async (template: OutputTemplate) => {
    if (!template.id) return;
    setScheduling(template.id);
    setActionError(null);
    const res = await fetch("/api/aipify/document-output-engine/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: template.id, cadence: "monthly", delivery_method: "download" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.scheduleFailed);
    } else {
      await load();
    }
    setScheduling(null);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/document-output-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-indigo-700">{labels.trustNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.templates && dashboard.templates.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.templates}</h3>
          <ul className="mt-4 space-y-3">
            {dashboard.templates.map((template: OutputTemplate) => (
              <li key={template.id} className="rounded border border-gray-100 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{template.template_name}</p>
                    <p className="text-xs text-gray-500">
                      {template.template_type} · {template.output_format} · {template.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded border border-indigo-200 px-2 py-1 text-xs disabled:opacity-50"
                      disabled={generating || template.status !== "active"}
                      onClick={() => void generateFromTemplate(template)}
                    >
                      {generating ? labels.generating : labels.generate}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-indigo-200 px-2 py-1 text-xs disabled:opacity-50"
                      disabled={scheduling === template.id || template.status !== "active"}
                      onClick={() => void scheduleTemplate(template)}
                    >
                      {scheduling === template.id ? labels.scheduling : labels.schedule}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.generations && dashboard.generations.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.generations}</h3>
          <ul className="mt-4 space-y-2">
            {dashboard.generations.map((gen: OutputGeneration) => (
              <li key={gen.id} className="text-xs text-gray-600">
                {gen.report_type} · {gen.output_format} · {gen.delivery_status} · {gen.generated_at}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.schedules && dashboard.schedules.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.schedules}</h3>
          <ul className="mt-4 space-y-2">
            {dashboard.schedules.map((schedule: OutputSchedule) => (
              <li key={schedule.id} className="text-xs text-gray-600">
                {schedule.cadence} · {schedule.delivery_method} · next {schedule.next_run_at}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.executive_summary && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveSummary}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.executive_summary, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
