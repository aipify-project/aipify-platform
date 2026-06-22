import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  COMPANION_CHAT_INITIAL_POSITION,
  COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR,
  COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL,
  COMPANION_CHAT_SCROLL_HOOK_MODULE,
  COMPANION_CHAT_SCROLL_ROUTE_CONSUMERS,
  COMPANION_CHAT_SCROLL_SURFACE_PATHS,
  COMPANION_CHAT_SCROLL_VIEWPORT_MODULE,
  applyCompanionChatInitialScroll,
} from "./companion-chat-scroll-policy";

const repoRoot = join(import.meta.dirname, "..", "..", "..");

assert.equal(COMPANION_CHAT_INITIAL_POSITION, "latest_message");
assert.equal(COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR, "instant");
assert.equal(COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL, "only_when_near_bottom");

const SCROLL_LABEL_LOCALES = ["en", "no", "sv", "da", "es", "pl", "uk"] as const;

for (const locale of SCROLL_LABEL_LOCALES) {
  const file = join(repoRoot, "locales", locale, "customer-app", "companion.json");
  const parsed = JSON.parse(readFileSync(file, "utf8")) as {
    companionExperience?: Record<string, string>;
  };
  const experience = parsed.companionExperience;
  assert.ok(experience?.scrollToLatest, `missing scrollToLatest in ${locale}`);
  assert.ok(experience?.scrollToLatestAria, `missing scrollToLatestAria in ${locale}`);
  assert.notEqual(experience.scrollToLatest, "scrollToLatest");
  assert.notEqual(experience.scrollToLatestAria, "scrollToLatestAria");
  assert.doesNotMatch(experience.scrollToLatest, /customerApp\./);
  assert.doesNotMatch(experience.scrollToLatestAria, /customerApp\./);
}

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

const hookSource = readFileSync(join(repoRoot, COMPANION_CHAT_SCROLL_HOOK_MODULE), "utf8");
assert.match(
  hookSource,
  /COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR/,
  "shared hook must use frozen instant initial scroll behavior",
);
assert.match(
  hookSource,
  /shouldAutoScrollCompanionChatOnUpdate/,
  "shared hook must gate updates with near-bottom policy",
);
assert.match(
  hookSource,
  /shouldRestoreCompanionChatScroll/,
  "shared hook must restore scroll within same session/conversation",
);

const forbiddenParallelPolicyPatterns = [
  "initialScrollAppliedRef",
  "pendingConversationScrollRef",
  "panelWasHiddenRef",
  "applyInitialChatScroll",
];

for (const pattern of forbiddenParallelPolicyPatterns) {
  assert.match(
    hookSource,
    new RegExp(pattern),
    `${COMPANION_CHAT_SCROLL_HOOK_MODULE} must own scroll orchestration (${pattern})`,
  );
}

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

  for (const pattern of forbiddenParallelPolicyPatterns) {
    assert.doesNotMatch(
      source,
      new RegExp(pattern),
      `${relativePath} must not duplicate scroll policy logic (${pattern})`,
    );
  }
}

const companionPanelSource = readFileSync(
  join(repoRoot, "components/app/companion-experience/CompanionPanel.tsx"),
  "utf8",
);
assert.match(
  companionPanelSource,
  /prepareConversationChange/,
  "CompanionPanel must reset scroll when switching conversations",
);

const viewportSource = readFileSync(join(repoRoot, COMPANION_CHAT_SCROLL_VIEWPORT_MODULE), "utf8");
assert.match(viewportSource, /showJumpToLatest/);
assert.match(viewportSource, /scrollToLatestAriaLabel/);

for (const consumer of COMPANION_CHAT_SCROLL_ROUTE_CONSUMERS) {
  const source = readFileSync(join(repoRoot, consumer.path), "utf8");
  assert.match(
    source,
    new RegExp(consumer.panel),
    `${consumer.path} must render ${consumer.panel} for ${consumer.id}`,
  );
}

console.log("companion-chat-scroll-invariant.test.ts: all assertions passed");
