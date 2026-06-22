export const COMPANION_CHAT_NEAR_BOTTOM_THRESHOLD_PX = 120;

export type CompanionChatScrollBehavior = "instant" | "smooth";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function resolveCompanionChatScrollBehavior(
  preferred: CompanionChatScrollBehavior = "smooth",
): CompanionChatScrollBehavior {
  return prefersReducedMotion() ? "instant" : preferred;
}

export function isCompanionChatNearBottom(
  container: HTMLElement,
  threshold = COMPANION_CHAT_NEAR_BOTTOM_THRESHOLD_PX,
): boolean {
  const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
  return distanceFromBottom <= threshold;
}

export function scrollCompanionChatToLatest(
  container: HTMLElement,
  behavior: CompanionChatScrollBehavior = "instant",
): void {
  const resolved = resolveCompanionChatScrollBehavior(behavior);
  if (resolved === "instant") {
    container.scrollTop = container.scrollHeight;
    return;
  }
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
}

export function shouldRestoreCompanionChatScroll(input: {
  isPageLoad: boolean;
  panelWasHidden: boolean;
  sessionScrollTop: number;
  sessionConversationId: string | null;
  activeConversationId: string;
}): boolean {
  if (input.isPageLoad) return false;
  if (!input.panelWasHidden) return false;
  if (input.sessionScrollTop <= 0) return false;
  if (!input.sessionConversationId) return false;
  return input.sessionConversationId === input.activeConversationId;
}

export function shouldAutoScrollCompanionChatOnUpdate(input: {
  isNearBottom: boolean;
  userJustSentMessage: boolean;
}): boolean {
  return input.isNearBottom || input.userJustSentMessage;
}
