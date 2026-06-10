import { SKILL_LIFECYCLE_STAGES } from "./types";

export const SKILL_LIFECYCLE_FLOW = [
  { from: "installed", to: "configured" },
  { from: "configured", to: "awaiting_approval" },
  { from: "awaiting_approval", to: "active" },
  { from: "active", to: "learning" },
  { from: "learning", to: "updated" },
  { from: "updated", to: "paused" },
  { from: "paused", to: "disabled" },
  { from: "disabled", to: "archived" },
] as const;

export function isValidLifecycleStage(stage: string): boolean {
  return (SKILL_LIFECYCLE_STAGES as readonly string[]).includes(stage);
}
