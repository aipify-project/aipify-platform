import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  shouldAutoScrollCompanionChatOnUpdate,
  isCompanionChatNearBottom,
} from "@/lib/app/companion/companion-chat-scroll-policy";
import {
  assertWebsiteCompanionAskBodyShape,
  buildWebsiteCompanionAskBody,
  buildWebsiteCompanionRecentContext,
  filterWebsiteCompanionUiActions,
  formatWebsiteCompanionCharactersRemaining,
  mapWebsiteCompanionApiResponse,
  shouldAllowWebsiteCompanionSend,
  validateWebsiteCompanionQuestion,
  WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH,
  type WebsiteCompanionChatMessage,
} from "@/lib/marketing/website-companion-chat";
import type { PublicCompanionAskResponse } from "@/lib/marketing/public-companion-ask";
import { parseWebsiteCompanionLabels } from "@/lib/marketing/governance/labels";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

const emptyValidation = validateWebsiteCompanionQuestion("   ");
assert.equal(emptyValidation.valid, false);
if (!emptyValidation.valid) {
  assert.equal(emptyValidation.reason, "empty");
}
const tooLongValidation = validateWebsiteCompanionQuestion(
  "x".repeat(WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH + 1),
);
assert.equal(tooLongValidation.valid, false);
if (!tooLongValidation.valid) {
  assert.equal(tooLongValidation.reason, "too_long");
}
assert.equal(validateWebsiteCompanionQuestion("Hva koster Aipify?").valid, true);

assert.equal(shouldAllowWebsiteCompanionSend({ question: "Hei", sending: false }), true);
assert.equal(shouldAllowWebsiteCompanionSend({ question: "Hei", sending: true }), false);
assert.equal(shouldAllowWebsiteCompanionSend({ question: "   ", sending: false }), false);

const history: WebsiteCompanionChatMessage[] = [
  { id: "u1", role: "user", text: "Hva koster Aipify?" },
  {
    id: "a1",
    role: "assistant",
    directAnswer: "Sammenlign planer.",
    explanation: "Oppgraderinger gir mer kapasitet.",
    steps: ["Åpne Fakturering."],
    sources: ["Oppgraderinger"],
    actions: [],
  },
];

const body = buildWebsiteCompanionAskBody({
  question: "Kan jeg oppgradere?",
  locale: "no",
  messages: history,
});
assert.equal(body.question, "Kan jeg oppgradere?");
assert.equal(body.locale, "no");
assert.equal(body.recentContext?.length, 2);
assert.deepEqual(Object.keys(body).sort(), ["locale", "question", "recentContext"]);
assertWebsiteCompanionAskBodyShape(body);
assert.throws(() => assertWebsiteCompanionAskBodyShape({ ...body, tenantId: "x" } as never));

const longContextMessages: WebsiteCompanionChatMessage[] = Array.from({ length: 8 }, (_, index) => ({
  id: `u-${index}`,
  role: "user" as const,
  text: `Melding ${index}`,
}));
const context = buildWebsiteCompanionRecentContext(longContextMessages);
assert.equal(context.length, 6);
assert.equal(context[0]?.text, "Melding 2");
assert.equal(context[5]?.text, "Melding 7");

const longText = "a".repeat(600);
const longContext = buildWebsiteCompanionRecentContext([
  { id: "u-long", role: "user", text: longText },
]);
assert.equal(longContext[0]?.text.length, 500);

const response: PublicCompanionAskResponse = {
  locale: "no",
  answer: {
    directAnswer: "Svar.",
    explanation: "Forklaring.",
    steps: ["Steg 1", "  ", "Steg 2"],
  },
  actions: [
    { label: "Trygg", href: "/app/companion", variant: "primary" },
    { label: "Farlig", href: "https://evil.example", variant: "secondary" },
    { label: "Script", href: "javascript:alert(1)", variant: "secondary" },
  ],
  sources: [{ title: "Kunnskapssenter", route: "knowledgeCenter" }],
  confidence: { level: "medium", score: 0.65 },
  supportEscalation: { offered: false, reason: null },
};

const mapped = mapWebsiteCompanionApiResponse(response);
assert.equal(mapped.directAnswer, "Svar.");
assert.equal(mapped.explanation, "Forklaring.");
assert.deepEqual(mapped.steps, ["Steg 1", "Steg 2"]);
assert.deepEqual(mapped.sources, ["Kunnskapssenter"]);
assert.equal(mapped.actions.length, 1);
assert.equal(mapped.actions[0]?.href, "/app/companion");

assert.deepEqual(
  filterWebsiteCompanionUiActions([
    { label: "OK", href: "/app/support/knowledge" },
    { label: "Bad", href: "/pricing" },
    { label: "External", href: "https://example.com" },
    { label: "Script", href: "javascript:alert(1)" },
  ]),
  [{ label: "OK", href: "/app/support/knowledge" }],
);

assert.equal(
  formatWebsiteCompanionCharactersRemaining("{count} tegn igjen", 42),
  "42 tegn igjen",
);

assert.equal(
  shouldAutoScrollCompanionChatOnUpdate({ isNearBottom: false, userJustSentMessage: false }),
  false,
);
assert.equal(
  shouldAutoScrollCompanionChatOnUpdate({ isNearBottom: true, userJustSentMessage: false }),
  true,
);

const scrollContainer = {
  scrollHeight: 1000,
  clientHeight: 400,
  scrollTop: 560,
} as HTMLElement;
assert.equal(isCompanionChatNearBottom(scrollContainer), true);

const marketingNo = JSON.parse(
  fs.readFileSync(path.join(root, "locales/no/marketing.json"), "utf8"),
) as Record<string, unknown>;
const labels = parseWebsiteCompanionLabels(marketingNo);
assert.ok(labels.chat.welcome.includes("Aipify"));
assert.ok(labels.chat.inputPlaceholder.length > 0);
assert.ok(labels.chat.send.length > 0);

const componentSource = fs.readFileSync(
  path.join(root, "components/marketing/WebsiteCompanionAssistant.tsx"),
  "utf8",
);
assert.match(componentSource, /locale/);
assert.match(componentSource, /\/api\/marketing\/companion\/ask/);
assert.doesNotMatch(componentSource, /dangerouslySetInnerHTML/);
assert.doesNotMatch(componentSource, /Oppgrader abonnementet|Kunnskapssenter/);
assert.match(componentSource, /chat\.welcome/);
assert.match(componentSource, /chat\.genericError/);

const layoutSource = fs.readFileSync(path.join(root, "app/(marketing)/layout.tsx"), "utf8");
assert.match(layoutSource, /<WebsiteCompanionAssistant \{\.\.\.companion\} locale=\{locale\} \/>/);

const errorHistory: WebsiteCompanionChatMessage[] = [
  { id: "u1", role: "user", text: "Spørsmål" },
  { id: "e1", role: "assistant", failed: true, retryQuestion: "Spørsmål" },
];
const retryBody = buildWebsiteCompanionAskBody({
  question: "Spørsmål",
  locale: "no",
  messages: errorHistory.filter((message) => !("failed" in message && message.failed)),
});
assert.equal(retryBody.recentContext?.length, 1);
assert.equal(retryBody.recentContext?.[0]?.text, "Spørsmål");

console.log("website-companion-chat.test.ts: all assertions passed");
