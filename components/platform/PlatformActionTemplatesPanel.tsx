"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useEffect, useState } from "react";
import {
  getActionRiskStyle,
  parseActionTemplates,
  type ActionTemplate,
} from "@/lib/platform/action-engine";
import { createClient } from "@/lib/supabase/client";

type PlatformActionTemplatesPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    category: string;
    riskLevel: string;
    steps: string;
    outcome: string;
    rollback: string;
    yes: string;
    no: string;
    riskLabels: Record<string, string>;
  };
};

export default function PlatformActionTemplatesPanel({
  labels,
}: PlatformActionTemplatesPanelProps) {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<ActionTemplate[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_action_templates");
      if (!cancelled) {
        setTemplates(error || !data ? [] : parseActionTemplates(data));
        setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>
      {templates.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {templates.map((template) => (
            <article
              key={template.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold text-gray-900">{template.title}</h2>
              {template.description && (
                <p className="mt-1 text-sm text-gray-600">{template.description}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                  {labels.category}: {template.category}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getActionRiskStyle(template.default_risk_level)}`}
                >
                  {labels.riskLevel}: {labels.riskLabels[template.default_risk_level]}
                </span>
              </div>
              {template.prepared_steps.length > 0 && (
                <ul className="mt-3 list-disc space-y-0.5 pl-5 text-sm text-gray-700">
                  {template.prepared_steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              )}
              {template.expected_outcome && (
                <p className="mt-3 text-sm text-gray-700">
                  <span className="font-semibold">{labels.outcome}:</span> {template.expected_outcome}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {labels.rollback}: {template.rollback_available ? labels.yes : labels.no}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
