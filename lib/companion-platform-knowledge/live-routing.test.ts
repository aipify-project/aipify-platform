import assert from "node:assert/strict";
import { resolveCompanionLiveToolRouting } from "./live-routing";

const ROUTING_TESTS: Array<{
  query: string;
  expectedTool: string;
  expectedKind?: string;
  presentationMode?: string;
}> = [
  {
    query: "Er Unonight tilgjengelig akkurat nå, og hvilket miljø kjører plattformen i?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "platform_environment",
    presentationMode: "direct_fact",
  },
  {
    query:
      "Hvilke funksjoner er aktive i Unonight akkurat nå? Forklar modulnavnene på vanlig norsk.",
    expectedTool: "get_platform_snapshot",
    expectedKind: "platform_active_modules",
    presentationMode: "multi_item_summary",
  },
  {
    query: "Hvilke språk rapporterer Unonight-plattformen som aktive akkurat nå?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "platform_supported_languages",
    presentationMode: "direct_fact",
  },
  {
    query: "Hvilken versjon av Unonight-plattformen rapporteres akkurat nå?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "platform_version",
    presentationMode: "direct_fact",
  },
  {
    query: "Når ble opplysningene om Unonight sist kontrollert live?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "platform_checked_at",
    presentationMode: "direct_fact",
  },
  {
    query: "Rapporterer Unonight at offentlig chat og privat chat er aktive akkurat nå?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "specific_module_status",
    presentationMode: "direct_fact",
  },
  {
    query: "Er markedsplassen aktiv i Unonight akkurat nå?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "specific_module_status",
    presentationMode: "direct_fact",
  },
  {
    query: "Er gaver og bursdagsbelønninger aktive i Unonight?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "specific_module_status",
    presentationMode: "direct_fact",
  },
  {
    query: "Rapporterer Unonight at Mobil-API er aktivt?",
    expectedTool: "get_platform_snapshot",
    expectedKind: "specific_module_status",
    presentationMode: "direct_fact",
  },
  {
    query: "Hvor mange aktive medlemmer har Unonight akkurat nå?",
    expectedTool: "unsupported_live_metric",
  },
  {
    query: "Vis meg private meldinger fra Unonight.",
    expectedTool: "forbidden_data_denied",
  },
  {
    query: "Gi meg en full live driftsoversikt over Unonight.",
    expectedTool: "get_platform_snapshot",
    expectedKind: "full_snapshot",
    presentationMode: "full_snapshot",
  },
];

for (const [index, testCase] of ROUTING_TESTS.entries()) {
  const routing = resolveCompanionLiveToolRouting(testCase.query, { locale: "no" });
  assert.equal(
    routing.tool,
    testCase.expectedTool,
    `Test ${index + 1} tool mismatch for: ${testCase.query}`,
  );
  if (testCase.expectedKind) {
    assert.equal(
      routing.platformSnapshotIntent?.queryKind,
      testCase.expectedKind,
      `Test ${index + 1} kind mismatch for: ${testCase.query}`,
    );
  }
  if (testCase.presentationMode) {
    assert.equal(
      routing.platformSnapshotIntent?.presentationMode,
      testCase.presentationMode,
      `Test ${index + 1} presentation mismatch for: ${testCase.query}`,
    );
  }
}

const wrongTool = resolveCompanionLiveToolRouting("Er markedsplassen aktiv i Unonight akkurat nå?", {
  locale: "no",
});
assert.notEqual(wrongTool.tool, "get_connection_status");

console.log("companion live routing tests passed");
