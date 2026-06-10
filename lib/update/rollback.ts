import type { RollbackPlan } from "./types";

export function buildRollbackPlan(input: {
  previousVersion: string;
  rollbackAvailable?: boolean;
  rollbackSteps?: string[];
  rollbackDeadline?: string;
}): RollbackPlan {
  return {
    rollbackAvailable: input.rollbackAvailable ?? true,
    previousVersion: input.previousVersion,
    rollbackSteps: input.rollbackSteps ?? [
      "Stop update rollout for affected installations.",
      "Restore previous Aipify software version.",
      "Verify heartbeat and health scan.",
      "Notify customer and Platform Admin.",
    ],
    rollbackDeadline: input.rollbackDeadline,
  };
}

export function isRollbackExpired(deadline?: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
}
