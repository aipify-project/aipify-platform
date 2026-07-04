import assert from "node:assert/strict";
import { createTranslator } from "@/lib/i18n/translate";
import { orchestrateCompanionSearch } from "@/lib/companion-runtime/orchestrator";
import { createEmptyCompanionTenantContext } from "@/lib/companion-runtime/companion-tenant-context";
import type { PlatformSearchOptions } from "./types";
import {
  isAipifyCoreKnowledgeQuery,
  isTrueCompanionSmalltalk,
  resolvePlatformProductCorpusArticleId,
  resolvePlatformProductFoundationTopic,
  shouldBypassIndustryPackProviderCatalog,
  shouldBypassOrganizationIntelligenceForProductQuery,
  shouldRouteThroughAipifyCore,
} from "./aipify-core-runtime";
import { createEmptyCompanionIndustryPackContext } from "@/lib/companion-runtime/companion-industry-pack-context";

const t = createTranslator({});
const tenantContext = createEmptyCompanionTenantContext({ locale: "no" });

const searchOptions: PlatformSearchOptions = {
  t,
  locale: "no",
  ctx: {
    locale: "no",
    userRole: "owner",
    enabledFeatures: [],
  },
  getSearchTermsArray: () => [],
  subscriptionRaw: undefined,
  tenantContext,
};

const VALIDATION_QUERIES: Array<{
  query: string;
  topic: ReturnType<typeof resolvePlatformProductFoundationTopic>;
  corpusId: ReturnType<typeof resolvePlatformProductCorpusArticleId>;
}> = [
  { query: "Hva er Aipify?", topic: "aipify_overview", corpusId: "aipify-overview" },
  {
    query: "Hva kan Aipify hjelpe meg med?",
    topic: "aipify_capabilities",
    corpusId: "aipify-capabilities",
  },
  {
    query: "Hva koster Aipify?",
    topic: "subscription_pricing",
    corpusId: "subscription-pricing",
  },
  {
    query: "Hvor registrerer jeg meg?",
    topic: "onboarding_registration",
    corpusId: "install-web-app",
  },
  {
    query: "Hvordan blir jeg Aipify Partner?",
    topic: "growth_partners",
    corpusId: "growth-partners",
  },
  {
    query: "Hva er Growth Partners?",
    topic: "growth_partners",
    corpusId: "growth-partners",
  },
  {
    query: "Hva er Business Packs?",
    topic: "business_packs",
    corpusId: "business-packs",
  },
  {
    query: "Hvordan legger jeg til ansatte i APP?",
    topic: "team_members",
    corpusId: "add-team-members",
  },
  {
    query: "Hva kan Aipify gjøre for bedriften min?",
    topic: "aipify_capabilities",
    corpusId: "aipify-capabilities",
  },
  {
    query: "Hvordan kontakter jeg support?",
    topic: "support_contact",
    corpusId: "contact-support",
  },
];

const SNIPER_LIVE_FAILURE_QUERIES: Array<{
  query: string;
  corpusId: ReturnType<typeof resolvePlatformProductCorpusArticleId>;
}> = [
  { query: "hva er partner?", corpusId: "growth-partners" },
  { query: "Hvilken løsninger har dere?", corpusId: "aipify-capabilities" },
  { query: "Kan jeg bruke deg på min frisørsalong?", corpusId: "aipify-capabilities" },
  { query: "Kan jeg bruke deg på mine utleieleiligheter?", corpusId: "aipify-capabilities" },
];

const industryPackTenantContext = createEmptyCompanionTenantContext({
  locale: "no",
  industryPackContext: {
    ...createEmptyCompanionIndustryPackContext(),
    providers: [
      {
        provider_key: "local_service_beauty",
        implementation_status: "specification_only",
        appointment_booking_enabled: true,
        workforce_scheduling_enabled: false,
        absence_coverage_enabled: false,
        service_inventory_enabled: false,
        follow_up_enabled: false,
        verified: false,
        adapter_available: false,
        entitlement_active: true,
        business_pack_active: true,
        industry_blueprint_active: true,
      },
    ],
  },
});

function assertNotIndustryPackProviderGap(
  query: string,
  result: Awaited<ReturnType<typeof orchestrateCompanionSearch>>,
): void {
  assert.notEqual(
    result.answer.sourceId,
    "industry-pack-unavailable",
    `not industry pack gap: ${query}`,
  );
  assert.equal(
    result.answer.directAnswer.toLowerCase().includes("industry pack provider"),
    false,
    `not industry pack catalog message: ${query}`,
  );
}

async function runCoreValidationTests(): Promise<void> {
  for (const { query, topic, corpusId } of VALIDATION_QUERIES) {
    assert.equal(resolvePlatformProductFoundationTopic(query), topic, `topic: ${query}`);
    assert.equal(resolvePlatformProductCorpusArticleId(query), corpusId, `corpus: ${query}`);
    assert.equal(isAipifyCoreKnowledgeQuery(query), true, `core query: ${query}`);
    assert.equal(shouldRouteThroughAipifyCore(query), true, `core route: ${query}`);
    assert.equal(
      shouldBypassOrganizationIntelligenceForProductQuery(query),
      true,
      `bypass org: ${query}`,
    );
    assert.equal(isTrueCompanionSmalltalk(query), false, `not smalltalk: ${query}`);
  }

  assert.equal(isTrueCompanionSmalltalk("Hei!"), true);
  assert.equal(isTrueCompanionSmalltalk("Takk for hjelpen"), true);
  assert.equal(isTrueCompanionSmalltalk("Hva er Aipify?"), false);

  for (const { query, corpusId } of VALIDATION_QUERIES) {
    const result = await orchestrateCompanionSearch(query, searchOptions, tenantContext);

    assert.ok(result.answer.directAnswer.trim().length > 0, `answer body: ${query}`);
    assert.notEqual(result.answer.source, "fallback", `not fallback: ${query}`);
    assert.notEqual(result.answer.sourceId, "knowledge-gap", `not knowledge-gap: ${query}`);
    assert.notEqual(
      result.answer.sourceId,
      "organization-intelligence-gap",
      `not org gap: ${query}`,
    );

    if (corpusId === "growth-partners") {
      assert.equal(result.matchedArticleId, "growth-partners", `growth partners article: ${query}`);
    } else {
      assert.equal(result.matchedArticleId, corpusId, `matched article: ${query}`);
    }

    assert.equal(result.answer.source, "platform_corpus", `platform corpus source: ${query}`);
  }

  for (const { query, corpusId } of SNIPER_LIVE_FAILURE_QUERIES) {
    assert.equal(isAipifyCoreKnowledgeQuery(query), true, `sniper core: ${query}`);
    assert.equal(shouldBypassIndustryPackProviderCatalog(query), true, `sniper bypass industry: ${query}`);
    assert.equal(
      shouldBypassOrganizationIntelligenceForProductQuery(query),
      true,
      `sniper bypass org: ${query}`,
    );

    const result = await orchestrateCompanionSearch(query, searchOptions, industryPackTenantContext);
    assertNotIndustryPackProviderGap(query, result);
    assert.notEqual(
      result.answer.sourceId,
      "organization-intelligence-gap",
      `sniper not org gap: ${query}`,
    );
    assert.equal(result.answer.source, "platform_corpus", `sniper platform corpus: ${query}`);

    if (corpusId === "growth-partners") {
      assert.equal(result.matchedArticleId, "growth-partners", `sniper growth partners: ${query}`);
    } else {
      assert.equal(result.matchedArticleId, corpusId, `sniper matched article: ${query}`);
    }
  }

  console.log("aipify-core-runtime.test.ts: all 10 Core validation queries passed");
  console.log("aipify-core-runtime.test.ts: all 4 sniper live-failure queries passed");
}

runCoreValidationTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
