import type { CompanionPresenceBundle } from "@/lib/presence/companion-presence";
import type { CompanionPresenceEngineCard } from "./types";

export function parseCompanionPresenceBundle(
  raw: unknown
): CompanionPresenceBundle {
  if (!raw || typeof raw !== "object") {
    return { has_organization: false };
  }
  return raw as CompanionPresenceBundle;
}

export function toCompanionPresenceCard(
  bundle: CompanionPresenceBundle
): CompanionPresenceEngineCard {
  return {
    has_organization: bundle.has_organization,
    current_state: bundle.current_state,
    pending_approvals: bundle.counts?.pending_approvals ?? 0,
    open_tasks: bundle.counts?.open_tasks ?? 0,
    privacy_note: bundle.privacy_note,
  };
}
