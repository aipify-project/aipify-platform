import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

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

installServerOnlyShim();

const publicCompanionAskSource = fs.readFileSync(
  path.join(root, "lib/marketing/public-companion-ask.ts"),
  "utf8",
);
const routeSource = fs.readFileSync(
  path.join(root, "app/api/marketing/companion/ask/route.ts"),
  "utf8",
);

const failures: string[] = [];

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    try {
      await fn();
      console.log(`ok ${name}`);
    } catch (error) {
      failures.push(name);
      console.error(`fail ${name}`);
      console.error(error);
    }
  })();
}

async function main() {
  const {
    PUBLIC_COMPANION_ASK_MAX_QUESTION_LENGTH,
    askPublicPlatformCompanion,
    buildPublicCompanionQuery,
    buildPublicCompanionRetrievalQuestion,
    buildPublicPageContextRetrievalQuery,
    isLowSignalPublicCompanionFollowUp,
    isPublicPageContextQuestion,
    preferStrongSiteIndexOverSparseFaq,
    sanitizePublicCompanionActions,
    validatePublicCompanionAskRequest,
  } = await import("./public-companion-ask");

  await test("unsupported follow-up binds prior topic into retrieval question", () => {
    assert.equal(isLowSignalPublicCompanionFollowUp("fortell mer"), true);
    assert.equal(isLowSignalPublicCompanionFollowUp("Hva koster medlemskap?"), false);
    const retrieval = buildPublicCompanionRetrievalQuestion("fortell mer", [
      { role: "user", text: "Hvordan fungerer frakt på markedsplassen?" },
      { role: "assistant", text: "Selgeren setter fraktprisen for fysiske varer." },
    ]);
    assert.match(retrieval, /frakt|markedsplass/i);
  });

  await test("strong site-index can drop sparse unsourced FAQ; sourced FAQ kept", () => {
    const preferred = preferStrongSiteIndexOverSparseFaq({
      question: "Er det gratis å bli medlem?",
      faqRows: [
        {
          item_id: "faq-1",
          title: "Medlemskap",
          answer: "Medlemskap er helt gratis.",
          category: "Medlemskap",
          content_type: "faq",
          locale: "no",
          source_url: null,
          score: 18,
          matched_reason: "question_match",
        },
      ],
      siteIndexHits: [
        {
          documentId: "doc-1",
          chunkId: "chunk-1",
          title: "Medlemskapsguide",
          canonicalUrl: "https://customer.example/no/membership-guide",
          pathname: "/no/membership-guide",
          locale: "no",
          excerpt: "Bronze-medlemskap er helt gratis for nye medlemmer",
          chunkContent:
            "Er det gratis å bli medlem? Bronze-medlemskap er helt gratis for nye medlemmer på NETTSTED_NAVN.",
          score: 42,
          matchedReason: "public_site_index",
          crawledAt: null,
        },
      ],
    });
    assert.equal(preferred.faqRows.length, 0);
    assert.equal(preferred.siteIndexHits.length, 1);

    const keepSourcedFaq = preferStrongSiteIndexOverSparseFaq({
      question: "Hva koster medlemskap?",
      faqRows: [
        {
          item_id: "faq-2",
          title: "Medlemskap",
          answer: "Bronze er gratis. Se medlemskapsguiden.",
          category: "Medlemskap",
          content_type: "faq",
          locale: "no",
          source_url: "https://customer.example/no/membership-guide",
          score: 40,
          matched_reason: "question_match",
        },
      ],
      siteIndexHits: [
        {
          documentId: "doc-2",
          chunkId: "chunk-2",
          title: "Medlemskapsguide",
          canonicalUrl: "https://customer.example/no/membership-guide",
          pathname: "/no/membership-guide",
          locale: "no",
          excerpt: "Bronze er gratis",
          chunkContent: "Bronze er gratis på medlemskapsguiden.",
          score: 48,
          matchedReason: "public_site_index",
          crawledAt: null,
        },
      ],
    });
    assert.equal(keepSourcedFaq.faqRows.length, 1);
  });

  // Phase 2A isolation first — customer embed must not fall through to platform product copy.
  await test("customer site generic question never uses platform knowledge even if aipifyPublic=true", async () => {
    const response = await askPublicPlatformCompanion(
      {
        question: "Hvilke fordeler får jeg her på siden?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: true,
              currentPage: false,
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
        searchTenantVisitorKnowledge: async () => [],
      },
    );
    const combined = [response.answer.directAnswer, response.answer.explanation ?? ""].join(" ");
    assert.doesNotMatch(combined, /Business Operating System|ABOS|799|lisenser/i);
  });

  await test("P1 Q15 customer host denies Aipify Platform pricing even when aipifyPublic=true", async () => {
    const response = await askPublicPlatformCompanion(
      {
        question: "How much does the Aipify Platform subscription cost for enterprises?",
        locale: "en",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: true,
              currentPage: false,
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
        searchTenantVisitorKnowledge: async () => [],
        groundedCompletion: async () => {
          throw new Error("provider must not run for P1 Q15 customer pricing deny");
        },
      },
    );
    const combined = [response.answer.directAnswer, response.answer.explanation ?? ""].join("\n");
    assert.doesNotMatch(combined, /799|3\s?990|14\s?500/);
    assert.ok(!response.sources.some((source) => source.route.includes("public-pricing.ts")));
  });

  await test("P1 multilingual Aipify pricing variants denied on customer host", async () => {
    for (const question of [
      "Hva koster Aipify?",
      "What does Aipify cost?",
      "Vad kostar Aipify?",
      "Hvad koster Aipify?",
    ]) {
      const response = await askPublicPlatformCompanion(
        {
          question,
          locale: "en",
          installId: "11111111-1111-4111-8111-111111111111",
          domain: "www.customer-a.example",
        },
        {
          requestHost: "www.customer-a.example",
          rawInstallConfig: {
            website_kompis: {
              enabled: true,
              sources: {
                faq: true,
                currentPage: false,
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
          searchTenantVisitorKnowledge: async () => [],
          groundedCompletion: async () => {
            throw new Error("provider must not run for P1 multilingual pricing deny");
          },
        },
      );
      assert.doesNotMatch(response.answer.directAnswer, /799|14\s?500/);
      assert.ok(!response.sources.some((source) => source.route.includes("public-pricing.ts")));
    }
  });

  await test("tenant A FAQ is not returned for tenant B install", async () => {
    const response = await askPublicPlatformCompanion(
      {
        question: "Hva koster det å bli medlem?",
        locale: "no",
        installId: "22222222-2222-4222-8222-222222222222",
        domain: "www.customer-b.example",
      },
      {
        requestHost: "www.customer-b.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: { faq: true, currentPage: false, aipifyPublic: true, publicSiteIndex: false },
          },
        },
        resolveLicensedAvailability: async () => ({
          available: true,
          reason: "available" as const,
          capabilityKey: "website_kompis",
        }),
        searchTenantVisitorKnowledge: async (input) => {
          assert.equal(input.installId, "22222222-2222-4222-8222-222222222222");
          assert.equal(input.domain, "www.customer-b.example");
          return [];
        },
      },
    );
    assert.doesNotMatch(response.answer.directAnswer, /Medlemskap er helt gratis/);
  });

  await test("empty FAQ with publicSiteIndex off returns honest customer fallback", async () => {
    const response = await askPublicPlatformCompanion(
      {
        question: "Fortell om medlemsnivåene Bronze Silver Gold",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: { faq: true, currentPage: false, aipifyPublic: true, publicSiteIndex: false },
          },
        },
        resolveLicensedAvailability: async () => ({
          available: true,
          reason: "available" as const,
          capabilityKey: "website_kompis",
        }),
        searchTenantVisitorKnowledge: async () => [],
      },
    );
    assert.match(response.answer.directAnswer.toLowerCase(), /publisert|kontakt|ikke nok/);
    assert.doesNotMatch(response.answer.directAnswer, /799/);
  });

  await test("natural pricing question returns canonical published ladder", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
    });

    const combined = [response.answer.directAnswer, response.answer.explanation ?? ""].join("\n");
    assert.match(combined, /799/);
    assert.match(combined, /3\s?990/);
    assert.match(combined, /14\s?500/);
    assert.match(combined.toLowerCase(), /tilpasset/);
    assert.match(combined, /25\s+lisenser/);
    assert.equal(response.confidence.level, "high");
    assert.equal(response.supportEscalation.offered, false);
    assert.ok(response.actions.some((action) => action.href === "/pricing"));
    assert.ok(!response.actions.some((action) => action.href.startsWith("/app/")));
    assert.ok(response.sources.some((source) => source.route.includes("public-pricing.ts")));
  });

  await test("pricing questions in Norwegian and English use published summary", async () => {
    for (const question of ["Hvilke priser har dere?", "What does Aipify cost?"]) {
      const response = await askPublicPlatformCompanion({
        question,
        locale: question.startsWith("H") ? "no" : "en",
      });
      assert.match(response.answer.directAnswer, /799/);
      assert.match(response.answer.directAnswer, /3[,\s]?990/);
      assert.equal(response.confidence.level, "high");
      assert.equal(response.supportEscalation.offered, false);
    }
  });

  await test("business-specific pricing question includes business ladder line", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Business?",
      locale: "no",
    });

    assert.match(response.answer.directAnswer, /Business:\s*14\s?500/);
    assert.match(response.answer.directAnswer, /25\s+lisenser/);
  });

  await test("natural demo question returns safe internal action", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Kan jeg bestille en demonstrasjon?",
      locale: "no",
    });

    assert.ok(response.answer.directAnswer.length > 10);
    // Corpus CTAs still name routes removed from the foundation nav.
    // sanitizePublicCompanionActions drops those, so an empty list is the safe result.
    for (const action of response.actions) {
      assert.ok(action.href.startsWith("/app/"));
      assert.ok(!action.href.includes("javascript:"));
    }
  });

  await test("business pack question understands alternative phrasing", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hvordan fungerer disse pakkene for bedrifter?",
      locale: "no",
    });

    assert.ok(response.answer.directAnswer.length > 20);
    assert.match(response.answer.directAnswer.toLowerCase(), /business pack|forretningspak|modul|pack/);
  });

  await test("unanswered question returns honest gap and support escalation", async () => {
    const response = await askPublicPlatformCompanion({
      question: "xyzzy-q9f3m2-nonexistent-capability-probe-8811",
      locale: "no",
    });

    assert.ok(
      response.confidence.level === "low" || response.supportEscalation.offered,
      `expected low-confidence gap path, got confidence=${response.confidence.level} escalation=${response.supportEscalation.offered}`,
    );
    assert.ok(response.answer.directAnswer.length > 10);
    assert.doesNotMatch(response.answer.directAnswer, /799/);
  });

  await test("high or medium confidence does not offer unnecessary escalation for pricing", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
    });

    assert.ok(["high", "medium"].includes(response.confidence.level));
    assert.equal(response.supportEscalation.offered, false);
  });

  await test("messageLocale overrides page locale", async () => {
    const response = await askPublicPlatformCompanion({
      question: "How do I contact support?",
      locale: "no",
      messageLocale: "en",
    });

    assert.equal(response.locale, "en");
    assert.ok(response.answer.directAnswer.length > 20);
  });

  await test("invalid locale falls back to en", async () => {
    const response = await askPublicPlatformCompanion({
      question: "What is Aipify?",
      locale: "de",
      messageLocale: "pt-BR",
    });

    assert.equal(response.locale, "en");
  });

  await test("invalid or external actions are removed", async () => {
    const { getPlatformRouteByKey } = await import(
      "@/lib/companion-platform-knowledge/route-registry"
    );
    const live = getPlatformRouteByKey("kompisWebFaq");
    if (!live || !live.href.startsWith("/app/")) {
      throw new Error("kompisWebFaq is not an internal route");
    }
    const sanitized = sanitizePublicCompanionActions([
      {
        labelKey: "x",
        label: "Safe",
        href: live.href,
        routeKey: live.routeKey,
      },
      {
        labelKey: "y",
        label: "External",
        href: "https://evil.example",
        routeKey: live.routeKey,
      },
      {
        labelKey: "z",
        label: "Script",
        href: "javascript:alert(1)",
        routeKey: live.routeKey,
      },
      {
        labelKey: "w",
        label: "Mismatch",
        href: "/app/settings/billing",
        routeKey: live.routeKey,
      },
    ]);

    assert.equal(sanitized.length, 1);
    assert.equal(sanitized[0]?.href, live.href);
  });

  await test("tenant organization and user ids cannot be sent in", () => {
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          tenantId: "tenant-1",
        }),
      /Invalid request field/,
    );
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          organizationId: "org-1",
        }),
      /Invalid request field/,
    );
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          userId: "user-1",
        }),
      /Invalid request field/,
    );
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          providerId: "unonight",
        }),
      /Invalid request field/,
    );
  });

  await test("overlong question is rejected", () => {
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "x".repeat(PUBLIC_COMPANION_ASK_MAX_QUESTION_LENGTH + 1),
        }),
      /question too long/,
    );
  });

  await test("recent context is bounded and sanitized", () => {
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          recentContext: Array.from({ length: 7 }, (_, index) => ({
            role: "user",
            text: `message ${index}`,
          })),
        }),
      /recentContext too long/,
    );

    const clipped = validatePublicCompanionAskRequest({
      question: "Hva koster Aipify?",
      recentContext: [{ role: "user", text: "x".repeat(501) }],
    });
    assert.equal(clipped.recentContext?.[0]?.text.length, 500);

    const validated = validatePublicCompanionAskRequest({
      question: "Hva koster Aipify?",
      recentContext: [
        { role: "assistant", text: "  Earlier answer  " },
        { role: "user", text: "Follow-up" },
      ],
    });

    const query = buildPublicCompanionQuery(validated.question, validated.recentContext);
    assert.match(query, /assistant: Earlier answer/);
    assert.match(query, /user: Follow-up/);
    assert.match(query, /user: Hva koster Aipify\?/);
  });

  await test("getting started question is understood naturally", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hvor finner jeg hjelp til å komme i gang?",
      locale: "no",
    });

    assert.ok(response.answer.directAnswer.length > 20);
    assert.ok(response.actions.length > 0 || response.sources.length > 0);
  });

  const FORBIDDEN_ENGLISH_SOURCE_TITLES = [
    "Upgrade Options",
    "Knowledge Center",
    "Marketplace",
    "Getting Started",
  ];

  function assertNoEnglishRouteSourceTitles(
    sources: Array<{ title: string }>,
    context: string,
  ) {
    for (const title of FORBIDDEN_ENGLISH_SOURCE_TITLES) {
      assert.ok(
        !sources.some((source) => source.title === title),
        `${context}: unexpected English source title "${title}"`,
      );
    }
  }

  await test("Norwegian pricing source titles use published pricing source", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
    });

    assert.equal(response.locale, "no");
    assertNoEnglishRouteSourceTitles(response.sources, "pricing");
    assert.ok(
      response.sources.some((source) => source.title === "Abonnementspriser"),
      `expected Abonnementspriser source, got: ${response.sources.map((s) => s.title).join(", ")}`,
    );
    assert.ok(
      response.sources.some((source) => source.route.includes("public-pricing.ts")),
      "expected canonical pricing source route",
    );
  });

  await test("Norwegian knowledge source titles use portalStructure locale", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Kan noen vise meg hvordan Aipify fungerer?",
      locale: "no",
    });

    assert.equal(response.locale, "no");
    assert.ok(response.sources.length > 0);
    assertNoEnglishRouteSourceTitles(response.sources, "knowledge");
    for (const action of response.actions) {
      assert.ok(!FORBIDDEN_ENGLISH_SOURCE_TITLES.includes(action.label));
    }
  });

  await test("Norwegian marketplace source titles use portalStructure locale", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hvordan fungerer disse pakkene for bedrifter?",
      locale: "no",
    });

    assert.equal(response.locale, "no");
    assert.ok(response.sources.length > 0);
    assertNoEnglishRouteSourceTitles(response.sources, "marketplace");
  });

  await test("Norwegian response uses same locale for sources and action labels", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Kan noen vise meg hvordan Aipify fungerer?",
      locale: "no",
    });

    assert.equal(response.locale, "no");
    assert.ok(response.sources.length > 0);
    // Exact CTA labels vary with retrieval. Retired route keys are removed, so actions may be empty.
    if (response.actions.length > 0) {
      assert.ok(
        response.actions.every((action) => !/^(Get started|Open Aipify Companion)$/i.test(action.label)),
        `unexpected English CTA labels: ${response.actions.map((a) => a.label).join(", ")}`,
      );
      assert.ok(
        response.actions.some((action) => /[æøåÆØÅ]|Kom i gang|Companion|Les om|Åpne/i.test(action.label)),
        `expected Norwegian CTA labels, got: ${response.actions.map((a) => a.label).join(", ")}`,
      );
    }
    assertNoEnglishRouteSourceTitles(response.sources, "locale consistency");
  });

  await test("messageLocale en keeps English pricing source titles", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
      messageLocale: "en",
    });

    assert.equal(response.locale, "en");
    assert.ok(
      response.sources.some((source) => source.title === "Subscription pricing"),
      `expected English Subscription pricing source, got: ${response.sources.map((s) => s.title).join(", ")}`,
    );
    assert.ok(!response.sources.some((source) => source.title === "Abonnementspriser"));
  });

  await test("invalid locale falls back to English pricing source titles", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "pt-BR",
    });

    assert.equal(response.locale, "en");
    assert.ok(
      response.sources.some((source) => source.title === "Subscription pricing"),
      `expected English Subscription pricing source, got: ${response.sources.map((s) => s.title).join(", ")}`,
    );
    assert.ok(!response.sources.some((source) => source.title === "Abonnementspriser"));
  });

  await test("runtime loads portalStructure without hardcoded source titles", () => {
    assert.match(
      publicCompanionAskSource,
      /getCustomerAppDictionaryForSplits\(\s*publicAskDictionaryLocale\(locale\),\s*\[[\s\S]*?"companionPlatformKnowledge"[\s\S]*?"portalStructure"[\s\S]*?\]\s*\)/,
    );
    assert.match(publicCompanionAskSource, /buildPublishedPricingSummary/);
    assert.doesNotMatch(publicCompanionAskSource, /Oppgraderinger|Kunnskapssenter|Markedsplass/);
  });

  await test("output does not require raw HTML or markdown links", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
    });

    const combined = [
      response.answer.directAnswer,
      response.answer.explanation ?? "",
      ...response.answer.steps,
      ...response.actions.map((action) => action.label),
    ].join("\n");

    assert.doesNotMatch(combined, /<\/?[a-z][\s\S]*>/i);
    assert.doesNotMatch(combined, /\[[^\]]+\]\([^)]+\)/);
  });

  await test("page context question on companion article uses current-page knowledge", async () => {
    const pageContext = {
      pathname: "/knowledge/articles/what-is-a-business-companion",
      title: "Hva er en forretnings-Companion?",
      metaDescription: "Aipify Companion er ledelses- og operasjonell intelligens.",
      surface: "public" as const,
    };

    assert.equal(
      isPublicPageContextQuestion("Hva handler denne siden om?", {
        slug: "what-is-a-business-companion",
        title: pageContext.title,
        searchIntents: ["Companion Platform", "Enterprise Companion"],
      }),
      true,
    );

    const response = await askPublicPlatformCompanion({
      question: "Hva handler denne siden om?",
      locale: "no",
      pageContext,
    });

    const combined = [response.answer.directAnswer, response.answer.explanation ?? ""].join("\n");
    assert.match(combined.toLowerCase(), /companion|forretnings|aipify/);
    assert.ok(
      response.sources.some(
        (source) =>
          source.route.includes("what-is-a-business-companion") ||
          source.route.includes("/knowledge/articles/what-is-a-business-companion"),
      ),
      `expected page source, got ${JSON.stringify(response.sources)}`,
    );
  });

  await test("core capability question ignores page context on companion article page", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hvilken løsninger har dere?",
      locale: "no",
      pageContext: {
        pathname: "/knowledge/articles/what-is-a-business-companion",
        title: "Hva er en forretnings-Companion?",
        metaDescription: "Aipify Companion er ledelses- og operasjonell intelligens.",
        surface: "public",
      },
    });

    assert.ok(
      response.sources.some((source) => source.route.includes("aipify-capabilities")),
      `expected aipify-capabilities source, got ${JSON.stringify(response.sources)}`,
    );
    assert.ok(
      !response.sources.some((source) =>
        source.route.includes("what-is-a-business-companion"),
      ),
    );
  });

  await test("pageContext validation accepts safe shape and rejects unsafe fields", () => {
    const validated = validatePublicCompanionAskRequest({
      question: "Hva handler denne siden om?",
      locale: "no",
      pageContext: {
        pathname: "/knowledge/articles/what-is-a-business-companion",
        title: "Hva er en forretnings-Companion?",
        metaDescription: "Aipify Companion er ledelses- og operasjonell intelligens.",
        surface: "public",
      },
    });
    assert.equal(validated.pageContext?.pathname, "/knowledge/articles/what-is-a-business-companion");

    assert.throws(() =>
      validatePublicCompanionAskRequest({
        question: "Hei",
        pageContext: {
          pathname: "/knowledge/articles/what-is-a-business-companion",
          pageHtml: "<p>unsafe</p>",
        },
      }),
    );

    const hint = buildPublicPageContextRetrievalQuery(
      "Hva handler denne siden om?",
      {
        title: "Hva er en forretnings-Companion?",
        metaDescription: "Aipify Companion er ledelses- og operasjonell intelligens.",
        introduction: "Companion er hvordan Aipify er til stede for ledere og team.",
      },
      validated.pageContext,
    );
    assert.match(hint, /Current page:/);
    assert.match(hint, /User question: Hva handler denne siden om\?/);
  });

  await test("inactive licensed widget returns disabled fallback and skips FAQ", async () => {
    let faqCalled = false;
    const response = await askPublicPlatformCompanion(
      {
        question: "What are your opening hours?",
        locale: "en",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "example-a.test",
      },
      {
        requestHost: "example-a.test",
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
          available: false,
          reason: "license_inactive",
          capabilityKey: "website_kompis",
        }),
        searchTenantVisitorKnowledge: async () => {
          faqCalled = true;
          return [];
        },
      },
    );

    assert.equal(faqCalled, false);
    assert.match(response.answer.directAnswer, /temporarily unavailable/i);
  });

  await test("new files do not reference Unonight or customer-specific runtime symbols", () => {
    const forbidden =
      /\bunonight\b|loadCompanionTenantContext|search_organization_knowledge|record_companion_answer_feedback/i;
    assert.doesNotMatch(publicCompanionAskSource, forbidden);
    assert.doesNotMatch(routeSource, forbidden);
    assert.match(publicCompanionAskSource, /searchPlatformKnowledge/);
    assert.match(publicCompanionAskSource, /createEmptyCompanionTenantContext/);
  });

  await test("customer site uses mocked Core grounded completion with validated sources", async () => {
    let completionCalled = false;
    const response = await askPublicPlatformCompanion(
      {
        question: "Hva er forskjellen mellom Bronze og Gold?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: true,
              currentPage: false,
              aipifyPublic: true,
              publicSiteIndex: true,
            },
          },
        },
        resolveLicensedAvailability: async () => ({
          available: true,
          reason: "available" as const,
          capabilityKey: "website_kompis",
        }),
        searchTenantVisitorKnowledge: async () => [
          {
            item_id: "faq-bronze-gold",
            title: "Medlemsnivåer",
            answer:
              "Bronze er startnivået. Gold gir flere profilfunksjoner enn Bronze på NETTSTED_NAVN.",
            source_url: "https://www.customer-a.example/no/membership",
            locale: "no",
            score: 42,
            category: "membership",
            content_type: "faq",
            matched_reason: "faq",
          },
        ],
        searchTenantPublicSiteIndex: async () => [
          {
            documentId: "doc-1",
            chunkId: "chunk-1",
            title: "Medlemsguide",
            canonicalUrl: "https://www.customer-a.example/no/membership-guide",
            pathname: "/no/membership-guide",
            locale: "no",
            excerpt: "Sammenlign nivåer",
            chunkContent:
              "Bronze er startnivået. Gold gir flere profilfunksjoner enn Bronze.",
            score: 48,
            matchedReason: "public_site_index",
            crawledAt: null,
          },
        ],
        groundedCompletion: async () => {
          completionCalled = true;
          return {
            ok: true,
            text: JSON.stringify({
              covered: true,
              answer:
                "Bronze er startnivået, mens Gold gir flere profilfunksjoner enn Bronze.",
              sourceIds: ["faq:faq-bronze-gold", "index:chunk-1"],
              followUp: "Vil du også høre om Silver?",
            }),
            modelProfile: "kompis_result_summary_v1",
            latencyMs: 18,
            usage: { inputUnits: 20, outputUnits: 40, totalUnits: 60 },
          };
        },
      },
    );

    assert.equal(completionCalled, true);
    assert.match(response.answer.directAnswer, /Gold/);
    assert.doesNotMatch(response.answer.directAnswer, /Business Operating System|799/);
    assert.ok(
      response.sources.some((source) => source.route.includes("membership")),
    );
  });

  await test("follow-up uses recent context for retrieval without platform fallthrough", async () => {
    const faqQueries: string[] = [];
    const response = await askPublicPlatformCompanion(
      {
        question: "Kan du utdype forskjellen mellom Bronze og Gold?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
        recentContext: [
          {
            role: "user",
            text: "Hva er forskjellen mellom Bronze og Gold?",
          },
          {
            role: "assistant",
            text: "Bronze er startnivået. Gold gir flere profilfunksjoner.",
          },
        ],
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: true,
              currentPage: false,
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
        searchTenantVisitorKnowledge: async (input) => {
          faqQueries.push(input.query);
          return [
            {
              item_id: "faq-bronze-gold",
              title: "Medlemsnivåer",
              answer:
                "Bronze er startnivået. Gold gir flere profilfunksjoner enn Bronze.",
              source_url: "https://www.customer-a.example/no/membership",
              locale: "no",
              score: 40,
              category: "membership",
              content_type: "faq",
              matched_reason: "faq",
            },
          ];
        },
        groundedCompletion: async () => ({
          ok: true,
          text: JSON.stringify({
            covered: true,
            answer:
              "Det betyr at Gold gir flere profilfunksjoner enn Bronze-startnivået.",
            sourceIds: ["faq:faq-bronze-gold"],
            followUp: null,
          }),
          modelProfile: "kompis_result_summary_v1",
          latencyMs: 10,
          usage: { inputUnits: 10, outputUnits: 12, totalUnits: 22 },
        }),
      },
    );

    assert.ok(faqQueries.some((query) => /Bronze/i.test(query)));
    assert.match(response.answer.directAnswer, /Gold|Bronze/);
    assert.doesNotMatch(response.answer.directAnswer, /799|ABOS|Business Operating System/);
  });

  await test("provider covered:false falls through to FAQ instead of keeping gap", async () => {
    const response = await askPublicPlatformCompanion(
      {
        question: "Hva er forskjellen mellom Bronze og Gold?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: true,
              currentPage: false,
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
        searchTenantVisitorKnowledge: async () => [
          {
            item_id: "faq-bronze-gold",
            title: "Medlemsnivåer",
            answer:
              "Bronze er startnivået. Gold gir flere profilfunksjoner enn Bronze på NETTSTED_NAVN.",
            source_url: "https://www.customer-a.example/no/membership",
            locale: "no",
            score: 44,
            category: "membership",
            content_type: "faq",
            matched_reason: "faq",
          },
        ],
        groundedCompletion: async () => ({
          ok: true,
          text: JSON.stringify({
            covered: false,
            answer: "Jeg finner ikke nok publisert informasjon om dette.",
            sourceIds: [],
            followUp: null,
          }),
          modelProfile: "kompis_result_summary_v1",
          latencyMs: 4,
          usage: { inputUnits: 2, outputUnits: 4, totalUnits: 6 },
        }),
      },
    );

    assert.match(response.answer.directAnswer, /Bronze|Gold/);
    assert.doesNotMatch(
      response.answer.directAnswer,
      /finner ikke nok publisert informasjon/i,
    );
    assert.ok(
      response.sources.some((source) => source.route.includes("membership")),
    );
  });

  await test("provider partial knowledge gap with sources is kept over index extract", async () => {
    // Stub provider payload — not the retained LIVE Push model response.
    const response = await askPublicPlatformCompanion(
      {
        question: "Hvor mange poeng koster én Push?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
        pageContext: {
          pathname: "/no/faq/marketplace-listing-push",
          title: "Push på markedsplassen",
          canonicalUrl: "https://www.customer-a.example/no/faq/marketplace-listing-push",
          locale: "no",
          textSnippets: [
            "Push synliggjør annonsen. Før poengene trekkes, får du alltid se kostnaden og bekrefte handlingen.",
          ],
          surface: "public",
        },
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: true,
              currentPage: true,
              aipifyPublic: false,
              publicSiteIndex: true,
            },
          },
        },
        resolveLicensedAvailability: async () => ({
          available: true,
          reason: "available" as const,
          capabilityKey: "website_kompis",
        }),
        searchTenantVisitorKnowledge: async () => [],
        searchTenantPublicSiteIndex: async () => [
          {
            documentId: "doc-push",
            chunkId: "chunk-push-ask",
            title: "Push på markedsplassen",
            canonicalUrl:
              "https://www.customer-a.example/no/faq/marketplace-listing-push",
            pathname: "/no/faq/marketplace-listing-push",
            locale: "no",
            excerpt:
              "Push synliggjør annonsen. Før poengene trekkes, får du alltid se kostnaden.",
            chunkContent:
              "Push gjør annonsen mer synlig. Før poengene trekkes, får du alltid se kostnaden og bekrefte handlingen. Hvor ser jeg hvor mange poeng jeg har?",
            score: 40,
            matchedReason: "title",
            crawledAt: null,
          },
        ],
        groundedCompletion: async () => ({
          ok: true,
          text: JSON.stringify({
            covered: false,
            answer:
              "Jeg finner ikke et konkret poengtall i informasjonen jeg har. Før poengene trekkes, får du alltid se kostnaden og bekrefte handlingen.",
            sourceIds: ["index:chunk-push-ask"],
            followUp: null,
          }),
          modelProfile: "kompis_result_summary_v1",
          latencyMs: 4,
          usage: { inputUnits: 2, outputUnits: 6, totalUnits: 8 },
        }),
      },
    );

    assert.match(response.answer.directAnswer, /finner ikke et konkret poengtall/i);
    assert.match(response.answer.directAnswer, /kostnaden/i);
    assert.doesNotMatch(response.answer.directAnswer, /Hvor ser jeg|Ut fra nettstedets/i);
    assert.equal(response.supportEscalation.reason, "knowledge_gap");
    assert.ok(
      response.sources.some((source) =>
        source.route.includes("marketplace-listing-push"),
      ),
    );
  });

  await test("safety-thread Aipify Verify follow-up stays on site evidence not ABOS", async () => {
    let indexQuery = "";
    let platformCalled = false;
    const response = await askPublicPlatformCompanion(
      {
        question: "Hva er Aipify Verify?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
        recentContext: [
          {
            role: "user",
            text: "Hvordan fungerer sikkerhet og verifisering?",
          },
          {
            role: "assistant",
            text: "Ut fra nettstedets offentlige sider: Aipify Verify og bildekontroll beskytter medlemmene.",
          },
        ],
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: true,
              currentPage: false,
              aipifyPublic: true,
              publicSiteIndex: true,
            },
          },
        },
        resolveLicensedAvailability: async () => ({
          available: true,
          reason: "available" as const,
          capabilityKey: "website_kompis",
        }),
        searchTenantVisitorKnowledge: async () => [],
        searchTenantPublicSiteIndex: async (input) => {
          indexQuery = input.query;
          return [
            {
              documentId: "doc-safety",
              chunkId: "chunk-verify",
              title: "Sikkerhetssenter",
              canonicalUrl: "https://www.customer-a.example/no/safety",
              pathname: "/no/safety",
              locale: "no",
              excerpt: "Aipify Verify",
              chunkContent:
                "Aipify Verify er nettstedets identitetsverifisering med bildekontroll og 18+ kontroll for et tryggere medlemsmiljø.",
              score: 52,
              matchedReason: "public_site_index",
              crawledAt: null,
            },
          ];
        },
        groundedCompletion: async () => {
          platformCalled = true;
          return {
            ok: false,
            errorCode: "AI_PROVIDER_NOT_CONFIGURED",
            modelProfile: "kompis_result_summary_v1",
            latencyMs: 1,
          };
        },
      },
    );

    assert.match(indexQuery, /Aipify Verify|Verify|verifiser/i);
    assert.match(response.answer.directAnswer, /identitetsverifisering|bildekontroll|Aipify Verify/i);
    assert.doesNotMatch(
      response.answer.directAnswer,
      /Business Operating System|ABOS|Command Center/,
    );
    assert.ok(response.sources.some((source) => /safety|Sikkerhet/i.test(source.route + source.title)));
    void platformCalled;
  });

  await test("P1 explicit Aipify package question on customer host denies platform pricing", async () => {
    let indexCalled = false;
    const response = await askPublicPlatformCompanion(
      {
        question: "Hvilke pakker selger Aipify?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
        recentContext: [
          {
            role: "user",
            text: "Hvordan fungerer sikkerhet og verifisering?",
          },
          {
            role: "assistant",
            text: "Ut fra nettstedets offentlige sider: verifisering og personvern.",
          },
        ],
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: false,
              currentPage: false,
              aipifyPublic: true,
              publicSiteIndex: true,
            },
          },
        },
        resolveLicensedAvailability: async () => ({
          available: true,
          reason: "available" as const,
          capabilityKey: "website_kompis",
        }),
        searchTenantPublicSiteIndex: async () => {
          indexCalled = true;
          return [];
        },
        groundedCompletion: async () => {
          throw new Error("provider must not run for P1 package pricing deny");
        },
      },
    );

    assert.equal(indexCalled, true);
    assert.doesNotMatch(response.answer.directAnswer, /799|3\s?990|14\s?500/);
    assert.ok(!response.sources.some((source) => source.route.includes("public-pricing.ts")));
  });

  await test("grounded provider failure falls back to extractive FAQ without platform copy", async () => {
    const response = await askPublicPlatformCompanion(
      {
        question: "Hva er forskjellen mellom Bronze og Gold?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: true,
              currentPage: false,
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
        searchTenantVisitorKnowledge: async () => [
          {
            item_id: "faq-bronze-gold",
            title: "Medlemsnivåer",
            answer:
              "Bronze er startnivået. Gold gir flere profilfunksjoner enn Bronze på NETTSTED_NAVN.",
            source_url: "https://www.customer-a.example/no/membership",
            locale: "no",
            score: 42,
            category: "membership",
            content_type: "faq",
            matched_reason: "faq",
          },
        ],
        groundedCompletion: async () => ({
          ok: false,
          errorCode: "provider_timeout",
          modelProfile: "kompis_result_summary_v1",
          latencyMs: 80,
        }),
      },
    );

    assert.match(response.answer.directAnswer, /Bronze|Gold|profil/);
    assert.doesNotMatch(response.answer.directAnswer, /799|Business Operating System/);
  });

  await test("empty grounded pack does not reintroduce rejected index as cost-gap or membership dump", async () => {
    let indexSearchCount = 0;
    const response = await askPublicPlatformCompanion(
      {
        question: "Hvor kjøper eller aktiverer jeg Desk Pass?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
        recentContext: [
          {
            role: "user",
            text: "Hva er forskjellen mellom Bronze og Gold?",
          },
          {
            role: "assistant",
            text: "Bronze er startnivået. Gold gir flere profilfunksjoner.",
          },
        ],
      },
      {
        requestHost: "www.customer-a.example",
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
        resolveLicensedAvailability: async () => ({
          available: true,
          reason: "available" as const,
          capabilityKey: "website_kompis",
        }),
        searchTenantVisitorKnowledge: async () => [],
        searchTenantPublicSiteIndex: async () => {
          indexSearchCount += 1;
          return [
            {
              documentId: "doc-faq",
              chunkId: "chunk-faq",
              title: "FAQ — hjelp og svar",
              canonicalUrl: "https://www.customer-a.example/no/faq",
              pathname: "/no/faq",
              locale: "no",
              excerpt: "Hva koster medlemskap?",
              chunkContent:
                "Hva koster medlemskap? Hvordan kjøper jeg poeng? Før poengene trekkes, får du alltid se kostnaden.",
              score: 30,
              matchedReason: "public_site_index",
              crawledAt: null,
            },
            {
              documentId: "doc-terms",
              chunkId: "chunk-terms",
              title: "Terms and Conditions",
              canonicalUrl:
                "https://www.customer-a.example/en/terms-and-conditions",
              pathname: "/en/terms-and-conditions",
              locale: "en",
              excerpt: "Membership plans",
              chunkContent:
                "Membership plans may include Bronze, Silver, and Gold. Purchases are subject to published terms.",
              score: 24,
              matchedReason: "public_site_index",
              crawledAt: null,
            },
            {
              documentId: "doc-membership",
              chunkId: "chunk-membership",
              title: "Membership Guide",
              canonicalUrl:
                "https://www.customer-a.example/no/membership-guide",
              pathname: "/no/membership-guide",
              locale: "no",
              excerpt: "Bronze og Gold",
              chunkContent:
                "Bronze er startnivået. Gold gir flere profilfunksjoner enn Bronze på NETTSTED_NAVN.",
              score: 44,
              matchedReason: "public_site_index",
              crawledAt: null,
            },
          ];
        },
        groundedCompletion: async () => {
          throw new Error("provider must not run with empty evidence pack");
        },
      },
    );

    // Collect once; empty pack must not trigger a second loose index search.
    assert.equal(indexSearchCount, 1);
    assert.doesNotMatch(
      response.answer.directAnswer,
      /finner ikke et konkret|poengtall|Bronze|Gold|Membership/i,
    );
    // Honest safe fallback — not a fact-looking public_site_index answer.
    assert.ok(response.answer.directAnswer.trim().length > 0);
    assert.ok(
      !response.sources.some((source) =>
        /\/faq|terms-and-conditions|membership-guide/i.test(source.route),
      ),
      "rejected FAQ/terms/membership routes must not reappear as sources",
    );
    assert.equal(
      response.sources.length,
      0,
      "empty pack with no topical hits must land on safe_fallback without a source card",
    );
  });

  await test("empty pack with topical activation evidence still answers from collected hits", async () => {
    const response = await askPublicPlatformCompanion(
      {
        question: "Hvor kjøper eller aktiverer jeg Desk Pass?",
        locale: "no",
        installId: "11111111-1111-4111-8111-111111111111",
        domain: "www.customer-a.example",
      },
      {
        requestHost: "www.customer-a.example",
        rawInstallConfig: {
          website_kompis: {
            enabled: true,
            sources: {
              faq: false,
              currentPage: false,
              aipifyPublic: false,
              publicSiteIndex: true,
            },
          },
        },
        resolveLicensedAvailability: async () => ({
          available: true,
          reason: "available" as const,
          capabilityKey: "website_kompis",
        }),
        searchTenantPublicSiteIndex: async () => [
          {
            documentId: "doc-desk",
            chunkId: "chunk-desk",
            title: "Desk Pass",
            canonicalUrl: "https://www.customer-a.example/no/desk-pass",
            pathname: "/no/desk-pass",
            locale: "no",
            excerpt: "Aktiver Desk Pass",
            chunkContent:
              "Desk Pass aktiveres under Konto → Abonnement. Velg Desk Pass og bekreft aktiveringen før tilgangen åpnes.",
            score: 50,
            matchedReason: "public_site_index",
            crawledAt: null,
          },
        ],
        groundedCompletion: async () => ({
          ok: false,
          errorCode: "AI_PROVIDER_NOT_CONFIGURED",
          modelProfile: "kompis_result_summary_v1",
          latencyMs: 1,
        }),
      },
    );

    assert.match(response.answer.directAnswer, /aktiveres|Konto|Abonnement/i);
    assert.doesNotMatch(response.answer.directAnswer, /finner ikke et konkret/i);
    assert.ok(
      response.sources.some((source) => source.route.includes("desk-pass")),
    );
  });

  if (failures.length > 0) {
    console.error(`public-companion-ask.test.ts: ${failures.length} failed`);
    process.exit(1);
  }
  console.log("public-companion-ask.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
