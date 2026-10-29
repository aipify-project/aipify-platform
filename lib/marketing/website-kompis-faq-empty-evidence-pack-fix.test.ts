import assert from "node:assert/strict";
import { createRequire } from "node:module";

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

installServerOnlyShim();

const INSTALL_ID = "180c9d31-3340-4633-b210-3b64edf1e1be";
const DOMAIN = "www.customer.example";
const QUESTION = "Hva gjør jeg hvis en e-post ikke kommer frem?";
const FAQ_ANSWER =
  "Sjekk søppelpost/spam, vent noen minutter, og be oss sende e-posten på nytt til samme adresse.";

const eligibleFaqRow = {
  item_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  title: "E-post kommer ikke frem",
  answer: FAQ_ANSWER,
  category: "support",
  content_type: "faq",
  locale: "no",
  source_url: null as string | null,
  score: 80,
  matched_reason: "question" as const,
};

const unsafeFaqRow = {
  item_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  title: "Kan jeg laste opp nakenbilder?",
  answer: "Du kan laste opp egne nakenbilder når profilen tillater det.",
  category: "safety",
  content_type: "faq",
  locale: "no",
  source_url: null as string | null,
  score: 90,
  matched_reason: "question" as const,
};

const customerAskBase = {
  requestHost: DOMAIN,
  resolveLicensedAvailability: async () => ({
    available: true,
    reason: "available" as const,
    capabilityKey: "website_kompis",
  }),
  groundedCompletion: async () => ({
    ok: false as const,
    errorCode: "test_provider_denied",
    modelProfile: "test",
  }),
  buildEvidencePack: () => ({
    question: QUESTION,
    locale: "no",
    recentContext: [] as Array<{ role: "user" | "assistant"; text: string }>,
    evidence: [] as Array<{
      id: string;
      kind: "faq" | "public-site-index" | "current-page";
      title: string;
      url: string | null;
      locale: string;
      text: string;
    }>,
  }),
};

async function main() {
  const {
    askPublicPlatformCompanion,
    shouldAttemptDeterministicFaqAfterEmptyGroundedPack,
  } = await import("@/lib/marketing/public-companion-ask");
  const { WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE } = await import(
    "@/lib/marketing/website-kompis-public-boundary"
  );
  const { isRelevantPublicCompanionTenantFaqResult } = await import(
    "@/lib/marketing/public-companion-tenant-faq"
  );
  const { filterWebsiteKompisSafeFaqRows } = await import(
    "@/lib/marketing/website-kompis-faq-match-safety"
  );

  assert.equal(
    shouldAttemptDeterministicFaqAfterEmptyGroundedPack({
      groundedPackEmpty: true,
      providerHonestGapRetry: false,
      collectedFaqRowCount: 0,
    }),
    false,
    "empty pack + no collected FAQ must skip deterministic FAQ",
  );
  assert.equal(
    shouldAttemptDeterministicFaqAfterEmptyGroundedPack({
      groundedPackEmpty: true,
      providerHonestGapRetry: false,
      collectedFaqRowCount: 1,
    }),
    true,
    "empty pack + collected FAQ must still attempt deterministic FAQ",
  );
  assert.equal(
    shouldAttemptDeterministicFaqAfterEmptyGroundedPack({
      groundedPackEmpty: false,
      providerHonestGapRetry: false,
      collectedFaqRowCount: 0,
    }),
    true,
  );

  assert.equal(
    isRelevantPublicCompanionTenantFaqResult([eligibleFaqRow], QUESTION),
    true,
  );
  assert.equal(filterWebsiteKompisSafeFaqRows(QUESTION, [eligibleFaqRow]).length, 1);

  process.env.VERCEL_ENV = "preview";

  const emptyPackEligible = await askPublicPlatformCompanion(
    {
      question: QUESTION,
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
    },
    {
      ...customerAskBase,
      rawInstallConfig: {
        website_kompis: {
          enabled: true,
          sources: {
            faq: true,
            currentPage: false,
            aipifyPublic: false,
            publicSiteIndex: false,
          },
        },
      },
      searchTenantVisitorKnowledge: async () => [eligibleFaqRow],
      searchTenantPublicSiteIndex: async () => [],
    },
  );

  // Preview diagnostics may only carry grounded skip metadata; ask-trace is authoritative.
  assert.equal(emptyPackEligible.answer.directAnswer.trim(), FAQ_ANSWER);
  assert.match(emptyPackEligible.answer.directAnswer, /spam|søppelpost|e-post/i);
  assert.doesNotMatch(
    emptyPackEligible.answer.directAnswer,
    /ikke nok publisert|cannot find enough published/i,
  );
  assert.ok(
    !emptyPackEligible.sources.some((source) =>
      source.route.includes(WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE),
    ),
  );
  const groundedDiag = emptyPackEligible.diagnostics as
    | { grounded?: { evidenceCount?: number; faqCount?: number } }
    | undefined;
  assert.equal(groundedDiag?.grounded?.evidenceCount, 0);
  assert.equal(groundedDiag?.grounded?.faqCount, 1);

  const faqSourceOff = await askPublicPlatformCompanion(
    {
      question: QUESTION,
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
    },
    {
      ...customerAskBase,
      rawInstallConfig: {
        website_kompis: {
          enabled: true,
          sources: {
            faq: false,
            currentPage: false,
            aipifyPublic: false,
            publicSiteIndex: false,
          },
        },
      },
      searchTenantVisitorKnowledge: async () => {
        throw new Error("FAQ search must not run when FAQ source is off");
      },
      searchTenantPublicSiteIndex: async () => [],
    },
  );
  assert.match(
    faqSourceOff.answer.directAnswer,
    /ikke nok publisert|cannot find enough published|Ta gjerne kontakt/i,
  );

  const irrelevant = await askPublicPlatformCompanion(
    {
      question: QUESTION,
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
    },
    {
      ...customerAskBase,
      rawInstallConfig: {
        website_kompis: {
          enabled: true,
          sources: {
            faq: true,
            currentPage: false,
            aipifyPublic: false,
            publicSiteIndex: false,
          },
        },
      },
      searchTenantVisitorKnowledge: async () => [
        {
          item_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
          title: "Hva koster medlemskap?",
          answer: "Medlemskap starter på ulike nivåer med ulike fordeler.",
          category: "pricing",
          content_type: "faq",
          locale: "no",
          source_url: null,
          score: 12,
          matched_reason: "token_match",
        },
      ],
      searchTenantPublicSiteIndex: async () => [],
    },
  );
  assert.match(
    irrelevant.answer.directAnswer,
    /ikke nok publisert|cannot find enough published|Ta gjerne kontakt/i,
  );
  assert.doesNotMatch(irrelevant.answer.directAnswer, /Bronze|medlemskap starter/i);

  let wrongInstallSawForeignFaq = false;
  const wrongInstall = await askPublicPlatformCompanion(
    {
      question: QUESTION,
      locale: "no",
      installId: "11111111-1111-4111-8111-111111111111",
      domain: DOMAIN,
    },
    {
      ...customerAskBase,
      rawInstallConfig: {
        website_kompis: {
          enabled: true,
          sources: {
            faq: true,
            currentPage: false,
            aipifyPublic: false,
            publicSiteIndex: false,
          },
        },
      },
      searchTenantVisitorKnowledge: async (input) => {
        if (input.installId !== INSTALL_ID) {
          return [];
        }
        wrongInstallSawForeignFaq = true;
        return [eligibleFaqRow];
      },
      searchTenantPublicSiteIndex: async () => [],
    },
  );
  assert.equal(wrongInstallSawForeignFaq, false);
  assert.match(
    wrongInstall.answer.directAnswer,
    /ikke nok publisert|cannot find enough published|Ta gjerne kontakt/i,
  );
  assert.doesNotMatch(wrongInstall.answer.directAnswer, /spam|søppelpost/i);

  const siteIndexWins = await askPublicPlatformCompanion(
    {
      question: "Hva er forskjellen mellom Bronze Silver Gold og Elite Diamond?",
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
      pageContext: {
        pathname: "/no",
        title: "Hjem",
        surface: "public",
        textSnippets: ["Velkommen."],
      },
    },
    {
      requestHost: DOMAIN,
      resolveLicensedAvailability: customerAskBase.resolveLicensedAvailability,
      groundedCompletion: customerAskBase.groundedCompletion,
      rawInstallConfig: {
        website_kompis: {
          enabled: true,
          sources: {
            faq: true,
            currentPage: false,
            aipifyPublic: false,
            publicSiteIndex: true,
          },
        },
      },
      searchTenantVisitorKnowledge: async () => [eligibleFaqRow],
      searchTenantPublicSiteIndex: async () => [
        {
          documentId: "11111111-1111-4111-8111-111111111111",
          chunkId: "22222222-2222-4222-8222-222222222222",
          title: "Medlemsguide",
          canonicalUrl: `https://${DOMAIN}/no/membership-guide`,
          pathname: "/no/membership-guide",
          locale: "no",
          excerpt: "Sammenlign medlemsnivåer",
          chunkContent:
            "Bronze, Silver, Gold og Elite Diamond har ulike fordeler. Se medlemsguiden for sammenligning.",
          score: 44,
          matchedReason: "public_site_index",
          crawledAt: new Date().toISOString(),
        },
      ],
    },
  );
  assert.match(siteIndexWins.answer.directAnswer, /Bronze|Ut fra nettstedets offentlige sider/i);
  assert.doesNotMatch(siteIndexWins.answer.directAnswer, /spam|søppelpost/i);
  assert.equal(
    siteIndexWins.sources[0]?.route,
    `https://${DOMAIN}/no/membership-guide`,
  );

  // Unsafe FAQ match must not be forced through empty-pack FAQ recovery.
  let unsafeFaqSearchCalls = 0;
  const unsafeAsk = await askPublicPlatformCompanion(
    {
      question: "Kan jeg laste opp bilder av andre?",
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
    },
    {
      ...customerAskBase,
      buildEvidencePack: () => ({
        question: "Kan jeg laste opp bilder av andre?",
        locale: "no",
        recentContext: [],
        evidence: [],
      }),
      rawInstallConfig: {
        website_kompis: {
          enabled: true,
          sources: {
            faq: true,
            currentPage: false,
            aipifyPublic: false,
            publicSiteIndex: false,
          },
        },
      },
      searchTenantVisitorKnowledge: async () => {
        unsafeFaqSearchCalls += 1;
        return [unsafeFaqRow];
      },
      searchTenantPublicSiteIndex: async () => [],
    },
  );
  assert.doesNotMatch(
    unsafeAsk.answer.directAnswer,
    /Du kan laste opp egne nakenbilder/i,
    "unsafe FAQ answer body must not be returned as the visitor answer",
  );
  assert.ok(
    unsafeAsk.sources.some((source) => source.route.includes("safety-policy")) ||
      unsafeFaqSearchCalls === 0 ||
      !unsafeAsk.answer.directAnswer.includes(unsafeFaqRow.answer),
    "empty-pack recovery must not force unsafe FAQ citation",
  );

  console.log("website-kompis-faq-empty-evidence-pack-fix.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
