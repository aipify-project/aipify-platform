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
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}

installServerOnlyShim();

const INSTALL_ID = "11111111-1111-4111-8111-111111111111";
const DOMAIN = "www.customer.example";
const QUESTION = "Hva gjør jeg hvis en e-post ikke kommer frem?";
const FAQ_ANSWER =
  "Sjekk søppelpost/spam, vent noen minutter, og be support sende e-posten på nytt.";

const strongEmailFaq = {
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

type FaqCollectionPayload = {
  event: string;
  correlationId: string;
  faqSourceEnabled: boolean;
  faqFetchAttempted: boolean;
  faqRpcCount: number;
  faqRelevantCount: number;
  faqSafeCount: number;
  faqKeptCount: number;
  faqSkipReason: string;
  faqRpcErrorCodeClass: string | null;
};

function captureFaqCollectionLogs(run: () => Promise<unknown>): Promise<{
  payloads: FaqCollectionPayload[];
  serialized: string[];
}> {
  const payloads: FaqCollectionPayload[] = [];
  const serialized: string[] = [];
  const originalInfo = console.info;
  console.info = (...args: unknown[]) => {
    serialized.push(args.map((arg) => JSON.stringify(arg)).join(" "));
    if (
      args[0] === "[website-kompis-ask-trace]" &&
      args[1] &&
      typeof args[1] === "object" &&
      (args[1] as { event?: string }).event === "faq_collection"
    ) {
      payloads.push(args[1] as FaqCollectionPayload);
    }
  };
  return run()
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      console.info = originalInfo;
    })
    .then(() => ({ payloads, serialized }));
}

function assertNoSensitiveLogContent(serialized: string[]): void {
  const joined = serialized.join("\n").toLowerCase();
  assert.doesNotMatch(joined, /sjekk søppelpost|support@|authorization|password|bearer /i);
  assert.doesNotMatch(joined, /"question"\s*:/);
  assert.doesNotMatch(joined, /"directanswer"\s*:/);
  assert.doesNotMatch(joined, /"answer"\s*:/);
}

async function main() {
  const {
    buildWebsiteKompisFaqCollectionTrace,
    resolveWebsiteKompisFaqCollectionSkipReason,
  } = await import("@/lib/marketing/website-kompis-public-ask-trace");
  const { askPublicPlatformCompanion } = await import(
    "@/lib/marketing/public-companion-ask"
  );

  assert.equal(
    resolveWebsiteKompisFaqCollectionSkipReason({
      faqSourceEnabled: false,
      hasVisitorContext: true,
      platformKnowledgeRoute: false,
      faqFetchAttempted: false,
      faqRpcErrorCodeClass: null,
      faqRpcCount: 0,
      faqRelevantCount: 0,
      faqSafeCount: 0,
      faqKeptCount: 0,
    }),
    "source_disabled",
  );

  const retained = buildWebsiteKompisFaqCollectionTrace({
    correlationId: "corr-retained",
    faqSourceEnabled: true,
    hasVisitorContext: true,
    platformKnowledgeRoute: false,
    faqFetchAttempted: true,
    faqRpcCount: 1,
    faqRelevantCount: 1,
    faqSafeCount: 1,
    faqKeptCount: 1,
  });
  assert.equal(retained.faqSkipReason, "none");
  assert.equal(retained.event, "faq_collection");

  process.env.VERCEL_ENV = "preview";

  const baseAsk = {
    question: QUESTION,
    locale: "no" as const,
    installId: INSTALL_ID,
    domain: DOMAIN,
    pageContext: {
      pathname: "/no",
      title: "Customer",
      surface: "public" as const,
      locale: "no",
      headings: [],
      textSnippets: ["Velkommen."],
    },
  };

  const baseOptions = {
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
    searchTenantPublicSiteIndex: async () => [],
  };

  // source OFF
  {
    const { payloads, serialized } = await captureFaqCollectionLogs(() =>
      askPublicPlatformCompanion(baseAsk, {
        ...baseOptions,
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
          throw new Error("FAQ search must not run when source is off");
        },
      }),
    );
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0]?.faqSourceEnabled, false);
    assert.equal(payloads[0]?.faqFetchAttempted, false);
    assert.equal(payloads[0]?.faqSkipReason, "source_disabled");
    assert.equal(payloads[0]?.faqRpcCount, 0);
    assertNoSensitiveLogContent(serialized);
  }

  // RPC empty
  {
    const { payloads, serialized } = await captureFaqCollectionLogs(() =>
      askPublicPlatformCompanion(baseAsk, {
        ...baseOptions,
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
        searchTenantVisitorKnowledge: async () => ({ rows: [], errorClass: null }),
      }),
    );
    assert.equal(payloads[0]?.faqFetchAttempted, true);
    assert.equal(payloads[0]?.faqRpcCount, 0);
    assert.equal(payloads[0]?.faqSkipReason, "rpc_empty");
    assert.equal(payloads[0]?.faqRpcErrorCodeClass, null);
    assertNoSensitiveLogContent(serialized);
  }

  // RPC error
  {
    const { payloads, serialized } = await captureFaqCollectionLogs(() =>
      askPublicPlatformCompanion(baseAsk, {
        ...baseOptions,
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
        searchTenantVisitorKnowledge: async () => ({
          rows: [],
          errorClass: "rpc_error",
        }),
      }),
    );
    assert.equal(payloads[0]?.faqSkipReason, "rpc_error");
    assert.equal(payloads[0]?.faqRpcErrorCodeClass, "rpc_error");
    assert.equal(payloads[0]?.faqRpcCount, 0);
    assertNoSensitiveLogContent(serialized);
  }

  // relevance rejection
  {
    const irrelevant = {
      ...strongEmailFaq,
      title: "Medlemskap",
      answer: "Medlemskap gir tilgang til flere funksjoner.",
      score: 8,
      matched_reason: "token_match" as const,
    };
    const { payloads, serialized } = await captureFaqCollectionLogs(() =>
      askPublicPlatformCompanion(baseAsk, {
        ...baseOptions,
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
        searchTenantVisitorKnowledge: async () => [irrelevant],
      }),
    );
    assert.equal(payloads[0]?.faqRpcCount, 1);
    assert.equal(payloads[0]?.faqRelevantCount, 0);
    assert.equal(payloads[0]?.faqSafeCount, 0);
    assert.equal(payloads[0]?.faqKeptCount, 0);
    assert.equal(payloads[0]?.faqSkipReason, "relevance_rejected");
    assertNoSensitiveLogContent(serialized);
  }

  // safety rejection counter progression (deterministic; ask path may short-circuit
  // mandatory safety questions before collect, so assert the skip enum here)
  {
    const safetyDrop = buildWebsiteKompisFaqCollectionTrace({
      correlationId: "corr-safety",
      faqSourceEnabled: true,
      hasVisitorContext: true,
      platformKnowledgeRoute: false,
      faqFetchAttempted: true,
      faqRpcCount: 2,
      faqRelevantCount: 2,
      faqSafeCount: 0,
      faqKeptCount: 0,
    });
    assert.equal(safetyDrop.faqSkipReason, "safety_rejected");
    assert.equal(safetyDrop.faqRpcCount, 2);
    assert.equal(safetyDrop.faqRelevantCount, 2);
    assert.equal(safetyDrop.faqSafeCount, 0);
    assert.equal(safetyDrop.faqKeptCount, 0);
  }

  // ask-path safety filter empties kept rows without mandatory-safety short-circuit:
  // "mine bilder" question + FAQ that fails own-content safety coverage.
  {
    const ownContentQuestion = "Kan jeg laste opp mine egne bilder?";
    const nonOwnFaq = {
      item_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      title: "Opplasting av bilder",
      answer: "Bilder kan lastes opp til profilen etter verifisering.",
      category: "support",
      content_type: "faq",
      locale: "no",
      source_url: null as string | null,
      score: 70,
      matched_reason: "question" as const,
    };
    const { filterWebsiteKompisSafeFaqRows } = await import(
      "@/lib/marketing/website-kompis-faq-match-safety"
    );
    const { isRelevantPublicCompanionTenantFaqResult } = await import(
      "@/lib/marketing/public-companion-tenant-faq"
    );
    assert.equal(
      isRelevantPublicCompanionTenantFaqResult([nonOwnFaq], ownContentQuestion),
      true,
    );
    assert.equal(
      filterWebsiteKompisSafeFaqRows(ownContentQuestion, [nonOwnFaq]).length,
      0,
    );
    const { payloads, serialized } = await captureFaqCollectionLogs(() =>
      askPublicPlatformCompanion(
        { ...baseAsk, question: ownContentQuestion },
        {
          ...baseOptions,
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
          searchTenantVisitorKnowledge: async () => [nonOwnFaq],
        },
      ),
    );
    assert.equal(payloads[0]?.faqRpcCount, 1);
    assert.equal(payloads[0]?.faqRelevantCount, 1);
    assert.equal(payloads[0]?.faqSafeCount, 0);
    assert.equal(payloads[0]?.faqKeptCount, 0);
    assert.equal(payloads[0]?.faqSkipReason, "safety_rejected");
    assertNoSensitiveLogContent(serialized);
  }

  // relevant safe retained FAQ
  {
    const { payloads, serialized } = await captureFaqCollectionLogs(() =>
      askPublicPlatformCompanion(baseAsk, {
        ...baseOptions,
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
        searchTenantVisitorKnowledge: async () => [strongEmailFaq],
      }),
    );
    assert.equal(payloads[0]?.faqSourceEnabled, true);
    assert.equal(payloads[0]?.faqFetchAttempted, true);
    assert.equal(payloads[0]?.faqRpcCount, 1);
    assert.equal(payloads[0]?.faqRelevantCount, 1);
    assert.equal(payloads[0]?.faqSafeCount, 1);
    assert.equal(payloads[0]?.faqKeptCount, 1);
    assert.equal(payloads[0]?.faqSkipReason, "none");
    assert.equal(payloads[0]?.faqRpcErrorCodeClass, null);
    assert.match(payloads[0]?.correlationId ?? "", /[0-9a-f-]{8,}/i);
    assertNoSensitiveLogContent(serialized);
  }

  console.log("website-kompis-faq-collection-trace.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
