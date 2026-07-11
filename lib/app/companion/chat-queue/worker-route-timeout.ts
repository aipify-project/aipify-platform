import type { CompanionTurnRoute } from "@/lib/companion-runtime/companion-turn-route";
import { isTrueCompanionSmalltalk } from "@/lib/companion-platform-knowledge/aipify-core-runtime";

export const COMPANION_TURN_TIMEOUT_LIGHTWEIGHT_MS = 8_000;
export const COMPANION_TURN_TIMEOUT_FOUNDATION_MS = 15_000;
export const COMPANION_TURN_TIMEOUT_EXACT_SOURCE_MS = 30_000;
export const COMPANION_TURN_TIMEOUT_FULL_MS = 60_000;

export type ResolveCompanionTurnTimeoutOptions = {
  /** When lightweight route runs Core bootstrap (not greeting/social smalltalk). */
  query?: string;
};

export function resolveCompanionTurnTimeoutMs(
  route: CompanionTurnRoute,
  options: ResolveCompanionTurnTimeoutOptions = {},
): number {
  if (
    route === "lightweight" &&
    options.query?.trim() &&
    !isTrueCompanionSmalltalk(options.query)
  ) {
    return COMPANION_TURN_TIMEOUT_FOUNDATION_MS;
  }

  switch (route) {
    case "lightweight":
      return COMPANION_TURN_TIMEOUT_LIGHTWEIGHT_MS;
    case "foundation":
      return COMPANION_TURN_TIMEOUT_FOUNDATION_MS;
    case "exact_source":
      return COMPANION_TURN_TIMEOUT_EXACT_SOURCE_MS;
    default:
      return COMPANION_TURN_TIMEOUT_FULL_MS;
  }
}
