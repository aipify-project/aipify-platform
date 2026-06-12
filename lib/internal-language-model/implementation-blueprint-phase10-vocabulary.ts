export const IMPLEMENTATION_BLUEPRINT_PHASE10_MISSION =
  "Pause, reflect, consider consequences — preserve human autonomy.";

export const IMPLEMENTATION_BLUEPRINT_PHASE10_PHILOSOPHY =
  "Intelligence = options; wisdom = perspective. A short pause prevents regret.";

export const IMPLEMENTATION_BLUEPRINT_PHASE10_ABOS_PRINCIPLE =
  "Wisdom = thoughtful difficult conversations; sometimes waiting until tomorrow.";

export const IMPLEMENTATION_BLUEPRINT_PHASE10_VISION =
  "Communicate reflecting values, not temporary frustration — glad I did not send that email last night.";

export const IMPLEMENTATION_BLUEPRINT_PHASE10_INTERVENTION_PRINCIPLES = [
  "encourage reflection",
  "surface trade-offs",
  "offer lessons",
  "long-term thinking",
  "preserve autonomy",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE10_SCENARIO_CATEGORIES = [
  "communication",
  "decision",
  "operational",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE10_SLEEP_ON_IT_PRACTICES = [
  "save draft — do not send immediately",
  "revisit tomorrow with fresh perspective",
  "seek a second opinion when stakes are high",
  "pause before escalation — clarity over urgency",
] as const;

export function getImplementationBlueprintPhase10Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE10_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE10_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE10_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE10_VISION,
    interventionPrinciples: IMPLEMENTATION_BLUEPRINT_PHASE10_INTERVENTION_PRINCIPLES,
    scenarioCategories: IMPLEMENTATION_BLUEPRINT_PHASE10_SCENARIO_CATEGORIES,
    sleepOnItPractices: IMPLEMENTATION_BLUEPRINT_PHASE10_SLEEP_ON_IT_PRACTICES,
  };
}
