import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  COMPANION_CHAT_INITIAL_POSITION,
  COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR,
  COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL,
  COMPANION_CHAT_SCROLL_SURFACE_PATHS,
  applyCompanionChatInitialScroll,
} from "./companion-chat-scroll-policy";

const repoRoot = join(import.meta.dirname, "..", "..", "..");

assert.equal(COMPANION_CHAT_INITIAL_POSITION, "latest_message");
assert.equal(COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR, "instant");
assert.equal(COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL, "only_when_near_bottom");

function createScrollContainer(input: {
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

const initialContainer = createScrollContainer({
  scrollHeight: 3200,
  clientHeight: 640,
  scrollTop: 0,
});
applyCompanionChatInitialScroll({
  container: initialContainer,
  shouldRestore: false,
  restoreScrollTop: 0,
});
assert.equal(initialContainer.scrollTop, 3200);
assert.equal(initialContainer.scrollToCalls.length, 0);

const restoreContainer = createScrollContainer({
  scrollHeight: 3200,
  clientHeight: 640,
  scrollTop: 0,
});
applyCompanionChatInitialScroll({
  container: restoreContainer,
  shouldRestore: true,
  restoreScrollTop: 480,
});
assert.equal(restoreContainer.scrollTop, 480);
assert.equal(restoreContainer.scrollToCalls.length, 0);

for (const relativePath of COMPANION_CHAT_SCROLL_SURFACE_PATHS) {
  const source = readFileSync(join(repoRoot, relativePath), "utf8");

  assert.match(
    source,
    /useCompanionChatScroll/,
    `${relativePath} must use the shared useCompanionChatScroll hook`,
  );

  assert.match(
    source,
    /CompanionChatScrollViewport/,
    `${relativePath} must render CompanionChatScrollViewport`,
  );

  assert.doesNotMatch(
    source,
    /scrollIntoView\s*\(\s*\{\s*behavior:\s*["']smooth["']/,
    `${relativePath} must not smooth-scroll on initial open`,
  );

  assert.doesNotMatch(
    source,
    /from\s+["']@\/lib\/app\/companion\/chat-scroll["']/,
    `${relativePath} must not import chat-scroll directly — use companion-chat-scroll-policy or useCompanionChatScroll`,
  );
}

const forbiddenParallelPolicyPatterns = [
  "initialScrollAppliedRef",
  "pendingConversationScrollRef",
  "panelWasHiddenRef",
  "applyInitialChatScroll",
];

for (const relativePath of COMPANION_CHAT_SCROLL_SURFACE_PATHS) {
  const source = readFileSync(join(repoRoot, relativePath), "utf8");
  for (const pattern of forbiddenParallelPolicyPatterns) {
    assert.doesNotMatch(
      source,
      new RegExp(pattern),
      `${relativePath} must not duplicate scroll policy logic (${pattern})`,
    );
  }
}

console.log("companion-chat-scroll-invariant.test.ts: all assertions passed");
