import assert from "node:assert/strict";
import {
  buildGenericPlatformAnswer,
  resolveEntityKeysFromQuery,
} from "@/lib/integration-intelligence";
import { DEMO_BOOKING_MOCK_SNAPSHOT } from "@/lib/integration-intelligence/providers/demo-booking/manifest";
import { resolveCompanionLiveToolRouting } from "@/lib/integration-intelligence/routing";

const demoProvider = "demo_booking_provider";

const demoRoutingTests = [
  {
    query: "Are bookings active in Demo Booking Provider?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "entity_active_status",
    entityKeys: ["booking"],
  },
  {
    query: "Which appointment functions are available in Demo Booking Provider?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "list_capabilities",
  },
  {
    query: "Which languages does Demo Booking Provider support?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "platform_supported_languages",
  },
] as const;

for (const testCase of demoRoutingTests) {
  const routing = resolveCompanionLiveToolRouting(testCase.query, demoProvider, "en", {
    activeProviderKey: demoProvider,
  });
  assert.equal(routing.tool, testCase.expectedTool, testCase.query);
  assert.equal(routing.intent?.queryKind, testCase.expectedKind, testCase.query);
}

const bookingKeys = resolveEntityKeysFromQuery(
  "Are bookings active?",
  demoProvider,
  "en",
);
assert.deepEqual(bookingKeys, ["booking"]);

const marketplaceKeys = resolveEntityKeysFromQuery(
  "Er markedsplassen aktiv i Unonight akkurat nå?",
  "unonight",
  "no",
);
assert.ok(marketplaceKeys.includes("marketplace"), "markedsplassen should resolve to marketplace");

const mockTranslator = ((key: string) => {
  const labels: Record<string, string> = {
    "customerApp.companionPlatformKnowledge.platformSnapshot.directAnswers.moduleActiveLine":
      "✅ {module} is active.",
    "customerApp.companionPlatformKnowledge.platformSnapshot.directAnswers.moduleInactiveLine":
      "ℹ️ {module} is not active.",
    "customerApp.companionPlatformKnowledge.platformSnapshot.directAnswers.checkedAtFooter":
      "Checked: {checkedAt}",
    "customerApp.companionPlatformKnowledge.integrationIntelligence.directAnswers.sourceFooterVerified":
      "Data source: Verified {provider} integration",
    "customerApp.companionPlatformKnowledge.platformSnapshot.card.timestampUnavailable":
      "Unavailable",
    "customerApp.companionPlatformKnowledge.integrationIntelligence.providers.unonight.displayName":
      "Unonight",
  };
  return labels[key] ?? key;
}) as import("@/lib/i18n/translate").Translator;

const bookingAnswer = buildGenericPlatformAnswer(
  DEMO_BOOKING_MOCK_SNAPSHOT,
  demoProvider,
  "en",
  "en",
  mockTranslator,
  {
    queryKind: "entity_active_status",
    presentationMode: "direct_fact",
    targetEntityKeys: ["booking"],
  },
);

assert.match(bookingAnswer.directAnswer, /active/i);
assert.ok(bookingAnswer.explanation?.includes("Checked:"));

console.log("integration intelligence tests passed");
