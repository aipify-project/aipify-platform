/** Impact Engine — outcome-focused impact language (Phase A.85). */

export const IMPACT_ENGINE_MISSION =
  "Help organizations understand how Aipify contributes to healthier operations, relationships, and outcomes.";

export const IMPACT_ENGINE_ABOS_PRINCIPLE =
  "Improve lives, not busyness — measure value for people, teams, and organizations.";

export const IMPACT_ENGINE_PHILOSOPHY =
  "Activity ≠ progress. Impact means meaningful improvements — not busyness for its own sake.";

export const IMPACT_ENGINE_VISION = "We are doing better than we were before.";

export const IMPACT_ENGINE_DISTINCTION =
  "Distinct from Platform Anonymised Impact, Value Engine Phase 73, Value Realization A.48, and Innovation & Impact A.28 — outcome-focused impact orchestration across five dimensions.";

export const IMPACT_DIMENSIONS = [
  {
    key: "operational",
    label: "Operational impact",
    bullets: [
      "Smoother workflows and reduced operational friction",
      "Faster issue resolution and clearer handoffs",
      "Less time lost to context switching and repeat work",
    ],
  },
  {
    key: "customer",
    label: "Customer impact",
    bullets: [
      "Better customer experience through faster, clearer support",
      "Reduced repeat contacts and improved first-response quality",
      "More consistent communication across channels",
    ],
  },
  {
    key: "human",
    label: "Human impact",
    bullets: [
      "Sustainable workload distribution — not output-only pressure",
      "Wellbeing signals and recovery-friendly rhythms",
      "Teams feel supported, not surveilled or judged",
    ],
  },
  {
    key: "knowledge",
    label: "Knowledge impact",
    bullets: [
      "Knowledge Center articles preventing repeat requests",
      "Fewer knowledge gaps and faster self-service resolution",
      "Approved learning improving support quality over time",
    ],
  },
  {
    key: "strategic",
    label: "Strategic impact",
    bullets: [
      "Clearer priorities and aligned decision-making",
      "Progress toward stated goals — not busyness for its own sake",
      "Evidence that the organization is doing better than before",
    ],
  },
] as const;

export const IMPACT_REPORTING_EXAMPLES = [
  "Support response improvement % — customers wait less, teams handle volume sustainably",
  "Knowledge Center prevented requests — fewer tickets, faster answers",
  "Priority clarity — teams report clearer top-three focus",
  "Self Love workload distribution — recovery blocks honored, fewer burnout-risk spikes",
] as const;

export const IMPACT_CELEBRATION_EXAMPLES = [
  "Support response times improved — a quiet bell for meaningful progress.",
  "Knowledge Center prevented repeat requests this month — worth a bell.",
  "Workload distribution improved — sustainable rhythms, not just output.",
  "Priority clarity rose — teams know what matters most.",
  "We are doing better than we were before — progress noted.",
] as const;

export function getImpactEngineMission() {
  return IMPACT_ENGINE_MISSION;
}

export function getImpactEngineDistinction() {
  return IMPACT_ENGINE_DISTINCTION;
}

export function getImpactDimensions() {
  return IMPACT_DIMENSIONS;
}
