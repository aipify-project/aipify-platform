import { assertCoreSourceFreeOfCustomerPilotNames } from "./companion-core-source-hygiene";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  createEmptyCompanionIdentityContext,
  normalizeCompanionIdentityContext,
} from "./companion-identity-context";
import {
  applyCompanionOutputPipeline,
  isSeriousAnswerContext,
  validateFactIntegrity,
} from "./companion-output-pipeline";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { COMMUNICATION_STYLES, IDENTITY_TONES, NAME_USAGE_OPTIONS, RESPONSE_LENGTHS } from "@/lib/identity-engine/dimensions";

const groundedAnswer: PlatformKnowledgeAnswer = {
  directAnswer:
    "Aipify prepared a read-only answer from verified live data.\nstatus: available\nactive_modules: 2",
  explanation: "Source: provider:demo · Checked: 22 Jun 2026, 12:00\nLive metadata may be stale.",
  steps: [],
  actions: [],
  sources: [{ id: "demo.read", label: "Verified live data", kind: "verified_integration" }],
  sourceId: "demo.read",
  source: "verified_integration",
  confidence: "high",
  liveIntegrationToolUsed: true,
};

const gapAnswer: PlatformKnowledgeAnswer = {
  directAnswer: "I could not find a grounded answer.",
  explanation: "Your role cannot read live data for that capability.",
  steps: [],
  actions: [],
  sources: [{ id: "grounded-live-gap", label: "Verified live data", kind: "customer_context" }],
  sourceId: "grounded-live-gap",
  source: "customer_context",
  confidence: "low",
};

const identityContext = normalizeCompanionIdentityContext({
  locale: "en",
  identityCenter: {
    has_customer: true,
    user_name: "Alex",
    profile: {
      id: "profile-1",
      communication_style: COMMUNICATION_STYLES[0],
      proactivity_level: "balanced",
      tone: IDENTITY_TONES[1],
      name_usage: NAME_USAGE_OPTIONS[1],
      notification_style: "balanced",
      identity_mode: "supportive",
      social_interaction_style: "trusted_organizer",
      response_length: RESPONSE_LENGTHS[0],
      notification_preferences: {
        push: true,
        email: false,
        calendar: false,
        in_app: true,
        daily_summaries: false,
      },
      boundaries: {
        no_repeated_contact: true,
        no_excessive_notifications: true,
        no_emotional_pressure: true,
        no_dependency_encouragement: true,
        no_guilt: true,
      },
      onboarding_completed: true,
      created_at: "2026-06-22T08:00:00.000Z",
      updated_at: "2026-06-22T08:00:00.000Z",
    },
  },
  assistantIdentity: {
    has_customer: true,
    enabled: true,
    display_name: "Alex",
    preferences: {
      allow_encouragement: true,
      allow_personalized_phrases: true,
      preferred_tone: "supportive",
    },
  },
  personality: {
    has_customer: true,
    personality_mode: "warm_professional",
    humor_enabled: true,
  },
  companionRelationship: {
    settings: {
      companion_display_name: "Aipify",
      official_name: "Aipify",
      relationship_mode: "hybrid",
      tone_preference: "conversational",
      proactivity_level: "moderate",
      humor_preference: "subtle",
      notification_style: "calm",
      encouragement_preference: "moderate",
      briefing_style: "concise",
      personalization_enabled: true,
      boundary_settings: null,
    },
    trust_indicators: [],
    milestones: [],
    pending_reviews: [],
    personalization_status: [],
    introduction_framework: null,
    blueprint: null,
    links: null,
    can_manage: true,
    can_record: false,
    privacy_note: null,
  },
});

assert.equal(identityContext.brand_name, "Aipify");
assert.equal(identityContext.preferred_name, "Alex");
assert.equal(identityContext.empathy_enabled, true);
assert.equal(identityContext.humor_enabled, true);
assert.equal(identityContext.personalization_enabled, true);

const adapted = applyCompanionOutputPipeline(groundedAnswer, identityContext, {
  locale: "en",
  userName: "Alex",
  context: "verified_integration",
});

assert.equal(adapted.explanation, groundedAnswer.explanation);
assert.equal(adapted.sources.length, groundedAnswer.sources.length);
assert.ok(adapted.directAnswer.includes("status: available"));
assert.ok(adapted.directAnswer.includes("active_modules: 2"));
assert.ok(validateFactIntegrity(groundedAnswer.directAnswer, adapted.directAnswer, ["status: available", "active_modules: 2"]));

const humorOff = applyCompanionOutputPipeline(groundedAnswer, {
  ...identityContext,
  humor_enabled: false,
  warmth_level: "low",
}, { locale: "en", userName: "Alex" });
assert.ok(humorOff.directAnswer.includes("status: available"));

const empathyOff = applyCompanionOutputPipeline(groundedAnswer, {
  ...identityContext,
  empathy_enabled: false,
  personalization_enabled: false,
}, { locale: "en", userName: "Alex" });
assert.ok(empathyOff.directAnswer.includes("status: available"));

assert.equal(isSeriousAnswerContext(gapAnswer), true);
const seriousAdapted = applyCompanionOutputPipeline(gapAnswer, identityContext, {
  locale: "en",
  userName: "Alex",
});
assert.equal(seriousAdapted.explanation, gapAnswer.explanation);
assert.ok(seriousAdapted.directAnswer.includes("grounded answer") || seriousAdapted.directAnswer.length > 0);

const permissionDenied = createEmptyCompanionIdentityContext({
  empathy_enabled: false,
  humor_enabled: false,
  safety_boundaries: ["permission_denied"],
});
const deniedAdapted = applyCompanionOutputPipeline(gapAnswer, permissionDenied, { locale: "en" });
assert.equal(deniedAdapted.explanation, gapAnswer.explanation);

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const localized = applyCompanionOutputPipeline(groundedAnswer, {
    ...identityContext,
    language: locale,
  }, { locale, userName: "Alex" });
  assert.ok(localized.directAnswer.includes("status: available"), locale);
}

const coreFiles = [
  "companion-identity-context.ts",
  "companion-output-pipeline.ts",
  "load-companion-identity-context.ts",
];
for (const file of coreFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  assertCoreSourceFreeOfCustomerPilotNames(source, file);
}

console.log("phase8 companion runtime tests passed");
