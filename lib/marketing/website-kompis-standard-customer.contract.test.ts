import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import vm from "node:vm";
import type { SupabaseClient } from "@supabase/supabase-js";
import { proposePublicContentLocale } from "@/lib/kompis-content-languages/proposed-public-locale";
import { sanitizeWebsiteKompisEmbedLocale } from "@/lib/marketing/website-kompis-embed";
import { expandPublicSiteIndexSearchLocales } from "@/lib/marketing/website-kompis-public-site-index/locale-contract";
import type { PublicCompanionTenantFaqRow } from "@/lib/marketing/public-companion-tenant-faq";
import type { PublicSiteIndexHit } from "@/lib/marketing/website-kompis-public-site-index/answer";
import { buildWebsiteKompisWarmSafeFallbackCopy } from "@/lib/marketing/website-kompis-visitor-tone";
import { connectionShowsActiveLicenseWithoutPublicView } from "@/lib/website-kompis-connection/customer-copy";
import { buildConnectionStatusSummary } from "@/lib/website-kompis-connection/status-model";

const require = createRequire(import.meta.url);
const root = process.cwd();

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

const INSTALL_A1 = "11111111-1111-4111-8111-111111111111";
const INSTALL_A2 = "22222222-2222-4222-8222-222222222222";
const INSTALL_B1 = "33333333-3333-4333-8333-333333333333";
const DOMAIN_A1 = "alpha.example";
const DOMAIN_A2 = "beta.example";
const DOMAIN_B1 = "gamma.example";

const installConfig = {
  website_kompis: {
    enabled: true,
    sources: { faq: true, currentPage: false, aipifyPublic: false, publicSiteIndex: true },
  },
};

type Scoped = { installId: string; domain: string };

const indexCorpus: Array<Scoped & PublicSiteIndexHit> = [
  {
    installId: INSTALL_A1,
    domain: DOMAIN_A1,
    documentId: INSTALL_A1,
    chunkId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    title: "Marknadsforing",
    canonicalUrl: `https://${DOMAIN_A1}/sv/marknadsforing`,
    pathname: "/sv/marknadsforing",
    locale: "sv",
    excerpt: "Marknadsforing",
    chunkContent:
      "Marknadsforing beskriver publika erbjudanden. Marknadsforing pa webbplatsen ar den publika beskrivningen.",
    score: 80,
    matchedReason: "public_site_index",
    crawledAt: "2026-10-21T00:00:00.000Z",
  },
  {
    installId: INSTALL_A2,
    domain: DOMAIN_A2,
    documentId: INSTALL_A2,
    chunkId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    title: "Butik",
    canonicalUrl: `https://${DOMAIN_A2}/da/butik`,
    pathname: "/da/butik",
    locale: "da",
    excerpt: "Butik",
    chunkContent: "Butikken beskriver offentlige tilbud. Butikken pa webstedet er den offentlige beskrivelse.",
    score: 80,
    matchedReason: "public_site_index",
    crawledAt: "2026-10-21T00:00:00.000Z",
  },
  {
    installId: INSTALL_B1,
    domain: DOMAIN_B1,
    documentId: INSTALL_B1,
    chunkId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    title: "Catalog",
    canonicalUrl: `https://${DOMAIN_B1}/en/catalog`,
    pathname: "/en/catalog",
    locale: "en",
    excerpt: "Catalog",
    chunkContent: "The catalog describes public offers. The catalog on the website is the public description.",
    score: 80,
    matchedReason: "public_site_index",
    crawledAt: "2026-10-21T00:00:00.000Z",
  },
];

const faqCorpus: Array<Scoped & PublicCompanionTenantFaqRow> = [
  {
    installId: INSTALL_A1,
    domain: DOMAIN_A1,
    item_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    title: "Marknadsforing",
    answer: "FAQ-A1 Marknadsforing beskriver publika erbjudanden pa den har webbplatsen.",
    category: "public",
    content_type: "faq",
    locale: "sv",
    source_url: `https://${DOMAIN_A1}/sv/marknadsforing`,
    score: 90,
    matched_reason: "faq",
  },
  {
    installId: INSTALL_A2,
    domain: DOMAIN_A2,
    item_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    title: "Butik",
    answer: "FAQ-A2 Butikken beskriver offentlige tilbud pa dette websted.",
    category: "public",
    content_type: "faq",
    locale: "da",
    source_url: `https://${DOMAIN_A2}/da/butik`,
    score: 90,
    matched_reason: "faq",
  },
];

function scoped<T extends Scoped>(rows: T[], installId: string | null, domain: string | null): T[] {
  return rows.filter((row) => row.installId === installId && row.domain === domain);
}

function loaderShell(path: string, htmlLang: string, dataLocale: string): { shell: string; frames: number } {
  const source = readFileSync(join(root, "public/embed/website-kompis.js"), "utf8");
  const frames: Array<{ src: string }> = [];
  const document = {
    currentScript: {
      getAttribute(name: string) {
        if (name === "data-install-id") return INSTALL_A1;
        if (name === "data-domain") return DOMAIN_A1;
        if (name === "data-locale") return dataLocale;
        if (name === "data-core-origin") return "https://aipify.ai";
        return "";
      },
    },
    documentElement: {
      getAttribute(name: string) {
        return name === "lang" ? htmlLang : "";
      },
      setAttribute() {},
    },
    body: { appendChild(node: { src: string }) { frames.push(node); } },
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    createElement() {
      return {
        style: {},
        src: "",
        contentWindow: { postMessage() {} },
        setAttribute() {},
        addEventListener() {},
      };
    },
  };
  const window = {
    location: { pathname: path, href: `https://${DOMAIN_A1}${path}`, assign() {} },
    history: { pushState() {}, replaceState() {} },
    addEventListener() {},
    setTimeout() { return 0; },
    requestAnimationFrame() { return 0; },
    visualViewport: { addEventListener() {} },
    matchMedia() { return { matches: false, addEventListener() {} }; },
  };
  const context = vm.createContext({
    window,
    document,
    MutationObserver: class { observe() {} disconnect() {} },
    URL,
    URLSearchParams,
    setTimeout() { return 0; },
    clearTimeout() {},
  });
  (context as { window: { window: unknown; document: unknown } }).window.window = window;
  (context as { window: { document: unknown } }).window.document = document;
  vm.runInContext(source, context, { timeout: 2000 });
  vm.runInContext(source, context, { timeout: 2000 });
  const src = frames[0]?.src ?? "";
  const shell = new URL(src, "https://aipify.ai").searchParams.get("locale") ?? "";
  return { shell, frames: frames.length };
}

function assertLocale(page: string, shell: string, content: string, fallback: RegExp) {
  const plan = proposePublicContentLocale({ pageLocale: page, omittedFallback: "no" });
  assert.equal(plan.contentLocale, content, page);
  assert.equal(sanitizeWebsiteKompisEmbedLocale(page), shell, page);
  assert.match(buildWebsiteKompisWarmSafeFallbackCopy(page, null), fallback);
}

assertLocale("se", "sv", "sv", /Jag hittar inte tillräckligt publicerad information/);
assertLocale("sv", "sv", "sv", /Jag hittar inte tillräckligt publicerad information/);
assertLocale("sv-SE", "sv", "sv", /Jag hittar inte/);
assertLocale("dk", "da", "da", /Jeg finder ikke nok offentliggjort information/);
assertLocale("da", "da", "da", /Jeg finder ikke nok offentliggjort information/);
assertLocale("no", "no", "no", /Jeg finner ikke nok publisert informasjon/);
assertLocale("en", "en", "en", /I cannot find enough published information/);
assert.equal(proposePublicContentLocale({ omittedFallback: "no" }).contentLocale, "no");
assert.equal(sanitizeWebsiteKompisEmbedLocale(""), "no");
assert.deepEqual(expandPublicSiteIndexSearchLocales("sv"), ["sv", "se"]);
assert.deepEqual(expandPublicSiteIndexSearchLocales("da"), ["da", "dk"]);
assert.deepEqual(expandPublicSiteIndexSearchLocales("nn"), ["nn"]);
assert.match(buildWebsiteKompisWarmSafeFallbackCopy("pl", null), /I cannot find enough published information/);
assert.match(buildWebsiteKompisWarmSafeFallbackCopy("uk", null), /I cannot find enough published information/);

for (const entry of [
  { path: "/se", html: "se", data: "se", shell: "sv" },
  { path: "/se/marknadsforing", html: "sv", data: "sv", shell: "sv" },
  { path: "/sv", html: "sv", data: "sv", shell: "sv" },
  { path: "/sv-SE", html: "", data: "", shell: "sv" },
  { path: "/dk", html: "dk", data: "dk", shell: "da" },
  { path: "/da", html: "da", data: "da", shell: "da" },
  { path: "/no", html: "no", data: "no", shell: "no" },
  { path: "/en", html: "en", data: "en", shell: "en" },
  { path: "/", html: "", data: "", shell: "no" },
  { path: "/", html: "sv-SE", data: "", shell: "sv" },
]) {
  const loaded = loaderShell(entry.path, entry.html, entry.data);
  assert.equal(loaded.shell, entry.shell, entry.path);
  assert.equal(loaded.frames, 1, entry.path);
}

const active = buildConnectionStatusSummary({
  orgContextState: "ready",
  planName: "Business",
  licenseStatus: "active",
  productEnabled: true,
  canManage: true,
  domainCenterLoaded: true,
  accessDenied: false,
  pendingDomainCount: 0,
  domains: [
    {
      domainId: "domain-a1",
      domain: DOMAIN_A1,
      isPrimary: true,
      domainStatus: "active",
      verificationStatus: "verified",
      licenseStatus: "active",
      hasCustomerBinding: true,
      bindingVerified: true,
      hasInstallId: true,
      installIdMasked: "1111…1111",
    },
    {
      domainId: "domain-a2",
      domain: DOMAIN_A2,
      isPrimary: false,
      domainStatus: "active",
      verificationStatus: "verified",
      licenseStatus: "active",
      hasCustomerBinding: true,
      bindingVerified: true,
      hasInstallId: true,
      installIdMasked: "2222…2222",
    },
  ],
});
assert.equal(active.aggregate, "active");
assert.equal(active.checkpoints.find((item) => item.id === "license")?.state, "ok");
assert.equal(active.checkpoints.find((item) => item.id === "domain")?.state, "ok");
assert.equal(active.checkpoints.find((item) => item.id === "installation")?.state, "ok");
assert.equal(active.checkpoints.find((item) => item.id === "public_runtime")?.state, "unavailable");
assert.equal(active.runtimeLastSeenAvailable, false);
assert.equal(connectionShowsActiveLicenseWithoutPublicView(active), true);

async function main() {
  const { askPublicPlatformCompanion } = await import("@/lib/marketing/public-companion-ask");
  const { recordWebsiteKompisAnswerFeedback } = await import(
    "@/lib/marketing/website-kompis-answer-feedback-server"
  );
  const calls: Array<{ kind: string; installId: string | null; domain: string | null }> = [];

  function options(availability: { available: boolean; reason: "available" | "install_missing" | "license_inactive" }) {
    return {
      rawInstallConfig: installConfig,
      resolveLicensedAvailability: async () => ({
        available: availability.available,
        reason: availability.reason,
        capabilityKey: "website_kompis",
      }),
      searchTenantPublicSiteIndex: async (input: {
        installId?: string | null;
        domain?: string | null;
      }) => {
        const installId = input.installId ?? null;
        const domain = input.domain ?? null;
        calls.push({ kind: "index", installId, domain });
        return scoped(indexCorpus, installId, domain);
      },
      searchTenantVisitorKnowledge: async (input: {
        installId?: string | null;
        domain?: string | null;
      }) => {
        const installId = input.installId ?? null;
        const domain = input.domain ?? null;
        calls.push({ kind: "faq", installId, domain });
        return scoped(faqCorpus, installId, domain);
      },
    };
  }

  const swedish = await askPublicPlatformCompanion(
    {
      question: "Marknadsforing beskriver publika erbjudanden",
      locale: "se",
      installId: INSTALL_A1,
      domain: DOMAIN_A1,
      pageContext: { pathname: "/se/marknadsforing", locale: "se", title: "Marknadsforing", surface: "public" },
    },
    { ...options({ available: true, reason: "available" }), requestHost: DOMAIN_A1 },
  );
  assert.equal(swedish.locale, "sv");
  assert.match(swedish.answer.directAnswer, /Utifrån webbplatsens publika sidor|FAQ-A1/);
  assert.match(swedish.answer.directAnswer, /Marknadsforing/);
  assert.doesNotMatch(swedish.answer.directAnswer, /FAQ-A2|Butikken|catalog/i);
  assert.ok(swedish.sources.every((source) => source.route.includes(DOMAIN_A1)));
  assert.equal(swedish.answer.explanation, "Källa: Marknadsforing.");

  calls.length = 0;
  const danish = await askPublicPlatformCompanion(
    {
      question: "Butikken beskriver offentlige tilbud",
      locale: "dk",
      installId: INSTALL_A2,
      domain: DOMAIN_A2,
      pageContext: { pathname: "/dk/butik", locale: "dk", title: "Butik", surface: "public" },
    },
    { ...options({ available: true, reason: "available" }), requestHost: DOMAIN_A2 },
  );
  assert.equal(danish.locale, "da");
  assert.match(danish.answer.directAnswer, /Butikken/);
  assert.doesNotMatch(danish.answer.directAnswer, /FAQ-A1|Marknadsforing|catalog/i);
  assert.ok(danish.sources.every((source) => source.route.includes(DOMAIN_A2)));
  assert.ok(calls.every((call) => call.installId === INSTALL_A2 && call.domain === DOMAIN_A2));

  calls.length = 0;
  const otherCustomer = await askPublicPlatformCompanion(
    {
      question: "The catalog describes public offers",
      locale: "en",
      installId: INSTALL_B1,
      domain: DOMAIN_B1,
      pageContext: { pathname: "/en/catalog", locale: "en", title: "Catalog", surface: "public" },
    },
    { ...options({ available: true, reason: "available" }), requestHost: DOMAIN_B1 },
  );
  assert.equal(otherCustomer.locale, "en");
  assert.match(otherCustomer.answer.directAnswer, /catalog/i);
  assert.doesNotMatch(otherCustomer.answer.directAnswer, /Marknadsforing|Butikken|FAQ-A/);
  assert.ok(otherCustomer.sources.every((source) => source.route.includes(DOMAIN_B1)));

  calls.length = 0;
  const wrongDomain = await askPublicPlatformCompanion(
    {
      question: "Marknadsforing beskriver publika erbjudanden",
      locale: "se",
      installId: INSTALL_A1,
      domain: DOMAIN_A2,
      pageContext: { pathname: "/se/marknadsforing", locale: "se", title: "Marknadsforing", surface: "public" },
    },
    { ...options({ available: true, reason: "available" }), requestHost: DOMAIN_A2 },
  );
  assert.equal(wrongDomain.locale, "sv");
  assert.match(wrongDomain.answer.directAnswer, /Jag hittar inte tillräckligt publicerad information/);
  assert.equal(wrongDomain.sources.length, 0);
  assert.doesNotMatch(wrongDomain.answer.directAnswer, /Butikken|FAQ-A2/);

  calls.length = 0;
  const missingInstall = await askPublicPlatformCompanion(
    {
      question: "Marknadsforing beskriver publika erbjudanden",
      locale: "sv",
      domain: DOMAIN_A1,
      pageContext: { pathname: "/sv/marknadsforing", locale: "sv", title: "Marknadsforing", surface: "public" },
    },
    { ...options({ available: false, reason: "install_missing" }), requestHost: DOMAIN_A1 },
  );
  assert.match(missingInstall.answer.directAnswer, /tillfälligt otillgänglig/);
  assert.equal(calls.length, 0);

  calls.length = 0;
  const rejected = await askPublicPlatformCompanion(
    {
      question: "Marknadsforing beskriver publika erbjudanden",
      locale: "sv",
      installId: INSTALL_A1,
      domain: DOMAIN_A1,
      pageContext: { pathname: "/sv/marknadsforing", locale: "sv", title: "Marknadsforing", surface: "public" },
    },
    { ...options({ available: false, reason: "license_inactive" }), requestHost: DOMAIN_A1 },
  );
  assert.match(rejected.answer.directAnswer, /tillfälligt otillgänglig/);
  assert.equal(calls.length, 0);

  const answers = new Map<string, { installId: string; domain: string }>([
    ["answer-a1", { installId: INSTALL_A1, domain: DOMAIN_A1 }],
  ]);
  const admin = {
    rpc: async (_name: string, args: Record<string, unknown>) => {
      const bound = answers.get(String(args.p_answer_id));
      if (!bound) return { data: { ok: false, error: "answer_not_found" }, error: null };
      if (bound.installId !== args.p_install_id || bound.domain !== args.p_domain) {
        return { data: { ok: false, error: "tenant_mismatch" }, error: null };
      }
      return { data: { ok: true, feedback_id: "feedback-a1", vote: args.p_vote }, error: null };
    },
  };
  const saved = await recordWebsiteKompisAnswerFeedback(admin as unknown as SupabaseClient, {
    answerId: "answer-a1",
    installId: INSTALL_A1,
    domain: DOMAIN_A1,
    vote: "helpful",
    visitorKeyRaw: "synthetic-visitor",
  });
  assert.equal(saved.ok, true);
  const foreign = await recordWebsiteKompisAnswerFeedback(admin as unknown as SupabaseClient, {
    answerId: "answer-a1",
    installId: INSTALL_B1,
    domain: DOMAIN_B1,
    vote: "helpful",
    visitorKeyRaw: "synthetic-visitor",
  });
  assert.equal(foreign.ok, false);
  if (!foreign.ok) assert.equal(foreign.code, "tenant_mismatch");

  console.log("website-kompis standard customer contract: passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
