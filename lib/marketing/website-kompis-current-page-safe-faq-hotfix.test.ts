import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

async function main() {
  installServerOnlyShim();

  const { askPublicPlatformCompanion } = await import("./public-companion-ask");
  const { WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE } = await import(
    "./website-kompis-public-page-context"
  );
  const { WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE } = await import("./website-kompis-public-boundary");
  const { WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE } = await import(
    "./website-kompis-faq-match-safety"
  );

  const installId = "11111111-1111-4111-8111-111111111111";
  const domain = "example-a.test";

  const premiumPageContext = {
    pathname: "/premium",
    title: "Premium medlemskap",
    metaDescription: "Bli Premium-medlem og få eksklusive fordeler.",
    surface: "public" as const,
    headings: [{ level: 1 as const, text: "Premium medlemskap" }],
    textSnippets: [
      "Med Premium får du flere matcher og prioritert synlighet til en lav månedspris.",
    ],
  };

  const customerAskOptions = {
    requestHost: domain,
    rawInstallConfig: {
      website_kompis: {
        enabled: true,
        sources: {
          faq: true,
          currentPage: true,
          aipifyPublic: true,
          publicSiteIndex: false,
        },
      },
    },
    resolveLicensedAvailability: async () => ({
      available: true,
      reason: "available" as const,
      capabilityKey: "website_kompis",
    }),
  };

  const membershipFaqRow = {
    item_id: "faq-member",
    title: "Hvordan blir jeg medlem?",
    answer: "Opprett en profil og fullfør registreringen.",
    category: "membership",
    content_type: "faq",
    locale: "no",
    source_url: null,
    score: 42,
    matched_reason: "title",
  };

  const pricingFaqRow = {
    item_id: "faq-price",
    title: "Hva koster medlemskap?",
    answer: "Grunnmedlemskap er gratis.",
    category: "pricing",
    content_type: "faq",
    locale: "no",
    source_url: null,
    score: 40,
    matched_reason: "title",
  };

  const broadNudeFaqRow = {
    item_id: "faq-nude",
    title: "Kan jeg laste opp nakenbilder?",
    answer: "Ja, det kan du.",
    category: "safety",
    content_type: "faq",
    locale: "no",
    source_url: null,
    score: 50,
    matched_reason: "title",
  };

  const ownNudeFaqRow = {
    item_id: "faq-own-nude",
    title: "Kan jeg laste opp egne nakenbilder?",
    answer: "Ja, egne bilder er tillatt når du har rettighetene og følger plattformens regler.",
    category: "safety",
    content_type: "faq",
    locale: "no",
    source_url: null,
    score: 48,
    matched_reason: "title",
  };

  const pageQuestion = async (question: string) =>
    askPublicPlatformCompanion(
      {
        question,
        locale: "no",
        domain,
        installId,
        pageContext: premiumPageContext,
      },
      {
        ...customerAskOptions,
        searchTenantVisitorKnowledge: async () => [pricingFaqRow, membershipFaqRow],
      },
    );

  const pageAbout = await pageQuestion("Hva handler denne siden om?");
  assert.equal(pageAbout.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);

  const whichPage = await pageQuestion("Hvilken side er jeg på?");
  assert.equal(whichPage.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);

  const whatHere = await pageQuestion("Hva kan jeg gjøre her?");
  assert.equal(whatHere.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);

  const pricingOnPage = await pageQuestion("Hva koster det?");
  assert.equal(pricingOnPage.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);
  assert.ok(
    !pricingOnPage.sources.some((source) => source.route.startsWith("website-kompis-faq:")),
    `FAQ should not beat current page for pricing-on-page question, got ${JSON.stringify(pricingOnPage.sources)}`,
  );

  const membershipFaq = await askPublicPlatformCompanion(
    {
      question: "Hvordan blir jeg medlem?",
      locale: "no",
      domain,
      installId,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [membershipFaqRow],
    },
  );
  assert.ok(
    membershipFaq.sources.some((source) => source.route.startsWith("website-kompis-faq:")),
  );

  const explicitAipify = await askPublicPlatformCompanion(
    {
      question: "Hva er Aipify?",
      locale: "no",
      domain,
      installId,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.ok(
    explicitAipify.sources.some(
      (source) =>
        source.route.includes("aipify-overview") ||
        source.route.includes("aipify-capabilities") ||
        source.route.includes("aipifyCompanion"),
    ),
  );

  const unsafeOtherPeople = await askPublicPlatformCompanion(
    {
      question: "Kan jeg laste opp nakenbilder av andre personer?",
      locale: "no",
      domain,
      installId,
      pageContext: premiumPageContext,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [broadNudeFaqRow],
    },
  );
  assert.equal(unsafeOtherPeople.sources[0]?.route, WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE);
  assert.match(unsafeOtherPeople.answer.directAnswer, /^Nei\./);
  assert.match(unsafeOtherPeople.answer.directAnswer, /samtykke/i);
  assert.ok(!unsafeOtherPeople.answer.directAnswer.includes("Ja, det kan du"));

  const mirroredUnsafeFaqRow = {
    item_id: "faq-nude-mirror",
    title: "Kan jeg laste opp nakenbilder av andre personer?",
    answer: "Ja, det kan du.",
    category: "safety",
    content_type: "faq",
    locale: "no",
    source_url: null,
    score: 52,
    matched_reason: "title",
  };
  const mirroredUnsafe = await askPublicPlatformCompanion(
    {
      question: "Kan jeg laste opp nakenbilder av andre personer?",
      locale: "no",
      domain,
      installId,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [mirroredUnsafeFaqRow],
    },
  );
  assert.equal(mirroredUnsafe.sources[0]?.route, WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE);
  assert.match(mirroredUnsafe.answer.directAnswer, /^Nei\./);
  assert.ok(!mirroredUnsafe.answer.directAnswer.includes("Ja, det kan du"));

  const duplicateUnsafe = await askPublicPlatformCompanion(
    {
      question: "Kan jeg laste opp nakenbilder av andre personer?",
      locale: "no",
      domain,
      installId,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [broadNudeFaqRow, broadNudeFaqRow],
    },
  );
  assert.equal(duplicateUnsafe.sources[0]?.route, WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE);
  assert.ok(
    !duplicateUnsafe.sources.some((source) => source.route.startsWith("website-kompis-faq:")),
  );

  const otherPeopleVariant = await askPublicPlatformCompanion(
    {
      question: "Kan jeg laste opp bilder av andre?",
      locale: "no",
      domain,
      installId,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [broadNudeFaqRow],
    },
  );
  assert.equal(otherPeopleVariant.sources[0]?.route, WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE);

  const privateChatVariant = await askPublicPlatformCompanion(
    {
      question: "Kan jeg sende andres bilder i privat chat?",
      locale: "no",
      domain,
      installId,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [broadNudeFaqRow],
    },
  );
  assert.equal(privateChatVariant.sources[0]?.route, WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE);
  assert.match(privateChatVariant.answer.directAnswer, /^Nei\./);

  const unsafeWithoutConsent = await askPublicPlatformCompanion(
    {
      question: "Kan jeg laste opp bilder av noen uten samtykke?",
      locale: "no",
      domain,
      installId,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [broadNudeFaqRow],
    },
  );
  assert.equal(unsafeWithoutConsent.sources[0]?.route, WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE);
  assert.match(unsafeWithoutConsent.answer.directAnswer, /^Nei\./);
  assert.match(unsafeWithoutConsent.answer.explanation ?? "", /samtykke|rettighe/i);

  const ownNudeAllowed = await askPublicPlatformCompanion(
    {
      question: "Kan jeg laste opp egne nakenbilder?",
      locale: "no",
      domain,
      installId,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [ownNudeFaqRow],
    },
  );
  assert.ok(
    ownNudeAllowed.sources.some((source) => source.route.startsWith("website-kompis-faq:")),
    `expected precise FAQ for own-content question, got ${JSON.stringify(ownNudeAllowed.sources)}`,
  );
  assert.match(ownNudeAllowed.answer.directAnswer, /egne|rettighe|regler/i);

  const unrelatedFallback = await askPublicPlatformCompanion(
    {
      question: "Hva er været i morgen?",
      locale: "no",
      domain,
      installId,
      pageContext: premiumPageContext,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(unrelatedFallback.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);

  console.log("website-kompis-current-page-safe-faq-hotfix.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
