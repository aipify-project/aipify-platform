import assert from "node:assert/strict";
import {
  COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR,
  COMPANION_CHAT_INITIAL_POSITION,
  COMPANION_CHAT_NEAR_BOTTOM_THRESHOLD_PX,
  COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL,
  isCompanionChatNearBottom,
  resolveCompanionChatScrollBehavior,
  scrollCompanionChatToLatest,
  shouldAutoScrollCompanionChatOnUpdate,
  shouldRestoreCompanionChatScroll,
} from "./companion-chat-scroll-policy";

assert.equal(COMPANION_CHAT_INITIAL_POSITION, "latest_message");
assert.equal(COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR, "instant");
assert.equal(COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL, "only_when_near_bottom");

function createTrackableScrollContainer(input: {
  scrollHeight: number;
  clientHeight: number;
  scrollTop?: number;
}): HTMLElement & { scrollToCalls: Array<{ top: number; behavior?: string }> } {
  const element = {
    scrollHeight: input.scrollHeight,
    clientHeight: input.clientHeight,
    scrollTop: input.scrollTop ?? 0,
    scrollToCalls: [] as Array<{ top: number; behavior?: string }>,
    scrollTo(options: { top: number; behavior?: string }) {
      this.scrollToCalls.push(options);
      this.scrollTop = options.top;
    },
  };
  return element as unknown as HTMLElement & {
    scrollToCalls: Array<{ top: number; behavior?: string }>;
  };
}

function createScrollContainer(input: {
  scrollHeight: number;
  clientHeight: number;
  scrollTop?: number;
}): HTMLElement {
  return createTrackableScrollContainer(input);
}

assert.equal(
  shouldRestoreCompanionChatScroll({
    isPageLoad: true,
    panelWasHidden: true,
    sessionScrollTop: 400,
    sessionConversationId: "conv-1",
    activeConversationId: "conv-1",
  }),
  false,
);

assert.equal(
  shouldRestoreCompanionChatScroll({
    isPageLoad: false,
    panelWasHidden: true,
    sessionScrollTop: 400,
    sessionConversationId: "conv-1",
    activeConversationId: "conv-1",
  }),
  true,
);

assert.equal(
  shouldRestoreCompanionChatScroll({
    isPageLoad: false,
    panelWasHidden: true,
    sessionScrollTop: 400,
    sessionConversationId: "conv-1",
    activeConversationId: "conv-2",
  }),
  false,
);

assert.equal(
  shouldAutoScrollCompanionChatOnUpdate({
    isNearBottom: false,
    userJustSentMessage: true,
  }),
  true,
);

assert.equal(
  shouldAutoScrollCompanionChatOnUpdate({
    isNearBottom: true,
    userJustSentMessage: false,
  }),
  true,
);

assert.equal(
  shouldAutoScrollCompanionChatOnUpdate({
    isNearBottom: false,
    userJustSentMessage: false,
  }),
  false,
);

const nearBottom = createScrollContainer({
  scrollHeight: 1000,
  clientHeight: 400,
  scrollTop: 1000 - 400 - 50,
});
assert.equal(
  isCompanionChatNearBottom(nearBottom, COMPANION_CHAT_NEAR_BOTTOM_THRESHOLD_PX),
  true,
);

const farFromBottom = createScrollContainer({
  scrollHeight: 1000,
  clientHeight: 400,
  scrollTop: 100,
});
assert.equal(
  isCompanionChatNearBottom(farFromBottom, COMPANION_CHAT_NEAR_BOTTOM_THRESHOLD_PX),
  false,
);

const container = createTrackableScrollContainer({
  scrollHeight: 2400,
  clientHeight: 600,
  scrollTop: 0,
});
scrollCompanionChatToLatest(container, "instant");
assert.equal(container.scrollTop, 2400);
assert.equal(container.scrollToCalls.length, 0);

assert.equal(resolveCompanionChatScrollBehavior("smooth"), "smooth");
assert.equal(resolveCompanionChatScrollBehavior("instant"), "instant");

console.log("companion-chat-scroll.test.ts: all assertions passed");
