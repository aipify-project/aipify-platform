"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseWorkflowOrchestrationEngineDashboard,
  type WorkflowOrchestrationEngineDashboard,
  type BlueprintObjective,
  type WorkflowExampleCategory,
  type ApprovalLevel,
  type BlueprintSuccessCriterion,
  type BlueprintIntegrationLink,
  type DogfoodingEntry,
} from "@/lib/aipify/workflow-orchestration-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </article>
  );
}

function ExampleCategoryCard({ category }: { category: WorkflowExampleCategory }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-gray-900">{category.label}</p>
        {category.route ? (
          <Link href={category.route} className="text-xs text-indigo-600 hover:underline">
            {category.route}
          </Link>
        ) : null}
      </div>
      {category.examples && category.examples.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
          {category.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function ApprovalLevelCard({ level }: { level: ApprovalLevel }) {
  const riskClass =
    level.key === "critical" || level.key === "high_risk"
      ? "border-rose-200 bg-rose-50/40"
      : level.key === "medium_risk"
        ? "border-amber-200 bg-amber-50/40"
        : "border-emerald-200 bg-emerald-50/40";

  return (
    <article className={`rounded-lg border p-4 ${riskClass}`}>
      <p className="font-medium text-gray-900">
        {level.label}
        {typeof level.trust_action_level === "number" ? (
          <span className="ml-2 text-xs font-normal text-gray-500">
            (level {level.trust_action_level})
          </span>
        ) : null}
      </p>
      {level.description ? <p className="mt-1 text-xs text-gray-600">{level.description}</p> : null}
      {level.examples && level.examples.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
          {level.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function DogfoodingCard({ entry, title }: { entry: DogfoodingEntry; title: string }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-sm font-medium text-gray-900">{title}</p>
      {entry.role ? <p className="mt-1 text-xs text-gray-600">{entry.role}</p> : null}
      {entry.focus && entry.focus.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
          {entry.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function SuccessCriterionRow({ criterion }: { criterion: BlueprintSuccessCriterion }) {
  return (
    <li className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-100 p-3 text-sm">
      <span
        className={`rounded px-2 py-0.5 text-xs font-medium ${
          criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
        }`}
      >
        {criterion.met ? "✓" : "○"}
      </span>
      <div>
        <p className="text-gray-900">{criterion.label}</p>
        {criterion.note ? <p className="mt-1 text-xs text-gray-500">{criterion.note}</p> : null}
      </div>
    </li>
  );
}

export function WorkflowOrchestrationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<WorkflowOrchestrationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/workflow-orchestration-engine/dashboard");
    if (res.ok) setDashboard(parseWorkflowOrchestrationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createFromTemplate = async (templateKey: string) => {
    setActionMessage(null);
    const res = await fetch("/api/aipify/workflow-orchestration-engine/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_key: templateKey }),
    });
    if (res.ok) {
      setActionMessage(labels.templateCreated);
      await load();
    } else {
      const err = (await res.json()) as { error?: string };
      setActionMessage(err.error ?? labels.actionFailed);
    }
  };

  const setStatus = async (workflowId: string, status: string) => {
    setActionMessage(null);
    const res = await fetch(`/api/aipify/workflow-orchestration-engine/workflows/${workflowId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setActionMessage(labels.statusUpdated);
      await load();
    } else {
      const err = (await res.json()) as { error?: string };
      setActionMessage(err.error ?? labels.actionFailed);
    }
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const workflows = (dashboard.workflows ?? []) as Array<Record<string, unknown>>;
  const templates = (dashboard.templates ?? []) as Array<Record<string, unknown>>;
  const orchestrationSummary = dashboard.workflow_orchestration_summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/human-oversight-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.humanOversight}
        </Link>
        <Link
          href="/app/operations-center-foundation-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.operationsCenter}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.trustActions}
        </Link>
        <Link href="/app/business-packs-foundation-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.businessPacks}
        </Link>
        <Link
          href="/app/marketplace-partner-ecosystem-foundation-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.marketplace}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLove}
        </Link>
        {(dashboard.workflow_integration_links ?? []).slice(0, 4).map((link: BlueprintIntegrationLink) =>
          link.route ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
      </div>

      {dashboard.implementation_blueprint_phase40 ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.blueprintTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">
            {dashboard.implementation_blueprint_phase40.title ?? labels.blueprintPhase40}
            {dashboard.implementation_blueprint_phase40.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase40.engine_phase}`
              : ""}
          </p>
          {dashboard.autonomous_workflow_mission ? (
            <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.autonomous_workflow_mission}</p>
          ) : null}
          {dashboard.autonomous_workflow_philosophy ? (
            <p className="mt-2 text-sm text-violet-900">{dashboard.autonomous_workflow_philosophy}</p>
          ) : null}
          {dashboard.workflow_abos_principle ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.workflow_abos_principle}</p>
          ) : null}
          {dashboard.workflow_distinction_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.workflow_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.safety_note && (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.safety_note}</p>
        )}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
          {actionMessage}
        </p>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs font-medium text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {orchestrationSummary ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.orchestrationSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: labels.activeWorkflows, value: orchestrationSummary.active_workflows },
              { label: labels.awaitingApproval, value: orchestrationSummary.awaiting_approval },
              { label: labels.totalExecutions, value: orchestrationSummary.total_executions },
              { label: labels.orchestrationHealth, value: orchestrationSummary.orchestration_health },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{String(item.value ?? "—")}</p>
              </div>
            ))}
          </div>
          {orchestrationSummary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{orchestrationSummary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => (
              <li key={pr}>{pr}</li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.workflow_objectives && dashboard.workflow_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.workflowObjectives}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dashboard.workflow_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.workflow_examples && dashboard.workflow_examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.workflowExamples}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dashboard.workflow_examples.map((category) => (
              <ExampleCategoryCard key={category.category ?? category.label} category={category} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.approval_principles ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.approvalPrinciples}</h3>
          {dashboard.approval_principles.principle ? (
            <p className="mt-2 text-sm text-gray-600">{dashboard.approval_principles.principle}</p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(dashboard.approval_principles.levels ?? []).map((level) => (
              <ApprovalLevelCard key={level.key ?? level.label} level={level} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.explainability_principles ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.explainabilityPrinciples}</h3>
          {dashboard.explainability_principles.principle ? (
            <p className="mt-2 text-sm text-gray-600">{dashboard.explainability_principles.principle}</p>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
            {(dashboard.explainability_principles.required_elements ?? []).map((el) => (
              <li key={el.key ?? el.label}>
                <span className="font-medium">{el.label}</span>
                {el.description ? ` — ${el.description}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.workflow_marketplace_connection ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.marketplaceConnection}</h3>
          {dashboard.workflow_marketplace_connection.principle ? (
            <p className="mt-2 text-sm text-gray-600">{dashboard.workflow_marketplace_connection.principle}</p>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
            {(dashboard.workflow_marketplace_connection.sources ?? []).map((source) => (
              <li key={source.key ?? source.label}>
                <span className="font-medium">{source.label}</span>
                {source.description ? ` — ${source.description}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.workflow_self_love_connection ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-6">
          <h3 className="text-sm font-semibold text-rose-900">{labels.selfLoveConnection}</h3>
          {dashboard.workflow_self_love_connection.principle ? (
            <p className="mt-2 text-sm text-rose-800">{dashboard.workflow_self_love_connection.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc text-sm text-rose-800">
            {(dashboard.workflow_self_love_connection.connections ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.workflow_dogfooding ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.dogfooding}</h3>
          {dashboard.workflow_dogfooding.principle ? (
            <p className="mt-2 text-sm text-gray-600">{dashboard.workflow_dogfooding.principle}</p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dashboard.workflow_dogfooding.aipify_group ? (
              <DogfoodingCard entry={dashboard.workflow_dogfooding.aipify_group} title={labels.aipifyGroup} />
            ) : null}
            {dashboard.workflow_dogfooding.unonight ? (
              <DogfoodingCard entry={dashboard.workflow_dogfooding.unonight} title={labels.unonight} />
            ) : null}
          </div>
        </section>
      ) : null}

      {dashboard.workflow_success_criteria && dashboard.workflow_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-4 space-y-2">
            {dashboard.workflow_success_criteria.map((criterion) => (
              <SuccessCriterionRow key={criterion.key ?? criterion.label} criterion={criterion} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.workflow_vision_phrases && dashboard.workflow_vision_phrases.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.workflow_vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.workflow_integration_links && dashboard.workflow_integration_links.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationLinks}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.workflow_integration_links.map((link) => (
              <li key={String(link.key ?? link.route)}>
                {link.route ? (
                  <Link href={link.route} className="font-medium text-indigo-700 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-900">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.templates}</h3>
        <p className="mt-1 text-xs text-gray-500">{labels.templatesHint}</p>
        <ul className="mt-4 space-y-3">
          {templates.map((tpl) => (
            <li
              key={String(tpl.template_key)}
              className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-gray-100 p-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{String(tpl.template_name)}</p>
                <p className="text-xs text-gray-600">{String(tpl.description)}</p>
              </div>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                onClick={() => void createFromTemplate(String(tpl.template_key))}
              >
                {labels.useTemplate}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.workflows}</h3>
        {workflows.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noWorkflows}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {workflows.map((wf) => (
              <li
                key={String(wf.id)}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{String(wf.workflow_name)}</p>
                  <p className="text-xs text-gray-500">
                    {String(wf.status)} · {String(wf.trust_level)} · {String(wf.step_count)} {labels.steps}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {wf.status === "draft" && (
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => void setStatus(String(wf.id), "active")}
                    >
                      {labels.activate}
                    </button>
                  )}
                  {wf.status === "active" && (
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => void setStatus(String(wf.id), "paused")}
                    >
                      {labels.pause}
                    </button>
                  )}
                  {wf.status === "paused" && (
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => void setStatus(String(wf.id), "active")}
                    >
                      {labels.resume}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
