/** Canonical Customer App route for the Aipify Companion experience. */
export const COMPANION_EXPERIENCE_ROUTE = "/app/companion";

/** Legacy Support Assistant route — redirects to companion. */
export const LEGACY_SUPPORT_ASSISTANT_ROUTE = "/app/support/assistant";

export const COMPANION_CONVERSATIONS_STORAGE_KEY = "aipify.companion.recentConversations.v1";

/** Tab-scoped Companion panel UI — open state, draft, active conversation, scroll. */
export const COMPANION_UI_SESSION_STORAGE_KEY = "aipify.companion.ui.v1";

export const COMPANION_QUICK_ACTION_IDS = [
  "orgStatus",
  "recentEvents",
  "integrations",
  "supportCases",
  "customerSuccess",
  "knowledgeFaq",
  "securityAccess",
  "whatNow",
] as const;

export type CompanionQuickActionId = (typeof COMPANION_QUICK_ACTION_IDS)[number];

export const COMPANION_CAPABILITY_IDS = [
  "guidance",
  "operations",
  "support",
  "integrations",
  "security",
  "decisions",
] as const;

export type CompanionCapabilityId = (typeof COMPANION_CAPABILITY_IDS)[number];
