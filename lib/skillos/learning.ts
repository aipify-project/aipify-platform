import { DEFAULT_LEARNING_MODE, SKILL_LEARNING_MODES, type SkillLearningMode } from "./types";

export const LEARNING_MODE_LABELS: Record<SkillLearningMode, string> = {
  disabled: "Learning disabled",
  assisted: "Assisted learning",
  adaptive: "Adaptive learning",
};

export function isSkillLearningMode(value: string): value is SkillLearningMode {
  return (SKILL_LEARNING_MODES as readonly string[]).includes(value);
}

export function resolveLearningMode(value?: string): SkillLearningMode {
  if (value && isSkillLearningMode(value)) return value;
  return DEFAULT_LEARNING_MODE;
}
