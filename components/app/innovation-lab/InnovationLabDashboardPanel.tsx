"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseInnovationLabDashboard,
  type InnovationLabDashboard,
  type CompanionInnovationExample,
  type BlueprintObjective,
  type IdeaManagementDomain,
  type BlueprintCapability,
  type RecognitionExperience,
  type IntegrationLink,
  type DogfoodingEntry,
} from "@/lib/aipify/innovation-lab";

type InnovationLabDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "approved":
    case "completed":
    case "active":
    case "rollout":
      return "bg-emerald-100 text-emerald-800";
    case "under_review":
    case "analysis":
    case "pilot":
    case "sandbox":
      return "bg-blue-100 text-blue-800";
    case "in_experiment":
    case "design":
    case "recruiting":
      return "bg-amber-100 text-amber-800";
    case "declined":
    case "cancelled":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function riskClass(risk?: string) {
  switch (risk) {
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-emerald-100 text-emerald-800";
  }
}

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </article>
  );
}

function CapabilityList({ items }: { items?: BlueprintCapability[] }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
      {items.map((item) => (
        <li key={item.key ?? item.label}>
          <span className="font-medium">{item.label}</span>
          {item.description ? ` — ${item.description}` : ""}
        </li>
      ))}
    </ul>
  );
}

function IdeaDomainCard({ domain }: { domain: IdeaManagementDomain }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="font-medium text-gray-900">{domain.label}</p>
      {domain.examples && domain.examples.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
          {domain.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function CompanionExampleCard({ example }: { example: CompanionInnovationExample }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-sm font-medium text-gray-900">
        {example.emoji} {example.scenario}
      </p>
      {example.example ? <p className="mt-1 text-xs italic text-gray-600">{example.example}</p> : null}
    </article>
  );
}

function RecognitionCard({ experience }: { experience: RecognitionExperience }) {
  return (
    <article className="rounded-lg border border-rose-100 bg-rose-50/40 p-3">
      <p className="text-sm font-medium text-rose-900">
        {experience.emoji} {experience.label}
      </p>
      {experience.description ? <p className="mt-1 text-xs text-rose-800">{experience.description}</p> : null}
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

export function InnovationLabDashboardPanel({ labels }: InnovationLabDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<InnovationLabDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/innovation-lab/dashboard");
    if (res.ok) setDashboard(parseInnovationLabDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/innovation-lab/briefings/generate", { method: "POST" });
    await load();
  };

  const approveIdea = async (ideaId: string) => {
    setActing(`approve-${ideaId}`);
    await fetch(`/api/aipify/innovation-lab/ideas/${ideaId}/approve`, { method: "POST" });
    setActing(null);
    await load();
  };

  const advanceExperiment = async (experimentId: string) => {
    setActing(`advance-${experimentId}`);
    await fetch(`/api/aipify/innovation-lab/experiments/${experimentId}/advance`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const engagement = dashboard.innovation_engagement_summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/governance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.governance}
        </Link>
        <Link href="/app/simulations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.simulationLab}
        </Link>
        <Link href="/app/organizational-memory-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.organizationalMemory}
        </Link>
        <Link href="/app/academy" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.academy}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        {(dashboard.innovation_integration_links ?? []).slice(0, 4).map((link: IntegrationLink) =>
          link.route ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
      </div>

      {dashboard.implementation_blueprint_phase38 ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.blueprintTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">
            {dashboard.implementation_blueprint_phase38.title ?? labels.blueprintPhase38}
            {dashboard.implementation_blueprint_phase38.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase38.engine_phase}`
              : ""}
          </p>
          {dashboard.innovation_lab_mission ? (
            <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.innovation_lab_mission}</p>
          ) : null}
          {dashboard.innovation_lab_philosophy ? (
            <p className="mt-2 text-sm text-violet-900">{dashboard.innovation_lab_philosophy}</p>
          ) : null}
          {dashboard.innovation_abos_principle ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.innovation_abos_principle}</p>
          ) : null}
          {dashboard.innovation_distinction_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.innovation_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.ideasTotal}: {engagement.ideas_total ?? 0}</span>
            <span>{labels.experimentsTotal}: {engagement.experiments_total ?? 0}</span>
            <span>{labels.experimentsActive}: {engagement.experiments_active ?? 0}</span>
            <span>{labels.pilotsTotal}: {engagement.pilots_total ?? 0}</span>
            <span>{labels.lessonsTotal}: {engagement.lessons_total ?? 0}</span>
            <span>{labels.featureFlagsControlled}: {engagement.feature_flags_controlled ?? 0}</span>
          </div>
        </section>
      ) : null}

      {dashboard.innovation_objectives && dashboard.innovation_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.innovationObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.innovation_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.idea_management?.principle ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.ideaManagement}</h3>
          <p className="mt-2 text-xs text-gray-600">{dashboard.idea_management.principle}</p>
          <CapabilityList items={dashboard.idea_management.capabilities} />
          {dashboard.idea_management.example_domains && dashboard.idea_management.example_domains.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboard.idea_management.example_domains.map((domain) => (
                <IdeaDomainCard key={domain.domain ?? domain.label} domain={domain} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.experimentation_principles?.principle ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-indigo-900">
          <h3 className="text-sm font-semibold">{labels.experimentationPrinciples}</h3>
          <p className="mt-2">{dashboard.experimentation_principles.principle}</p>
          <CapabilityList items={dashboard.experimentation_principles.required_elements} />
          {dashboard.experimentation_principles.boundary ? (
            <p className="mt-2 text-xs text-indigo-700">{dashboard.experimentation_principles.boundary}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_innovation_support && dashboard.companion_innovation_support.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionInnovationSupport}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.companion_innovation_support.map((example) => (
              <CompanionExampleCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.learning_capture?.principle ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.learningCapture}</h3>
          <p className="mt-2">{dashboard.learning_capture.principle}</p>
          <CapabilityList items={dashboard.learning_capture.capture_fields} />
          {dashboard.learning_capture.failure_framing ? (
            <p className="mt-2 text-xs font-medium text-violet-800">{dashboard.learning_capture.failure_framing}</p>
          ) : null}
          {dashboard.learning_capture.organizational_memory_route ? (
            <Link
              href={dashboard.learning_capture.organizational_memory_route}
              className="mt-2 inline-block text-xs underline"
            >
              {labels.openOrganizationalMemory}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.innovation_recognition_experiences?.experiences &&
      dashboard.innovation_recognition_experiences.experiences.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recognitionExperiences}</h3>
          {dashboard.innovation_recognition_experiences.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.innovation_recognition_experiences.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.innovation_recognition_experiences.experiences.map((experience) => (
              <RecognitionCard key={experience.key ?? experience.label} experience={experience} />
            ))}
          </div>
          {dashboard.innovation_recognition_experiences.gratitude_route ? (
            <Link
              href={dashboard.innovation_recognition_experiences.gratitude_route}
              className="mt-3 inline-block text-xs underline"
            >
              {labels.openGratitudeRecognition}
            </Link>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.innovation_success_criteria) && dashboard.innovation_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.innovation_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.innovation_self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.innovation_self_love_connection.principle}</p>
          {dashboard.innovation_self_love_connection.self_love_route ? (
            <Link
              href={dashboard.innovation_self_love_connection.self_love_route}
              className="mt-2 inline-block text-xs underline"
            >
              {labels.openSelfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.innovation_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.innovation_trust_connection.principle}</p>
          {dashboard.innovation_trust_connection.governance_route ? (
            <Link href={dashboard.innovation_trust_connection.governance_route} className="mt-2 inline-block text-xs underline">
              {labels.openGovernance}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.innovation_dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.dogfooding}</h3>
          <p className="mt-2 text-gray-600">{dashboard.innovation_dogfooding.principle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.innovation_dogfooding.aipify_group ? (
              <DogfoodingCard entry={dashboard.innovation_dogfooding.aipify_group} title={labels.aipifyGroup} />
            ) : null}
            {dashboard.innovation_dogfooding.unonight ? (
              <DogfoodingCard entry={dashboard.innovation_dogfooding.unonight} title={labels.unonightPilot} />
            ) : null}
          </div>
        </section>
      ) : null}

      {(dashboard.innovation_vision_phrases ?? []).length > 0 ? (
        <section className="rounded-lg border border-fuchsia-100 bg-fuchsia-50/30 p-4 text-sm text-fuchsia-900">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {dashboard.innovation_vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-fuchsia-200 bg-fuchsia-50/50 p-6">
        <h2 className="text-sm font-semibold text-fuchsia-900">{labels.innovationScore}</h2>
        <p className="mt-2 text-4xl font-bold text-fuchsia-800">
          {dashboard.innovation_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-fuchsia-700">
          {dashboard.active_experiments ?? 0} {labels.activeExperiments} · {dashboard.ideas_in_pipeline ?? 0}{" "}
          {labels.ideasInPipeline} · {dashboard.return_on_innovation ?? 0}% {labels.returnOnInnovation}
        </p>
        <p className="mt-2 text-sm text-fuchsia-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-fuchsia-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.experimentCompletion, value: `${dashboard.experiment_completion_pct ?? 0}%` },
          { label: labels.activeExperiments, value: dashboard.active_experiments ?? 0 },
          { label: labels.ideasInPipeline, value: dashboard.ideas_in_pipeline ?? 0 },
          { label: labels.returnOnInnovation, value: `${dashboard.return_on_innovation ?? 0}%` },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.lab_structure && dashboard.lab_structure.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.labStructure}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {dashboard.lab_structure.map((area) => (
              <article key={area.area} className="rounded-lg border border-fuchsia-100 bg-fuchsia-50 p-3">
                <p className="text-sm font-medium text-fuchsia-900">{area.label}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.ideaPipeline}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.ideas.map((idea) => (
            <article key={idea.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(idea.status)}`}>
                  {idea.status?.replace(/_/g, " ")}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${riskClass(idea.risk_level)}`}>
                  {idea.risk_level} {labels.risk}
                </span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{idea.title}</p>
              <p className="mt-1 text-xs text-gray-600">{idea.problem_statement}</p>
              <p className="mt-2 text-xs text-gray-500">
                {labels.value}: {idea.customer_value_score} · {labels.alignment}: {idea.strategic_alignment_score}
              </p>
              {(idea.status === "submitted" || idea.status === "under_review") ? (
                <button
                  type="button"
                  disabled={acting === `approve-${idea.id}`}
                  onClick={() => void approveIdea(idea.id)}
                  className="mt-3 rounded-md bg-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-fuchsia-700 disabled:opacity-50"
                >
                  {labels.approveIdea}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.experiments}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.experiments.map((exp) => (
            <article key={exp.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs capitalize text-gray-500">{exp.experiment_type?.replace(/_/g, " ")}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(exp.status)}`}>
                  {exp.status}
                </span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{exp.title}</p>
              <p className="mt-1 text-xs text-gray-600">{exp.description}</p>
              <p className="mt-2 text-xs text-fuchsia-700 capitalize">
                {labels.stage}: {exp.stage?.replace(/_/g, " ")} · {exp.participant_count} {labels.participants}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-fuchsia-500" style={{ width: `${exp.progress_pct}%` }} />
              </div>
              {exp.status !== "completed" && exp.status !== "cancelled" ? (
                <button
                  type="button"
                  disabled={acting === `advance-${exp.id}`}
                  onClick={() => void advanceExperiment(exp.id)}
                  className="mt-3 rounded-md bg-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-fuchsia-700 disabled:opacity-50"
                >
                  {labels.advanceExperiment}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {dashboard.pilot_programs.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.pilotPrograms}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.pilot_programs.map((pilot) => (
              <article key={pilot.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-indigo-900">{pilot.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(pilot.status)}`}>
                    {pilot.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-indigo-800">{pilot.description}</p>
                <p className="mt-2 text-xs text-indigo-700">
                  {pilot.current_participants}/{pilot.max_participants} {labels.participants}
                </p>
                <p className="mt-1 text-xs text-indigo-600">{pilot.success_criteria}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.feature_flags.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.featureFlags}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.feature_flags.map((flag) => (
              <article key={flag.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{flag.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(flag.status)}`}>
                    {flag.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">{flag.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {flag.target_segment?.replace(/_/g, " ")} · {flag.exposure_pct}% {labels.exposure}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.scorecard ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.innovationScorecard}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: labels.experimentCompletion, value: `${dashboard.scorecard.experiment_completion_pct ?? 0}%` },
              { label: labels.satisfactionImpact, value: `${dashboard.scorecard.customer_satisfaction_impact ?? 0}%` },
              { label: labels.adoptionPotential, value: `${dashboard.scorecard.adoption_potential_pct ?? 0}%` },
              { label: labels.businessValue, value: dashboard.scorecard.business_value_score ?? 0 },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs text-emerald-700">{m.label}</p>
                <p className="text-lg font-semibold text-emerald-900">{m.value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.lessons_learned.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.lessonsLearned}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.lessons_learned.map((lesson) => (
              <li key={lesson.id} className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm">
                <span className="font-medium text-violet-900">{lesson.title}</span>
                <span className="ml-2 text-xs capitalize text-violet-700">{lesson.outcome_type}</span>
                <p className="mt-1 text-xs text-violet-800">{lesson.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.sandbox_capabilities && dashboard.sandbox_capabilities.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">{labels.sandboxEnvironment}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-700">
            {dashboard.sandbox_capabilities.map((cap) => (
              <li key={cap}>{cap}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.governance_controls && dashboard.governance_controls.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.governanceControls}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-amber-800">
            {dashboard.governance_controls.map((ctrl) => (
              <li key={ctrl}>{ctrl}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
