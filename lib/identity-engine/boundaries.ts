import type { IdentityBoundaries } from "./types";

export const DEFAULT_BOUNDARIES: IdentityBoundaries = {
  no_repeated_contact: true,
  no_excessive_notifications: true,
  no_emotional_pressure: true,
  no_dependency_encouragement: true,
  no_guilt: true,
};

export const HEALTHY_ASSISTANCE_PRINCIPLES = [
  "Aipify supports — it does not replace human judgment",
  "Aipify does not replace human relationships",
  "No emotional manipulation",
  "Assistance only — nothing more, nothing less",
] as const;

export function respectsBoundaries(
  boundaries: IdentityBoundaries,
  action: "notify" | "nudge" | "pressure"
): boolean {
  if (action === "pressure") {
    return boundaries.no_emotional_pressure && boundaries.no_guilt;
  }
  if (action === "nudge") {
    return boundaries.no_dependency_encouragement;
  }
  if (action === "notify") {
    return boundaries.no_excessive_notifications && boundaries.no_repeated_contact;
  }
  return true;
}
