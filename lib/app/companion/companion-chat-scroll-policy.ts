/**
 * Frozen Companion chat scroll UX invariants — platform-wide, non-overridable per surface.
 * @see useCompanionChatScroll · CompanionChatScrollViewport
 */

export const COMPANION_CHAT_INITIAL_POSITION = "latest_message" as const;

export const COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR = "instant" as const;

export const COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL = "only_when_near_bottom" as const;

export type CompanionChatInitialPosition = typeof COMPANION_CHAT_INITIAL_POSITION;

export type CompanionChatInitialScrollBehavior = typeof COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR;

export type CompanionChatNewMessageAutoscroll = typeof COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL;

export const COMPANION_CHAT_SCROLL_FALLBACK_LABELS = {
  scrollToLatest: "Go to latest message",
  scrollToLatestAria: "Go to latest message in this conversation",
} as const;

/** Companion chat surfaces that must inherit the frozen scroll policy. */
export const COMPANION_CHAT_SCROLL_SURFACE_PATHS = [
  "components/app/companion-experience/CompanionPanel.tsx",
  "components/app/desktop/DesktopChatPanel.tsx",
  "components/app/assistant/AssistantChatPanel.tsx",
] as const;

export {
  COMPANION_CHAT_NEAR_BOTTOM_THRESHOLD_PX,
  isCompanionChatNearBottom,
  prefersReducedMotion,
  resolveCompanionChatScrollBehavior,
  scrollCompanionChatToLatest,
  shouldAutoScrollCompanionChatOnUpdate,
  shouldRestoreCompanionChatScroll,
} from "./chat-scroll";

export type { CompanionChatScrollBehavior } from "./chat-scroll";

import { scrollCompanionChatToLatest } from "./chat-scroll";

/** Applies the frozen initial-open scroll policy — always instant, never smooth. */
export function applyCompanionChatInitialScroll(input: {
  container: HTMLElement;
  shouldRestore: boolean;
  restoreScrollTop: number;
}): void {
  if (input.shouldRestore) {
    input.container.scrollTop = input.restoreScrollTop;
    return;
  }
  scrollCompanionChatToLatest(input.container, COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR);
}
