export const IMPLEMENTATION_BLUEPRINT_PHASE41_MISSION =
  "Help Sales Experts maintain momentum, celebrate achievements, and build sustainable businesses around Aipify.";

export const IMPLEMENTATION_BLUEPRINT_PHASE41_PHILOSOPHY =
  "Recognition strengthens motivation. Competition should inspire growth. Success should never come at the expense of integrity.";

export const IMPLEMENTATION_BLUEPRINT_PHASE41_ABOS_PRINCIPLE =
  "People thrive when their efforts are noticed. Recognition should reinforce values, not ego.";

export const IMPLEMENTATION_BLUEPRINT_PHASE41_MILESTONE_KEYS = [
  "first_customer",
  "five_active",
  "fifty_active",
  "hundred_supported",
  "first_renewal",
  "first_enterprise",
  "first_year",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE41_BELL_EXAMPLES = [
  "🔔 You have helped another organization begin their Aipify journey.",
  "🔔 This milestone reflects your dedication and professionalism.",
  "🔔 A meaningful milestone — celebrate progress, not comparison.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE41_ROSE_EXAMPLES = [
  "🌹 Thank you for helping our organization succeed.",
  "🌹 Your onboarding process made a meaningful difference.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE41_LEADERBOARD_CATEGORIES = [
  "most_improved",
  "customer_satisfaction",
  "knowledge_champion",
  "onboarding_excellence",
  "community_contributor",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE41_LEADERBOARD_AVOID = [
  "Aggressive competition",
  "Public shaming",
  "Vanity metrics without customer outcomes",
] as const;

export function getImplementationBlueprintPhase41Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE41_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE41_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE41_ABOS_PRINCIPLE,
    milestoneKeys: IMPLEMENTATION_BLUEPRINT_PHASE41_MILESTONE_KEYS,
    bellExamples: IMPLEMENTATION_BLUEPRINT_PHASE41_BELL_EXAMPLES,
    roseExamples: IMPLEMENTATION_BLUEPRINT_PHASE41_ROSE_EXAMPLES,
    leaderboardCategories: IMPLEMENTATION_BLUEPRINT_PHASE41_LEADERBOARD_CATEGORIES,
    leaderboardAvoid: IMPLEMENTATION_BLUEPRINT_PHASE41_LEADERBOARD_AVOID,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 41 — Sales Performance & Recognition Engine",
    gratitudeRecognitionRoute: "/app/gratitude-recognition-engine",
    gratitudeRecognitionPhase: "A.89",
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    distinctionNote:
      "Distinct from Gratitude & Recognition A.89 — Phase 41 is Sales Expert performance visibility within /app/sales-expert-engine. Never aggressive competition or public shaming.",
  };
}
