export const LEARNING_MODES = ["disabled", "assisted", "adaptive"] as const;

export type LearningMode = (typeof LEARNING_MODES)[number];

export const DEFAULT_LEARNING_MODE: LearningMode = "assisted";

export function isLearningMode(value: string): value is LearningMode {
  return (LEARNING_MODES as readonly string[]).includes(value);
}

export function resolveLearningMode(value?: string | null): LearningMode {
  if (value && isLearningMode(value)) return value;
  return DEFAULT_LEARNING_MODE;
}
