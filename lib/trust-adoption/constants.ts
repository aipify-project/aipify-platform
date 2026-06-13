export const TRUST_ADOPTION_ROUTE = "/app/companion/trust-adoption";

export const ADOPTION_STAGES = ["curiosity", "confidence", "dependence", "companionship"] as const;

export const ADOPTION_STATES = [
  "exploring",
  "learning",
  "integrating",
  "relying",
  "advocating",
] as const;

export const RELIABILITY_LEVELS = [
  "building_trust",
  "reliable",
  "highly_reliable",
  "essential_companion",
] as const;

export const TRUST_ADOPTION_CORE_PRINCIPLE =
  "Trust is earned through repeated positive experiences. The goal is not usage — the goal is reliance.";

export const ADOPTION_PHILOSOPHY = {
  day1: "This is interesting.",
  week1: "This is useful.",
  week2: "I don't want to work without this.",
  month1: "How did we ever manage before Aipify?",
} as const;
