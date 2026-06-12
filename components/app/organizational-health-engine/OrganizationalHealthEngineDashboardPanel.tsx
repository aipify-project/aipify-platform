"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalHealthEngineDashboard,
  type BlueprintObjective,
  type CompanionCheckIn,
  type EmployeeExperienceQuestion,
  type HealthObservation,
  type OrganizationalHealthEngineDashboard,
  type OrganizationalHealthIntervention,
  type OrganizationalHealthScore,
  type RecognitionPractice,
} from "@/lib/aipify/organizational-health-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function ObservationCard({ observation }: { observation: HealthObservation }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">
        {observation.emoji ? `${observation.emoji} ` : ""}
        {observation.scenario}
      </span>
      {observation.example ? <p className="mt-1 text-xs text-gray-600">{observation.example}</p> : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: { key?: string; label?: string; met?: boolean; note?: string | null };
  metLabel: string;
  pendingLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span className="text-gray-800">{criterion.label}</span>
      <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
        {criterion.met ? metLabel : pendingLabel}
      </span>
      {criterion.note ? <p className="w-full text-xs text-gray-500">{criterion.note}</p> : null}
    </div>
  );
}

function QuestionCard({ question }: { question: EmployeeExperienceQuestion }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">
        {question.emoji ? `${question.emoji} ` : ""}
        {question.question}
      </span>
      {question.description ? <p className="mt-1 text-xs text-gray-600">{question.description}</p> : null}
    </div>
  );
}

function CheckInCard({ checkIn }: { checkIn: CompanionCheckIn }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">
        {checkIn.emoji ? `${checkIn.emoji} ` : ""}
        {checkIn.scenario}
      </span>
      {checkIn.example ? <p className="mt-1 text-xs text-gray-600">{checkIn.example}</p> : null}
    </div>
  );
}

function RecognitionPracticeCard({ practice }: { practice: RecognitionPractice | string }) {
  if (typeof practice === "string") {
    return (
      <div className="rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2 text-sm text-amber-900">
        {practice}
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2 text-sm text-amber-900">
      <span className="font-medium">
        {practice.emoji ? `${practice.emoji} ` : ""}
        {practice.label}
      </span>
      {practice.description ? <p className="mt-1 text-xs text-amber-800">{practice.description}</p> : null}
    </div>
  );
}

export function OrganizationalHealthEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalHealthEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/dashboard");
    if (res.ok) setDashboard(parseOrganizationalHealthEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const measureHealth = async () => {
    setMeasuring(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/measure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.measureFailed);
    } else {
      await load();
    }
    setMeasuring(false);
  };

  const generateRecommendations = async () => {
    setGenerating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_recommendations" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.generateFailed);
    } else {
      await load();
    }
    setGenerating(false);
  };

  const approveIntervention = async (intervention: OrganizationalHealthIntervention) => {
    if (!intervention.id) return;
    setApproving(intervention.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intervention_id: intervention.id, capture_memory: true }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.approveFailed);
    } else {
      await load();
    }
    setApproving(null);
  };

  const exportReport = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/export", {
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

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const engagement = dashboard.engagement_summary;
  const blueprintLinks = dashboard.blueprint_integration_links ?? [];
  const wellbeingLinks = dashboard.wellbeing_integration_links ?? [];
  const wellbeingEngagement = dashboard.wellbeing_engagement_summary;
  const wellbeingBlueprint = dashboard.employee_experience_wellbeing_blueprint;
  const experienceQuestions = dashboard.employee_experience_questions?.questions ?? wellbeingBlueprint?.employee_experience_questions?.questions;
  const wellbeingObservations = dashboard.wellbeing_observations ?? wellbeingBlueprint?.wellbeing_observations;
  const recognitionPractices = dashboard.wellbeing_recognition_practices ?? wellbeingBlueprint?.recognition_practices;
  const companionCheckIns = dashboard.companion_check_ins ?? wellbeingBlueprint?.companion_check_ins;
  const wellbeingSelfLove = dashboard.wellbeing_self_love_connection ?? wellbeingBlueprint?.self_love_connection;
  const wellbeingLeadership = dashboard.wellbeing_leadership_connection ?? wellbeingBlueprint?.leadership_connection;
  const employeeJourney = dashboard.employee_journey_connection ?? wellbeingBlueprint?.employee_journey_connection;
  const wellbeingTrust = dashboard.wellbeing_trust_connection ?? wellbeingBlueprint?.trust_connection;
  const wellbeingPrivacy = dashboard.wellbeing_privacy_principles ?? wellbeingBlueprint?.privacy_principles;
  const wellbeingDogfooding = dashboard.wellbeing_dogfooding ?? wellbeingBlueprint?.dogfooding;
  const wellbeingSuccessCriteria = dashboard.wellbeing_success_criteria ?? wellbeingBlueprint?.success_criteria;
  const wellbeingObjectives = dashboard.employee_experience_wellbeing_objectives ?? wellbeingBlueprint?.objectives;

  return (
    <div className="space-y-6">
      {blueprintLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {blueprintLinks.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-teal-700">{labels.distinctionNote}</p>
        {dashboard.implementation_blueprint_phase61?.phase ? (
          <p className="mt-1 text-xs text-teal-600">
            {dashboard.implementation_blueprint_phase61.phase}
            {dashboard.implementation_blueprint_phase61.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase61.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.blueprint_mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.blueprint_mission}</p>
        ) : null}
        {dashboard.blueprint_philosophy ? (
          <p className="mt-2 text-sm text-teal-900">{dashboard.blueprint_philosophy}</p>
        ) : null}
        {dashboard.blueprint_abos_principle ? (
          <p className="mt-2 text-xs text-teal-800">{dashboard.blueprint_abos_principle}</p>
        ) : null}
        {dashboard.blueprint_distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">{dashboard.blueprint_distinction_note}</p>
        ) : null}
        {dashboard.organizational_health_note ? (
          <p className="mt-2 text-xs text-teal-800">{dashboard.organizational_health_note}</p>
        ) : null}
      </section>

      {dashboard.blueprint_objectives && dashboard.blueprint_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.blueprint_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.health_domains && dashboard.health_domains.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.healthDomains}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.health_domains.map((domain) => (
              <ObjectiveCard key={domain.key ?? domain.label} objective={domain} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.health_observations && dashboard.health_observations.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.healthObservations}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.health_observations.map((observation) => (
              <ObservationCard key={observation.key ?? observation.scenario} observation={observation} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.workload_awareness?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.workloadAwareness}</h3>
          <p className="mt-2 text-gray-700">{dashboard.workload_awareness.principle}</p>
          {dashboard.workload_awareness.signals && dashboard.workload_awareness.signals.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.workload_awareness.signals.map((signal) => (
                <ObjectiveCard key={signal.key ?? signal.label} objective={signal} />
              ))}
            </div>
          ) : null}
          {dashboard.workload_awareness.sustainability_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.workload_awareness.sustainability_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.recognition_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.recognitionConnection}</h3>
          <p className="mt-2">{dashboard.recognition_connection.principle}</p>
          {dashboard.recognition_connection.practices && dashboard.recognition_connection.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.recognition_connection.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.practices && dashboard.self_love_connection.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_connection.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.leadership_insights?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.leadershipInsights}</h3>
          <p className="mt-2 text-gray-700">{dashboard.leadership_insights.principle}</p>
          {dashboard.leadership_insights.insight_types && dashboard.leadership_insights.insight_types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {dashboard.leadership_insights.insight_types.map((insight) => (
                <ObjectiveCard key={insight.key ?? insight.label} objective={insight} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.trust_connection.principle}</p>
          {dashboard.trust_connection.users_should_see &&
          dashboard.trust_connection.users_should_see.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.trust_connection.users_should_see.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.privacy_principles?.principle ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.privacyPrinciples}</h3>
          <p className="mt-2">{dashboard.privacy_principles.principle}</p>
          {dashboard.privacy_principles.must_avoid && dashboard.privacy_principles.must_avoid.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.privacy_principles.must_avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.dogfooding}</h3>
          <p className="mt-2 text-gray-700">{dashboard.dogfooding.principle}</p>
        </section>
      ) : null}

      {wellbeingLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {wellbeingLinks.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      {(dashboard.employee_experience_wellbeing_mission || wellbeingBlueprint?.mission) ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
          <h2 className="text-sm font-semibold">{labels.employeeWellbeingTitle}</h2>
          {dashboard.implementation_blueprint_phase96?.phase ? (
            <p className="mt-1 text-xs text-rose-600">
              {dashboard.implementation_blueprint_phase96.phase}
              {dashboard.implementation_blueprint_phase96.engine_phase
                ? ` · ${dashboard.implementation_blueprint_phase96.engine_phase}`
                : ""}
            </p>
          ) : null}
          <p className="mt-2 text-sm font-medium text-rose-900">
            {dashboard.employee_experience_wellbeing_mission ?? wellbeingBlueprint?.mission}
          </p>
          {(dashboard.employee_experience_wellbeing_philosophy || wellbeingBlueprint?.philosophy) ? (
            <p className="mt-2 text-sm text-rose-900">
              {dashboard.employee_experience_wellbeing_philosophy ?? wellbeingBlueprint?.philosophy}
            </p>
          ) : null}
          {(dashboard.employee_experience_wellbeing_abos_principle || wellbeingBlueprint?.abos_principle) ? (
            <p className="mt-2 text-xs text-rose-800">
              {dashboard.employee_experience_wellbeing_abos_principle ?? wellbeingBlueprint?.abos_principle}
            </p>
          ) : null}
          {(dashboard.employee_experience_wellbeing_distinction_note || wellbeingBlueprint?.distinction_note) ? (
            <p className="mt-2 text-xs text-rose-700">
              {dashboard.employee_experience_wellbeing_distinction_note ?? wellbeingBlueprint?.distinction_note}
            </p>
          ) : null}
          {(dashboard.employee_experience_wellbeing_engine_note) ? (
            <p className="mt-2 text-xs text-rose-800">{dashboard.employee_experience_wellbeing_engine_note}</p>
          ) : null}
          {(dashboard.employee_experience_wellbeing_vision || wellbeingBlueprint?.vision) ? (
            <p className="mt-2 text-sm italic text-rose-900">
              {dashboard.employee_experience_wellbeing_vision ?? wellbeingBlueprint?.vision}
            </p>
          ) : null}
        </section>
      ) : null}

      {wellbeingObjectives && wellbeingObjectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.employeeWellbeingObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {wellbeingObjectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {experienceQuestions && experienceQuestions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.employeeExperienceQuestions}</h3>
          {dashboard.employee_experience_questions?.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.employee_experience_questions.principle}</p>
          ) : null}
          <div className="mt-3 space-y-3">
            {experienceQuestions.map((question) => (
              <QuestionCard key={question.key ?? question.question} question={question} />
            ))}
          </div>
        </section>
      ) : null}

      {wellbeingObservations && wellbeingObservations.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.wellbeingObservations}</h3>
          <div className="mt-3 space-y-3">
            {wellbeingObservations.map((observation) => (
              <ObservationCard key={observation.key ?? observation.scenario} observation={observation} />
            ))}
          </div>
        </section>
      ) : null}

      {recognitionPractices?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.wellbeingRecognitionPractices}</h3>
          <p className="mt-2">{recognitionPractices.principle}</p>
          {recognitionPractices.practices && recognitionPractices.practices.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {recognitionPractices.practices.map((practice) => (
                <RecognitionPracticeCard
                  key={typeof practice === "string" ? practice : practice.key ?? practice.label}
                  practice={practice}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {companionCheckIns?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.companionCheckIns}</h3>
          <p className="mt-2">{companionCheckIns.principle}</p>
          {companionCheckIns.companion_name ? (
            <p className="mt-1 text-xs text-rose-700">
              {companionCheckIns.companion_name}
              {companionCheckIns.not_label ? ` — ${labels.notAiWellnessBot}` : ""}
            </p>
          ) : null}
          {companionCheckIns.check_ins && companionCheckIns.check_ins.length > 0 ? (
            <div className="mt-3 space-y-3">
              {companionCheckIns.check_ins.map((checkIn) => (
                <CheckInCard key={checkIn.key ?? checkIn.scenario} checkIn={checkIn} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {wellbeingSelfLove?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.wellbeingSelfLoveConnection}</h3>
          <p className="mt-2">{wellbeingSelfLove.principle}</p>
          {wellbeingSelfLove.quotes && wellbeingSelfLove.quotes.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs italic">
              {wellbeingSelfLove.quotes.map((quote) => (
                <li key={quote}>{quote}</li>
              ))}
            </ul>
          ) : null}
          {wellbeingSelfLove.practices && wellbeingSelfLove.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {wellbeingSelfLove.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {wellbeingLeadership?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.wellbeingLeadershipConnection}</h3>
          <p className="mt-2 text-gray-700">{wellbeingLeadership.principle}</p>
          {wellbeingLeadership.leadership_practices && wellbeingLeadership.leadership_practices.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {wellbeingLeadership.leadership_practices.map((practice) => (
                <ObjectiveCard key={practice.key ?? practice.label} objective={practice} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {employeeJourney?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.employeeJourneyConnection}</h3>
          <p className="mt-2 text-gray-700">{employeeJourney.principle}</p>
          {employeeJourney.journey_stages && employeeJourney.journey_stages.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {employeeJourney.journey_stages.map((stage) => (
                <div key={stage.key ?? stage.label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <span className="font-medium">{stage.label}</span>
                  {stage.description ? <p className="mt-1 text-xs text-gray-600">{stage.description}</p> : null}
                  {stage.route ? (
                    <Link href={stage.route} className="mt-1 inline-block text-xs text-teal-700 underline">
                      {stage.route}
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {wellbeingTrust?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.wellbeingTrustConnection}</h3>
          <p className="mt-2 text-gray-700">{wellbeingTrust.principle}</p>
          {wellbeingTrust.employees_should_know && wellbeingTrust.employees_should_know.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {wellbeingTrust.employees_should_know.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {wellbeingPrivacy?.principle ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.wellbeingPrivacyPrinciples}</h3>
          <p className="mt-2">{wellbeingPrivacy.principle}</p>
          {wellbeingPrivacy.must_avoid && wellbeingPrivacy.must_avoid.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {wellbeingPrivacy.must_avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {wellbeingDogfooding?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.wellbeingDogfooding}</h3>
          <p className="mt-2 text-gray-700">{wellbeingDogfooding.principle}</p>
        </section>
      ) : null}

      {wellbeingEngagement ? (
        <section className="rounded-lg border border-rose-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.wellbeingEngagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.experienceQuestionsDocumented}: {wellbeingEngagement.experience_questions_documented ?? 0}</span>
            <span>{labels.wellbeingObservationsDocumented}: {wellbeingEngagement.wellbeing_observations_documented ?? 0}</span>
            <span>{labels.companionCheckInsDocumented}: {wellbeingEngagement.companion_check_ins_documented ?? 0}</span>
            <span>{labels.overallScore}: {wellbeingEngagement.overall_score ?? 0}</span>
            <span>{labels.pendingInterventions}: {wellbeingEngagement.pending_interventions ?? 0}</span>
          </div>
        </section>
      ) : null}

      {wellbeingSuccessCriteria && wellbeingSuccessCriteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.wellbeingSuccessCriteria}</h3>
          <div className="mt-3 space-y-2">
            {wellbeingSuccessCriteria.map((criterion) => (
              <SuccessCriterionRow
                key={criterion.key ?? criterion.label}
                criterion={criterion}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.categoriesMeasured}: {engagement.categories_measured ?? 0}</span>
            <span>{labels.healthyCategories}: {engagement.healthy_categories ?? 0}</span>
            <span>{labels.attentionRequired}: {engagement.attention_required_categories ?? 0}</span>
            <span>{labels.overallScore}: {engagement.overall_score ?? 0}</span>
            <span>{labels.pendingInterventions}: {engagement.pending_interventions ?? 0}</span>
          </div>
        </section>
      ) : null}

      {dashboard.success_criteria && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.success_criteria.map((criterion) => (
              <SuccessCriterionRow
                key={criterion.key ?? criterion.label}
                criterion={criterion}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
          disabled={measuring}
          onClick={() => void measureHealth()}
        >
          {measuring ? labels.measuring : labels.measureHealth}
        </button>
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
          disabled={generating}
          onClick={() => void generateRecommendations()}
        >
          {generating ? labels.generating : labels.generateRecommendations}
        </button>
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportReport()}
        >
          {exporting ? labels.exporting : labels.exportReport}
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.executive_summary && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveSummary}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.executive_summary, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.scores && dashboard.scores.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.scores}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.scores.map((score: OrganizationalHealthScore) => (
              <div key={score.id ?? score.health_category} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">{score.health_category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-teal-700">{score.health_score}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{score.health_status}</span>
                  </div>
                </div>
                {score.indicators && (
                  <pre className="mt-2 overflow-auto text-xs text-gray-600">
                    {JSON.stringify(score.indicators, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.interventions && dashboard.interventions.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.interventions}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.interventions.map((intervention) => (
              <div key={intervention.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase text-gray-500">{intervention.category}</span>
                    <p className="mt-1 text-gray-800">{intervention.recommendation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{intervention.status}</span>
                    {intervention.status === "pending" && (
                      <button
                        type="button"
                        className="rounded border border-green-300 px-2 py-0.5 text-xs text-green-700 disabled:opacity-50"
                        disabled={approving === intervention.id}
                        onClick={() => void approveIntervention(intervention)}
                      >
                        {approving === intervention.id ? labels.approving : labels.approveIntervention}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
