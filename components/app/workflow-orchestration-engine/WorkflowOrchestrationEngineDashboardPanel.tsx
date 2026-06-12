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
  type AutonomyLevel,
  type OperationalExample,
  type OperationalStep,
  type HumanApprovalCategory,
  type CompanionGuidanceExample,
  type SafetyAvoidItem,
  type WorkflowTypeEntry,
  type BuilderElement,
  type ApprovalGateType,
  type CompanionCapability,
  type ExceptionAction,
  type WorkflowMetric,
  type TemplateLibraryEntry,
  type CompanionLimitation,
  type SecurityRequirement,
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

function AutonomyLevelCard({ level, approvalRequiredLabel }: { level: AutonomyLevel; approvalRequiredLabel?: string }) {
  const levelClass =
    level.level === 4
      ? "border-violet-200 bg-violet-50/40"
      : level.level === 3
        ? "border-indigo-200 bg-indigo-50/40"
        : "border-amber-200 bg-amber-50/40";

  return (
    <article className={`rounded-lg border p-4 ${levelClass}`}>
      <p className="font-medium text-gray-900">
        {level.label}
        {level.approval_required && approvalRequiredLabel ? (
          <span className="ml-2 text-xs font-normal text-amber-700">· {approvalRequiredLabel}</span>
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

function OperationalExampleCard({ example }: { example: OperationalExample }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-gray-900">{example.label}</p>
        {example.route ? (
          <Link href={example.route} className="text-xs text-indigo-600 hover:underline">
            {example.route}
          </Link>
        ) : null}
      </div>
      {example.description ? <p className="mt-1 text-xs text-gray-600">{example.description}</p> : null}
      {typeof example.autonomy_level === "number" ? (
        <p className="mt-1 text-xs text-gray-500">Autonomy level {example.autonomy_level}</p>
      ) : null}
      {example.steps && example.steps.length > 0 ? (
        <ol className="mt-3 list-inside list-decimal space-y-1 text-xs text-gray-600">
          {example.steps.map((step: OperationalStep) => (
            <li key={`${step.order}-${step.action}`}>
              <span className="font-medium">{step.action}</span>
              {step.system ? ` · ${step.system}` : ""}
              {step.approval && step.approval !== "none" ? ` · approval: ${step.approval}` : ""}
              {step.note ? ` — ${step.note}` : ""}
            </li>
          ))}
        </ol>
      ) : null}
    </article>
  );
}

function HumanApprovalCategoryCard({ category }: { category: HumanApprovalCategory }) {
  return (
    <article className="rounded-lg border border-rose-100 bg-rose-50/30 p-3">
      <p className="text-sm font-medium text-gray-900">{category.label}</p>
      {category.description ? <p className="mt-1 text-xs text-gray-600">{category.description}</p> : null}
      {category.route ? (
        <Link href={category.route} className="mt-1 inline-block text-xs text-indigo-600 hover:underline">
          {category.route}
        </Link>
      ) : null}
    </article>
  );
}

function CompanionGuidanceCard({ item }: { item: CompanionGuidanceExample }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-sm font-medium text-gray-900">
        {item.emoji} {item.cue}
      </p>
      {item.example ? <p className="mt-1 text-xs text-gray-600">{item.example}</p> : null}
    </article>
  );
}

function SafetyAvoidCard({ item }: { item: SafetyAvoidItem }) {
  return (
    <article className="rounded-lg border border-rose-200 bg-rose-50/40 p-3">
      <p className="text-sm font-medium text-rose-900">{item.label}</p>
      {item.description ? <p className="mt-1 text-xs text-rose-800">{item.description}</p> : null}
    </article>
  );
}

function WorkflowTypeCard({ entry }: { entry: WorkflowTypeEntry }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900">{entry.label}</p>
        {entry.route ? (
          <Link href={entry.route} className="text-xs text-indigo-600 hover:underline">
            {entry.route}
          </Link>
        ) : null}
      </div>
      {entry.description ? <p className="mt-1 text-xs text-gray-600">{entry.description}</p> : null}
    </article>
  );
}

function BuilderElementRow({ element }: { element: BuilderElement }) {
  return (
    <li className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
      <span className="font-medium text-gray-900">{element.label}</span>
      {element.description ? <span className="text-gray-600"> — {element.description}</span> : null}
    </li>
  );
}

function ApprovalGateCard({ gate }: { gate: ApprovalGateType }) {
  return (
    <article className="rounded-lg border border-amber-100 bg-amber-50/30 p-3">
      <p className="text-sm font-medium text-gray-900">{gate.label}</p>
      {gate.description ? <p className="mt-1 text-xs text-gray-600">{gate.description}</p> : null}
    </article>
  );
}

function CompanionCapabilityCard({ capability }: { capability: CompanionCapability }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-sm font-medium text-gray-900">{capability.label}</p>
      {capability.description ? <p className="mt-1 text-xs text-gray-600">{capability.description}</p> : null}
    </article>
  );
}

function ExceptionActionCard({ action }: { action: ExceptionAction }) {
  return (
    <article className="rounded-lg border border-orange-100 bg-orange-50/30 p-3">
      <p className="text-sm font-medium text-gray-900">{action.label}</p>
      {action.description ? <p className="mt-1 text-xs text-gray-600">{action.description}</p> : null}
    </article>
  );
}

function WorkflowMetricRow({ metric }: { metric: WorkflowMetric }) {
  return (
    <li className="text-sm text-gray-600">
      <span className="font-medium text-gray-900">{metric.label}</span>
      {metric.description ? ` — ${metric.description}` : ""}
    </li>
  );
}

function TemplateLibraryCard({ entry }: { entry: TemplateLibraryEntry }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-sm font-medium text-gray-900">{entry.label}</p>
      {entry.category ? <p className="text-xs text-gray-500">{entry.category}</p> : null}
      {entry.description ? <p className="mt-1 text-xs text-gray-600">{entry.description}</p> : null}
    </article>
  );
}

function CompanionLimitationCard({ item }: { item: CompanionLimitation }) {
  return (
    <article className="rounded-lg border border-rose-200 bg-rose-50/40 p-3">
      <p className="text-sm font-medium text-rose-900">{item.label}</p>
      {item.description ? <p className="mt-1 text-xs text-rose-800">{item.description}</p> : null}
    </article>
  );
}

function SecurityRequirementRow({ requirement }: { requirement: SecurityRequirement }) {
  return (
    <li className="text-sm text-gray-600">
      <span className="font-medium text-gray-900">{requirement.label}</span>
      {requirement.description ? ` — ${requirement.description}` : ""}
    </li>
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
  const aoobp = dashboard.autonomous_operations_orchestration;
  const awobp133 = dashboard.autonomous_workflow_orchestration_blueprint;
  const awobp133Engagement = dashboard.awobp133_engagement_summary;

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
        <Link href="/app/action-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.actionCenter}
        </Link>
        <Link href="/app/actions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.actionHub}
        </Link>
        <Link href="/app/operations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.operationsCenter79}
        </Link>
        <Link href="/app/companion-workforce-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.companionWorkforce}
        </Link>
        <Link href="/app/growth-partner-operations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.growthPartnerOps}
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

      {aoobp ? (
        <>
          <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
            <h2 className="text-sm font-semibold text-teal-900">{labels.aoobpTitle}</h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-teal-700">
              {aoobp.title ?? labels.aoobpPhase86}
              {aoobp.engine_phase ? ` · ${aoobp.engine_phase}` : ""}
            </p>
            {aoobp.mission ? <p className="mt-2 text-sm font-medium text-teal-900">{aoobp.mission}</p> : null}
            {aoobp.philosophy ? <p className="mt-2 text-sm text-teal-900">{aoobp.philosophy}</p> : null}
            {aoobp.abos_principle ? <p className="mt-2 text-xs text-teal-800">{aoobp.abos_principle}</p> : null}
            {aoobp.vision ? (
              <p className="mt-2 text-sm italic text-teal-800">&ldquo;{aoobp.vision}&rdquo;</p>
            ) : null}
            {aoobp.distinction_note ? (
              <p className="mt-2 text-xs text-teal-700">{aoobp.distinction_note}</p>
            ) : null}
          </section>

          {aoobp.objectives && aoobp.objectives.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpObjectives}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {aoobp.objectives.map((objective) => (
                  <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
                ))}
              </div>
            </section>
          ) : null}

          {aoobp.autonomy_levels && aoobp.autonomy_levels.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpAutonomyLevels}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {aoobp.autonomy_levels.map((level) => (
                  <AutonomyLevelCard
                    key={level.key ?? level.label}
                    level={level}
                    approvalRequiredLabel={labels.aoobpApprovalRequired}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {aoobp.operational_examples && aoobp.operational_examples.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpOperationalExamples}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                {aoobp.operational_examples.map((example) => (
                  <OperationalExampleCard key={example.key ?? example.label} example={example} />
                ))}
              </div>
            </section>
          ) : null}

          {aoobp.human_approval_principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpHumanApproval}</h3>
              {aoobp.human_approval_principle.principle ? (
                <p className="mt-2 text-sm text-gray-600">{aoobp.human_approval_principle.principle}</p>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(aoobp.human_approval_principle.categories ?? []).map((category) => (
                  <HumanApprovalCategoryCard key={category.key ?? category.label} category={category} />
                ))}
              </div>
            </section>
          ) : null}

          {aoobp.audit_transparency ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpAuditTransparency}</h3>
              {aoobp.audit_transparency.principle ? (
                <p className="mt-2 text-sm text-gray-600">{aoobp.audit_transparency.principle}</p>
              ) : null}
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
                {(aoobp.audit_transparency.required_fields ?? []).map((field) => (
                  <li key={field.key ?? field.label}>
                    <span className="font-medium">{field.label}</span>
                    {field.description ? ` — ${field.description}` : ""}
                  </li>
                ))}
              </ul>
              {aoobp.audit_transparency.privacy_note ? (
                <p className="mt-2 text-xs text-gray-500">{aoobp.audit_transparency.privacy_note}</p>
              ) : null}
            </section>
          ) : null}

          {aoobp.safety_principles ? (
            <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-6">
              <h3 className="text-sm font-semibold text-rose-900">{labels.aoobpSafetyPrinciples}</h3>
              {aoobp.safety_principles.principle ? (
                <p className="mt-2 text-sm text-rose-800">{aoobp.safety_principles.principle}</p>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(aoobp.safety_principles.avoid ?? []).map((item) => (
                  <SafetyAvoidCard key={item.key ?? item.label} item={item} />
                ))}
              </div>
              {aoobp.safety_principles.safety_note ? (
                <p className="mt-2 text-xs text-rose-700">{aoobp.safety_principles.safety_note}</p>
              ) : null}
            </section>
          ) : null}

          {aoobp.companion_guidance ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpCompanionGuidance}</h3>
              {aoobp.companion_guidance.principle ? (
                <p className="mt-2 text-sm text-gray-600">{aoobp.companion_guidance.principle}</p>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {(aoobp.companion_guidance.examples ?? []).map((item) => (
                  <CompanionGuidanceCard key={item.cue ?? item.example} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {aoobp.trust_connection ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpTrustConnection}</h3>
              {aoobp.trust_connection.principle ? (
                <p className="mt-2 text-sm text-gray-600">{aoobp.trust_connection.principle}</p>
              ) : null}
              <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                {(aoobp.trust_connection.connections ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {aoobp.dogfooding ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpDogfooding}</h3>
              {aoobp.dogfooding.principle ? (
                <p className="mt-2 text-sm text-gray-600">{aoobp.dogfooding.principle}</p>
              ) : null}
              {aoobp.dogfooding.focus_areas && aoobp.dogfooding.focus_areas.length > 0 ? (
                <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                  {aoobp.dogfooding.focus_areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {aoobp.dogfooding.aipify_group ? (
                  <DogfoodingCard entry={aoobp.dogfooding.aipify_group} title={labels.aipifyGroup} />
                ) : null}
                {aoobp.dogfooding.unonight ? (
                  <DogfoodingCard entry={aoobp.dogfooding.unonight} title={labels.unonight} />
                ) : null}
              </div>
            </section>
          ) : null}

          {aoobp.success_criteria && aoobp.success_criteria.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpSuccessCriteria}</h3>
              <ul className="mt-4 space-y-2">
                {aoobp.success_criteria.map((criterion) => (
                  <SuccessCriterionRow key={criterion.key ?? criterion.label} criterion={criterion} />
                ))}
              </ul>
            </section>
          ) : null}

          {aoobp.integration_links && aoobp.integration_links.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.aoobpIntegrationLinks}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {aoobp.integration_links.map((link) => (
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
        </>
      ) : null}

      {awobp133 ? (
        <>
          <section className="rounded-xl border border-purple-200 bg-purple-50/50 p-6">
            <h2 className="text-sm font-semibold text-purple-900">{labels.awobp133Title}</h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-purple-700">
              {awobp133.title ?? labels.awobp133Phase133}
              {awobp133.era ? ` · ${awobp133.era}` : ""}
              {awobp133.engine_phase ? ` · ${awobp133.engine_phase}` : ""}
            </p>
            {dashboard.autonomous_organization_era_note ? (
              <p className="mt-2 text-xs text-purple-700">{dashboard.autonomous_organization_era_note}</p>
            ) : null}
            {awobp133.mission ? <p className="mt-2 text-sm font-medium text-purple-900">{awobp133.mission}</p> : null}
            {awobp133.philosophy ? <p className="mt-2 text-sm text-purple-900">{awobp133.philosophy}</p> : null}
            {awobp133.abos_principle ? <p className="mt-2 text-xs text-purple-800">{awobp133.abos_principle}</p> : null}
            {awobp133.vision ? (
              <p className="mt-2 text-sm italic text-purple-800">&ldquo;{awobp133.vision}&rdquo;</p>
            ) : null}
            {awobp133.distinction_note ? (
              <p className="mt-2 text-xs text-purple-700">{awobp133.distinction_note}</p>
            ) : null}
          </section>

          {awobp133Engagement ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133EngagementSummary}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: labels.activeWorkflows, value: awobp133Engagement.active_workflows },
                  { label: labels.awaitingApproval, value: awobp133Engagement.awaiting_approval },
                  { label: labels.awobp133SupportedTypes, value: awobp133Engagement.supported_workflow_types },
                  { label: labels.awobp133TemplateLibraryCount, value: awobp133Engagement.template_library_count },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{String(item.value ?? "—")}</p>
                  </div>
                ))}
              </div>
              {awobp133Engagement.privacy_note ? (
                <p className="mt-2 text-xs text-gray-500">{awobp133Engagement.privacy_note}</p>
              ) : null}
            </section>
          ) : null}

          {awobp133.objectives && awobp133.objectives.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133Objectives}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {awobp133.objectives.map((objective) => (
                  <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
                ))}
              </div>
            </section>
          ) : null}

          {awobp133.workflow_orchestration_center ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133OrchestrationCenter}</h3>
              {awobp133.workflow_orchestration_center.principle ? (
                <p className="mt-2 text-sm text-gray-600">{awobp133.workflow_orchestration_center.principle}</p>
              ) : null}
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
                {(awobp133.workflow_orchestration_center.capabilities ?? []).map((cap) => (
                  <li key={cap.key ?? cap.label}>
                    <span className="font-medium">{cap.label}</span>
                    {cap.description ? ` — ${cap.description}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {awobp133.supported_workflow_types && awobp133.supported_workflow_types.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133SupportedTypes}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {awobp133.supported_workflow_types.map((entry) => (
                  <WorkflowTypeCard key={entry.key ?? entry.label} entry={entry} />
                ))}
              </div>
            </section>
          ) : null}

          {awobp133.visual_workflow_builder ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133VisualBuilder}</h3>
              {awobp133.visual_workflow_builder.principle ? (
                <p className="mt-2 text-sm text-gray-600">{awobp133.visual_workflow_builder.principle}</p>
              ) : null}
              <ul className="mt-4 space-y-2">
                {(awobp133.visual_workflow_builder.elements ?? []).map((element) => (
                  <BuilderElementRow key={element.key ?? element.label} element={element} />
                ))}
              </ul>
            </section>
          ) : null}

          {awobp133.workflow_triggers && awobp133.workflow_triggers.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133WorkflowTriggers}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {awobp133.workflow_triggers.map((trigger) => (
                  <WorkflowTypeCard key={trigger.key ?? trigger.label} entry={trigger} />
                ))}
              </div>
            </section>
          ) : null}

          {awobp133.approval_framework ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133ApprovalFramework}</h3>
              {awobp133.approval_framework.principle ? (
                <p className="mt-2 text-sm text-gray-600">{awobp133.approval_framework.principle}</p>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(awobp133.approval_framework.gate_types ?? []).map((gate) => (
                  <ApprovalGateCard key={gate.key ?? gate.label} gate={gate} />
                ))}
              </div>
            </section>
          ) : null}

          {awobp133.companion_participation ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133CompanionParticipation}</h3>
              {awobp133.companion_participation.principle ? (
                <p className="mt-2 text-sm text-gray-600">{awobp133.companion_participation.principle}</p>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(awobp133.companion_participation.capabilities ?? []).map((capability) => (
                  <CompanionCapabilityCard key={capability.key ?? capability.label} capability={capability} />
                ))}
              </div>
            </section>
          ) : null}

          {awobp133.companion_limitations && awobp133.companion_limitations.length > 0 ? (
            <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-6">
              <h3 className="text-sm font-semibold text-rose-900">{labels.awobp133CompanionLimitations}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {awobp133.companion_limitations.map((item) => (
                  <CompanionLimitationCard key={item.key ?? item.label} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {awobp133.exception_management ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133ExceptionManagement}</h3>
              {awobp133.exception_management.principle ? (
                <p className="mt-2 text-sm text-gray-600">{awobp133.exception_management.principle}</p>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(awobp133.exception_management.actions ?? []).map((action) => (
                  <ExceptionActionCard key={action.key ?? action.label} action={action} />
                ))}
              </div>
            </section>
          ) : null}

          {awobp133.workflow_analytics ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133WorkflowAnalytics}</h3>
              {awobp133.workflow_analytics.principle ? (
                <p className="mt-2 text-sm text-gray-600">{awobp133.workflow_analytics.principle}</p>
              ) : null}
              <ul className="mt-3 list-inside list-disc space-y-1">
                {(awobp133.workflow_analytics.metrics ?? []).map((metric) => (
                  <WorkflowMetricRow key={metric.key ?? metric.label} metric={metric} />
                ))}
              </ul>
            </section>
          ) : null}

          {awobp133.template_library && awobp133.template_library.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133TemplateLibrary}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {awobp133.template_library.map((entry) => (
                  <TemplateLibraryCard key={entry.key ?? entry.label} entry={entry} />
                ))}
              </div>
            </section>
          ) : null}

          {awobp133.security_requirements ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133SecurityRequirements}</h3>
              {awobp133.security_requirements.principle ? (
                <p className="mt-2 text-sm text-gray-600">{awobp133.security_requirements.principle}</p>
              ) : null}
              <ul className="mt-3 list-inside list-disc space-y-1">
                {(awobp133.security_requirements.requirements ?? []).map((requirement) => (
                  <SecurityRequirementRow key={requirement.key ?? requirement.label} requirement={requirement} />
                ))}
              </ul>
              {awobp133.security_requirements.two_factor_route ? (
                <Link
                  href={awobp133.security_requirements.two_factor_route}
                  className="mt-2 inline-block text-xs text-indigo-600 hover:underline"
                >
                  {labels.awobp133TwoFactor}
                </Link>
              ) : null}
            </section>
          ) : null}

          {awobp133.self_love_connection ? (
            <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-6">
              <h3 className="text-sm font-semibold text-rose-900">{labels.awobp133SelfLoveConnection}</h3>
              {awobp133.self_love_connection.principle ? (
                <p className="mt-2 text-sm text-rose-800">{awobp133.self_love_connection.principle}</p>
              ) : null}
              <ul className="mt-2 list-inside list-disc text-sm text-rose-800">
                {(awobp133.self_love_connection.connections ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {awobp133.dogfooding ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133Dogfooding}</h3>
              {awobp133.dogfooding.principle ? (
                <p className="mt-2 text-sm text-gray-600">{awobp133.dogfooding.principle}</p>
              ) : null}
              {awobp133.dogfooding.focus_areas && awobp133.dogfooding.focus_areas.length > 0 ? (
                <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                  {awobp133.dogfooding.focus_areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {awobp133.dogfooding.aipify_group ? (
                  <DogfoodingCard entry={awobp133.dogfooding.aipify_group} title={labels.aipifyGroup} />
                ) : null}
                {awobp133.dogfooding.unonight ? (
                  <DogfoodingCard entry={awobp133.dogfooding.unonight} title={labels.unonight} />
                ) : null}
              </div>
            </section>
          ) : null}

          {awobp133.success_criteria && awobp133.success_criteria.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133SuccessCriteria}</h3>
              <ul className="mt-4 space-y-2">
                {awobp133.success_criteria.map((criterion) => (
                  <SuccessCriterionRow key={criterion.key ?? criterion.label} criterion={criterion} />
                ))}
              </ul>
            </section>
          ) : null}

          {awobp133.vision_phrases && awobp133.vision_phrases.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133VisionPhrases}</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
                {awobp133.vision_phrases.map((phrase) => (
                  <li key={phrase}>{phrase}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {awobp133.integration_links && awobp133.integration_links.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.awobp133IntegrationLinks}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {awobp133.integration_links.map((link) => (
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

          {awobp133.privacy_note ? (
            <p className="text-xs text-gray-500">{awobp133.privacy_note}</p>
          ) : null}
        </>
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
