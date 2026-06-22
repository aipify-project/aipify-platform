/**
 * Frozen Companion user-message presentation invariants — platform-wide Core design rule.
 * @see CompanionUserMessageCard · CompanionChatMessageItem
 */

export const COMPANION_USER_MESSAGE_PRESENTATION = "card" as const;

export const COMPANION_USER_MESSAGE_IDENTITY_ICON = "speech_bubble" as const;

export const COMPANION_USER_MESSAGE_FEEDBACK_CONTROLS = "none" as const;

export const COMPANION_ASSISTANT_FEEDBACK_CONTROLS = "allowed" as const;

export type CompanionUserMessagePresentation = typeof COMPANION_USER_MESSAGE_PRESENTATION;

export type CompanionUserMessageIdentityIcon = typeof COMPANION_USER_MESSAGE_IDENTITY_ICON;

export type CompanionUserMessageFeedbackControls = typeof COMPANION_USER_MESSAGE_FEEDBACK_CONTROLS;

export type CompanionAssistantFeedbackControls = typeof COMPANION_ASSISTANT_FEEDBACK_CONTROLS;

/** Shared feature flag key — opt-in per surface or via env; default off in production. */
export const COMPANION_USER_MESSAGE_CARD_V1_FLAG = "companionUserMessageCardV1" as const;

export type CompanionUserMessageCardV1Flag = typeof COMPANION_USER_MESSAGE_CARD_V1_FLAG;

/** Env gate for central rollout — set NEXT_PUBLIC_COMPANION_USER_MESSAGE_CARD_V1=true to enable globally. */
export const COMPANION_USER_MESSAGE_CARD_V1_ENV_KEY = "NEXT_PUBLIC_COMPANION_USER_MESSAGE_CARD_V1" as const;

export const COMPANION_USER_MESSAGE_CARD_FALLBACK_LABELS = {
  ariaUserMessage: "Your message",
  ariaUserMessageIdentity: "Your question",
} as const;

/** Companion chat surfaces that inherit the shared message presentation components. */
export const COMPANION_MESSAGE_SURFACE_PATHS = [
  "components/app/companion-experience/CompanionChat.tsx",
] as const;

/** Surfaces that consume CompanionChat and inherit message presentation without local overrides. */
export const COMPANION_MESSAGE_CONSUMER_PATHS = [
  "components/app/companion-experience/CompanionPanel.tsx",
] as const;

export type CompanionUserMessageFeatureOverrides = Partial<
  Record<CompanionUserMessageCardV1Flag, boolean>
>;

/** Returns true when the frozen user-message card variant should render. Default: false. */
export function isCompanionUserMessageCardV1Enabled(
  overrides?: CompanionUserMessageFeatureOverrides,
): boolean {
  if (overrides && COMPANION_USER_MESSAGE_CARD_V1_FLAG in overrides) {
    return Boolean(overrides[COMPANION_USER_MESSAGE_CARD_V1_FLAG]);
  }
  return process.env[COMPANION_USER_MESSAGE_CARD_V1_ENV_KEY] === "true";
}
