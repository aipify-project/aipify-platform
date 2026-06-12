import type { CompanionPresenceBundle } from "@/lib/presence/companion-presence";

export type CompanionPresenceEngineCard = {
  has_organization: boolean;
  current_state?: string;
  pending_approvals?: number;
  open_tasks?: number;
  privacy_note?: string;
};

export type { CompanionPresenceBundle };
