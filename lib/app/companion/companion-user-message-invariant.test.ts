import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  COMPANION_MESSAGE_CONSUMER_PATHS,
  COMPANION_MESSAGE_SURFACE_PATHS,
  COMPANION_USER_MESSAGE_CARD_V1_FLAG,
  COMPANION_USER_MESSAGE_FEEDBACK_CONTROLS,
  COMPANION_USER_MESSAGE_IDENTITY_ICON,
  COMPANION_USER_MESSAGE_PRESENTATION,
} from "./companion-user-message-policy";
import { buildCompanionExperienceLabels } from "./labels";
import { createTranslator } from "@/lib/i18n/translate";

const repoRoot = join(import.meta.dirname, "..", "..", "..");

assert.equal(COMPANION_USER_MESSAGE_PRESENTATION, "card");
assert.equal(COMPANION_USER_MESSAGE_IDENTITY_ICON, "speech_bubble");
assert.equal(COMPANION_USER_MESSAGE_FEEDBACK_CONTROLS, "none");
assert.equal(COMPANION_USER_MESSAGE_CARD_V1_FLAG, "companionUserMessageCardV1");

const userCardSource = readFileSync(
  join(repoRoot, "components/app/companion-experience/CompanionUserMessageCard.tsx"),
  "utf8",
);
const assistantCardSource = readFileSync(
  join(repoRoot, "components/app/companion-experience/CompanionAssistantMessageCard.tsx"),
  "utf8",
);
const messageItemSource = readFileSync(
  join(repoRoot, "components/app/companion-experience/CompanionChatMessageItem.tsx"),
  "utf8",
);
const identityIconSource = readFileSync(
  join(repoRoot, "components/app/companion-experience/CompanionUserMessageIdentityIcon.tsx"),
  "utf8",
);

assert.match(userCardSource, /CompanionUserMessageIdentityIcon/);
assert.match(userCardSource, /whitespace-pre-line/);
assert.match(userCardSource, /ariaUserMessage/);
assert.doesNotMatch(userCardSource, /CompanionAnswerFeedback/);
assert.doesNotMatch(userCardSource, /👍|👎|feedbackHelpful/);
assert.doesNotMatch(userCardSource, /CompanionIcon/);
assert.doesNotMatch(userCardSource, /unonight/i);

assert.match(assistantCardSource, /CompanionAnswerFeedback/);
assert.match(assistantCardSource, /CompanionIcon/);
assert.doesNotMatch(assistantCardSource, /CompanionUserMessageCard/);
assert.doesNotMatch(assistantCardSource, /unonight/i);

assert.match(messageItemSource, /CompanionUserMessageCard/);
assert.match(messageItemSource, /CompanionAssistantMessageCard/);
assert.match(messageItemSource, /LegacyCompanionUserMessage/);
assert.match(messageItemSource, /isCompanionUserMessageCardV1Enabled/);

assert.match(identityIconSource, /MessageCircle/);
assert.doesNotMatch(identityIconSource, /ThumbUp|ThumbDown|👍|👎/);
assert.doesNotMatch(identityIconSource, /AipifyPulse|CompanionIcon/);

for (const relativePath of COMPANION_MESSAGE_SURFACE_PATHS) {
  const source = readFileSync(join(repoRoot, relativePath), "utf8");
  assert.match(
    source,
    /CompanionChatMessageItem/,
    `${relativePath} must route messages through CompanionChatMessageItem`,
  );
  assert.doesNotMatch(
    source,
    /unonight/i,
    `${relativePath} must not contain Unonight-specific presentation code`,
  );
}

for (const relativePath of COMPANION_MESSAGE_CONSUMER_PATHS) {
  const source = readFileSync(join(repoRoot, relativePath), "utf8");
  assert.match(
    source,
    /CompanionChat/,
    `${relativePath} must consume shared CompanionChat for message rendering`,
  );
  assert.doesNotMatch(
    source,
    /userMessageCardV1:\s*true/,
    `${relativePath} must not auto-enable companionUserMessageCardV1`,
  );
  assert.doesNotMatch(
    source,
    /unonight/i,
    `${relativePath} must not contain Unonight-specific presentation code`,
  );
}

const FULL_LABEL_LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;
const ARIA_ONLY_LOCALES = ["es"] as const;

for (const locale of FULL_LABEL_LOCALES) {
  const file = join(repoRoot, "locales", locale, "customer-app", "companion.json");
  const parsed = JSON.parse(readFileSync(file, "utf8")) as {
    companionExperience?: Record<string, string>;
  };
  const experience = parsed.companionExperience;
  assert.ok(experience?.ariaUserMessage, `missing ariaUserMessage in ${locale}`);
  assert.ok(experience?.ariaUserMessageIdentity, `missing ariaUserMessageIdentity in ${locale}`);
  assert.notEqual(experience.ariaUserMessage, "ariaUserMessage");
  assert.notEqual(experience.ariaUserMessageIdentity, "ariaUserMessageIdentity");

  const dict = { customerApp: parsed };
  const labels = buildCompanionExperienceLabels(createTranslator(dict));
  assert.ok(labels.ariaUserMessage.length > 0, `empty ariaUserMessage label in ${locale}`);
  assert.ok(labels.ariaUserMessageIdentity.length > 0, `empty ariaUserMessageIdentity label in ${locale}`);
}

for (const locale of ARIA_ONLY_LOCALES) {
  const file = join(repoRoot, "locales", locale, "customer-app", "companion.json");
  const parsed = JSON.parse(readFileSync(file, "utf8")) as {
    companionExperience?: Record<string, string>;
  };
  const experience = parsed.companionExperience;
  assert.ok(experience?.ariaUserMessage, `missing ariaUserMessage in ${locale}`);
  assert.ok(experience?.ariaUserMessageIdentity, `missing ariaUserMessageIdentity in ${locale}`);
}

console.log("companion-user-message-invariant.test.ts: all assertions passed");
