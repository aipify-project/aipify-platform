/**
 * Frozen Companion chat scroll UX invariants — platform-wide, non-overridable per surface.
 *
 * Layering (Companion Core — not surface-specific):
 * - `companion-chat-scroll-policy.ts` — frozen invariants + public API for surfaces
 * - `chat-scroll.ts` — shared scroll primitives (near-bottom, restore, reduced motion)
 * - `use-companion-chat-scroll.ts` — React hook orchestrating open/update/restore behavior
 * - `CompanionChatScrollViewport.tsx` — shared viewport + go-to-latest control
 *
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

/** Shared scroll primitive module — surfaces must import via this policy, not chat-scroll directly. */
export const COMPANION_CHAT_SCROLL_IMPLEMENTATION_MODULE = "lib/app/companion/chat-scroll.ts" as const;

export const COMPANION_CHAT_SCROLL_HOOK_MODULE = "lib/app/companion/use-companion-chat-scroll.ts" as const;

export const COMPANION_CHAT_SCROLL_VIEWPORT_MODULE =
  "components/app/companion-experience/CompanionChatScrollViewport.tsx" as const;

/** Companion chat surfaces that must inherit the frozen scroll policy. */
export const COMPANION_CHAT_SCROLL_SURFACE_PATHS = [
  "components/app/companion-experience/CompanionPanel.tsx",
  "components/app/desktop/DesktopChatPanel.tsx",
  "components/app/assistant/AssistantChatPanel.tsx",
] as const;

/**
 * Route consumers that inherit scroll policy through wired chat panels.
 * Report only surfaces that exist and use the shared hook/viewport.
 */
export const COMPANION_CHAT_SCROLL_ROUTE_CONSUMERS = [
  {
    id: "app_companion_panel",
    route: "/app/* (CompanionShell drawer)",
    panel: "CompanionPanel",
    path: "components/app/companion-experience/CompanionDrawer.tsx",
  },
  {
    id: "full_companion_page",
    route: "/app/companion",
    panel: "CompanionPanel",
    path: "app/app/companion/page.tsx",
  },
  {
    id: "desktop_companion",
    route: "/app/desktop/companion",
    panel: "DesktopChatPanel",
    path: "app/app/desktop/companion/page.tsx",
  },
  {
    id: "assistant_chat",
    route: "/app/assistant",
    panel: "AssistantChatPanel",
    path: "app/app/assistant/page.tsx",
  },
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
