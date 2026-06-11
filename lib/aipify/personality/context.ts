import {
  HUMOR_APPROPRIATE_CONTEXTS,
  HUMOR_FORBIDDEN_CONTEXTS,
  type PersonalityMode,
} from "./types";

export function isHumorForbiddenContext(context: string): boolean {
  return (HUMOR_FORBIDDEN_CONTEXTS as readonly string[]).includes(context);
}

export function isHumorAppropriateContext(context: string): boolean {
  return (HUMOR_APPROPRIATE_CONTEXTS as readonly string[]).includes(context);
}

export function resolveEffectiveMode(
  mode: PersonalityMode,
  context: string,
  crisisActive: boolean
): { humorAllowed: boolean; mode: PersonalityMode } {
  if (crisisActive || isHumorForbiddenContext(context)) {
    return { humorAllowed: false, mode: "professional" };
  }
  if (mode === "professional") {
    return {
      humorAllowed: context === "celebration" || context === "milestone" || context === "positive_reinforcement",
      mode,
    };
  }
  return { humorAllowed: isHumorAppropriateContext(context), mode };
}

export const PERSONALITY_MODE_LABELS: Record<PersonalityMode, string> = {
  professional: "Professional",
  warm_professional: "Warm Professional",
  playful: "Playful",
};
