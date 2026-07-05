import assert from "node:assert/strict";
import {
  isPrivateWebsiteKompisPathname,
  sanitizeWebsiteKompisPublicPageContext,
  scoreWebsiteKompisPublicPageContextMatch,
  tryBuildWebsiteKompisCurrentPublicPageAnswer,
  WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE,
} from "@/lib/marketing/website-kompis-public-page-context";

assert.throws(
  () =>
    sanitizeWebsiteKompisPublicPageContext({
      pathname: "/about",
      pageHtml: "<p>unsafe</p>",
    }),
  /Forbidden pageContext field: pageHtml/,
);

assert.throws(
  () =>
    sanitizeWebsiteKompisPublicPageContext({
      pathname: "about",
      surface: "public",
    }),
  /pathname must start with \//,
);

const sanitized = sanitizeWebsiteKompisPublicPageContext({
  pathname: "/services/consulting",
  title: "  Consulting <strong>Services</strong>  ",
  metaDescription: "We offer consulting for teams.",
  canonicalUrl: "https://example-a.com/services/consulting",
  locale: "en",
  surface: "public",
  headings: [
    { level: 1, text: "Consulting Services" },
    { level: 2, text: "How we help" },
    { level: 9, text: "ignored" },
  ],
  textSnippets: ["Book a discovery call.", "Contact us at support@example-a.com for details."],
  structuredDataSummary: ['{"@type":"Service","name":"Consulting"}'],
  capturedAt: "2026-07-05T12:00:00.000Z",
});

assert.ok(sanitized);
assert.equal(sanitized?.surface, "public");
assert.equal(sanitized?.title, "Consulting Services");
assert.equal(sanitized?.headings?.length, 2);
assert.equal(sanitized?.textSnippets?.[1]?.includes("support@"), false);
assert.equal(isPrivateWebsiteKompisPathname("/admin/users"), true);
assert.equal(isPrivateWebsiteKompisPathname("/about"), false);

assert.equal(
  sanitizeWebsiteKompisPublicPageContext({
    pathname: "/profile/settings",
    title: "Private profile",
    surface: "public",
  }),
  undefined,
);

assert.equal(
  sanitizeWebsiteKompisPublicPageContext({
    pathname: "/about",
    surface: "app",
  }),
  undefined,
);

const manyHeadings = Array.from({ length: 20 }, (_, index) => ({
  level: 2 as const,
  text: `Heading ${index}`,
}));
const capped = sanitizeWebsiteKompisPublicPageContext({
  pathname: "/about",
  surface: "public",
  headings: manyHeadings,
});
assert.equal(capped?.headings?.length, 12);

const score = scoreWebsiteKompisPublicPageContextMatch(
  "Tell me about consulting services",
  sanitized!,
);
assert.ok(score >= 4);

const pageAnswer = tryBuildWebsiteKompisCurrentPublicPageAnswer({
  question: "What is this page about?",
  pageContext: sanitized,
  locale: "en",
});
assert.ok(pageAnswer);
assert.match(pageAnswer!.answer.directAnswer, /consulting/i);
assert.equal(pageAnswer!.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);
assert.equal(pageAnswer!.sources[0]?.title, "Consulting Services");

const weakMatch = tryBuildWebsiteKompisCurrentPublicPageAnswer({
  question: "What is the weather today?",
  pageContext: sanitized,
  locale: "en",
});
assert.equal(weakMatch, null);

console.log("website-kompis-public-page-context.test.ts: all assertions passed");
