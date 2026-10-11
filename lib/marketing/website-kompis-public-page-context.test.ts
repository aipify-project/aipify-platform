import assert from "node:assert/strict";
import {
  collectWebsiteKompisEmbedParentPageContext,
  isCustomerWebsitePageIntentQuestion,
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

assert.equal(isCustomerWebsitePageIntentQuestion("Hvilke fordeler får jeg her?"), true);

const deicticPageAnswer = tryBuildWebsiteKompisCurrentPublicPageAnswer({
  question: "Hvilke fordeler får jeg her?",
  pageContext: {
    pathname: "/medlemskap",
    title: "Medlemskap og fordeler",
    metaDescription: "Se fordeler med medlemskap.",
    surface: "public",
    textSnippets: ["Som medlem får du eksklusive fordeler og rabatter."],
  },
  locale: "no",
});
assert.ok(deicticPageAnswer);
assert.equal(deicticPageAnswer!.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);

const collected = collectWebsiteKompisEmbedParentPageContext({
  location: { pathname: "/services", href: "https://example-a.com/services" },
  locale: "no",
  document: {
    title: "Tjenester",
    querySelector(selector: string) {
      if (selector === 'meta[name="description"]') {
        return { getAttribute: () => "Vi tilbyr tjenester for bedrifter." };
      }
      if (selector === 'link[rel="canonical"]') {
        return { getAttribute: () => "https://example-a.com/services" };
      }
      return null;
    },
    querySelectorAll(selector: string) {
      if (selector === "h1, h2") {
        return [{ tagName: "H1", textContent: "Våre tjenester", closest: () => null }];
      }
      if (selector === "main p, article p, [role='main'] p, body > p") {
        return [
          {
            textContent: "Vi hjelper bedrifter med rådgivning og implementering.",
            closest: () => null,
          },
        ];
      }
      return [];
    },
  },
});
assert.ok(collected);
assert.equal(collected?.surface, "public");
assert.equal(collected?.title, "Tjenester");
assert.equal(collected?.headings?.[0]?.text, "Våre tjenester");

assert.equal(
  collectWebsiteKompisEmbedParentPageContext({
    location: { pathname: "/admin/users" },
    document: { title: "Admin", querySelector: () => null, querySelectorAll: () => [] },
  }),
  undefined,
);

// Neutral FAQ/accordion fixtures (other domain/topic than owner acceptance cases).
const OPEN_DETAILS_SELECTOR =
  "main details[open], article details[open], [role='main'] details[open], [class*='faq'] details[open], [class*='Faq'] details[open], [class*='accordion'] details[open], section details[open]";
const EXPANDED_CONTROL_SELECTOR =
  "main [aria-expanded='true'], article [aria-expanded='true'], [role='main'] [aria-expanded='true'], [class*='faq'] [aria-expanded='true'], [class*='Faq'] [aria-expanded='true'], [class*='accordion'] [aria-expanded='true'], section [aria-expanded='true']";
const ANSWER_PANEL_SELECTOR =
  "main [class*='faq-answer'], main [class*='FaqAnswer'], article [class*='faq-answer'], article [class*='FaqAnswer'], [role='main'] [class*='faq-answer'], [class*='faq'] [class*='faq-answer'], [class*='Faq'] [class*='faq-answer'], [class*='faq'] [class*='FaqAnswer'], section [class*='faq-answer'], section [class*='FaqAnswer'], main [class*='accordion-panel'], article [class*='accordion-panel'], [role='main'] [class*='accordion-panel'], [class*='accordion'] [class*='accordion-panel'], section [class*='accordion-panel']";
const ALL_ARIA_EXPANDED_SELECTOR =
  "main [aria-expanded], article [aria-expanded], [role='main'] [aria-expanded], [class*='faq'] [aria-expanded], [class*='Faq'] [aria-expanded], [class*='accordion'] [aria-expanded], section [aria-expanded]";
const PRODUCT_SELECTOR =
  "main [class*='product'], main [class*='Product'], main [class*='offer'], main [data-product], main article, [role='main'] article, main li";
const PARAGRAPH_SELECTOR = "main p, article p, [role='main'] p, body > p";

function makeClosest(matches: Record<string, unknown>) {
  return (selector: string) => {
    const parts = selector.split(",").map((part) => part.trim());
    for (const part of parts) {
      if (part in matches) return matches[part];
    }
    return null;
  };
}

const openDetailsSummary = {
  textContent: "How do workshop bookings work?",
};
const openDetails = {
  tagName: "DETAILS",
  open: true,
  getAttribute: (name: string) => (name === "open" ? "" : null),
  querySelector: (selector: string) => (selector === "summary" ? openDetailsSummary : null),
  textContent:
    "How do workshop bookings work? Bookings open each Monday. Bring a photo ID and arrive 10 minutes early.",
  closest: makeClosest({}),
};
const closedDetails = {
  tagName: "DETAILS",
  open: false,
  getAttribute: () => null,
  querySelector: (selector: string) =>
    selector === "summary" ? { textContent: "Hidden refund policy details" } : null,
  textContent: "Hidden refund policy details Secret refund clause must not leak.",
  closest: makeClosest({}),
};
const expandedButton = {
  tagName: "BUTTON",
  textContent: "What languages are supported?",
  getAttribute: (name: string) => {
    if (name === "aria-expanded") return "true";
    if (name === "aria-controls") return "lang-panel";
    return null;
  },
  closest: makeClosest({}),
  nextElementSibling: null as { textContent?: string } | null,
};
const expandedPanel = {
  id: "lang-panel",
  tagName: "DIV",
  role: "region",
  className: "accordion-panel",
  getAttribute: (name: string) => {
    if (name === "role") return "region";
    if (name === "id") return "lang-panel";
    return null;
  },
  textContent: "Support covers English, Norwegian, Swedish, and Danish help pages.",
  closest: makeClosest({}),
  style: {},
};
expandedButton.nextElementSibling = expandedPanel;

const collapsedButton = {
  tagName: "BUTTON",
  textContent: "Closed shipping FAQ",
  getAttribute: (name: string) => {
    if (name === "aria-expanded") return "false";
    if (name === "aria-controls") return "ship-panel";
    return null;
  },
  closest: makeClosest({}),
};
const collapsedPanel = {
  id: "ship-panel",
  tagName: "DIV",
  className: "faq-answer",
  getAttribute: (name: string) => {
    if (name === "id") return "ship-panel";
    if (name === "aria-hidden") return "true";
    return null;
  },
  textContent: "Overnight courier options are listed only when this panel is open.",
  closest: makeClosest({ "[aria-hidden='true']": true, "[hidden], [aria-hidden='true']": true }),
  style: { display: "none" },
  hidden: false,
};

const visibleFaqAnswer = {
  id: "hours-panel",
  tagName: "DIV",
  className: "faq-answer",
  getAttribute: (name: string) => (name === "id" ? "hours-panel" : null),
  textContent: "Visitor desk hours: weekdays 09:00-17:00. Weekend visits need a prior appointment.",
  closest: makeClosest({}),
  style: {},
};
const hoursButton = {
  tagName: "BUTTON",
  textContent: "When is the visitor desk open?",
  getAttribute: (name: string) => {
    if (name === "aria-expanded") return "true";
    if (name === "aria-controls") return "hours-panel";
    return null;
  },
  closest: makeClosest({}),
  nextElementSibling: visibleFaqAnswer,
};

const paragraphInsideOpenDetails = {
  textContent: "Bookings open each Monday. Bring a photo ID and arrive 10 minutes early.",
  closest: (selector: string) => {
    if (selector.includes("details")) return openDetails;
    if (selector.includes("form")) return null;
    return null;
  },
};

const introParagraph = {
  textContent: "This help center explains workshop logistics for partner venues.",
  closest: () => null,
};

const formInputLeak = {
  tagName: "INPUT",
  textContent: "",
  closest: makeClosest({ form: true, "form, input, textarea, select, button, script, style, noscript": true }),
};

const faqDocument = {
  title: "Partner venue help",
  getElementById(id: string) {
    if (id === "lang-panel") return expandedPanel;
    if (id === "ship-panel") return collapsedPanel;
    if (id === "hours-panel") return visibleFaqAnswer;
    return null;
  },
  querySelector(selector: string) {
    if (selector === 'meta[name="description"]') {
      return { getAttribute: () => "Partner venue logistics and desk hours." };
    }
    if (selector === 'link[rel="canonical"]') {
      return { getAttribute: () => "https://partner-help.example/venue-faq" };
    }
    return null;
  },
  querySelectorAll(selector: string) {
    if (selector === "h1, h2") {
      return [{ tagName: "H1", textContent: "Partner venue help", closest: () => null }];
    }
    if (selector === OPEN_DETAILS_SELECTOR) return [openDetails];
    if (selector === EXPANDED_CONTROL_SELECTOR) return [expandedButton, hoursButton];
    if (selector === ANSWER_PANEL_SELECTOR) return [expandedPanel, collapsedPanel, visibleFaqAnswer];
    if (selector === ALL_ARIA_EXPANDED_SELECTOR) return [expandedButton, collapsedButton, hoursButton];
    if (selector === PRODUCT_SELECTOR) return [];
    if (selector === PARAGRAPH_SELECTOR) return [introParagraph, paragraphInsideOpenDetails];
    if (selector.includes("form") || selector.includes("input")) return [formInputLeak];
    return [];
  },
};

const faqCollected = collectWebsiteKompisEmbedParentPageContext({
  location: { pathname: "/venue-faq", href: "https://partner-help.example/venue-faq" },
  locale: "en",
  document: faqDocument,
});
assert.ok(faqCollected);
assert.ok(faqCollected?.textSnippets?.some((snippet) => /workshop bookings/i.test(snippet)));
assert.ok(faqCollected?.textSnippets?.some((snippet) => /Bookings open each Monday/i.test(snippet)));
assert.ok(faqCollected?.textSnippets?.some((snippet) => /English, Norwegian, Swedish/i.test(snippet)));
assert.ok(faqCollected?.textSnippets?.some((snippet) => /Visitor desk hours/i.test(snippet)));
assert.ok(faqCollected?.textSnippets?.every((snippet) => !/Secret refund clause/i.test(snippet)));
assert.ok(faqCollected?.textSnippets?.every((snippet) => !/Overnight courier/i.test(snippet)));
// Paragraph inside open details must not duplicate the already-captured answer body.
const mondayMatches =
  faqCollected?.textSnippets?.filter((snippet) => /Bookings open each Monday/i.test(snippet)) ?? [];
assert.equal(mondayMatches.length, 1);
assert.ok((faqCollected?.textSnippets?.length ?? 0) <= 8);
assert.ok((faqCollected?.textSnippets ?? []).every((snippet) => snippet.length <= 240));

const manyOpenPanels = Array.from({ length: 12 }, (_, index) => ({
  tagName: "DETAILS",
  open: true,
  getAttribute: (name: string) => (name === "open" ? "" : null),
  querySelector: (sel: string) =>
    sel === "summary" ? { textContent: `Topic ${index + 1} question for partners` } : null,
  textContent: `Topic ${index + 1} question for partners Answer body ${index + 1} explains a distinct operational step with enough length.`,
  closest: makeClosest({}),
}));
const cappedFaq = collectWebsiteKompisEmbedParentPageContext({
  location: { pathname: "/ops-faq" },
  locale: "en",
  document: {
    title: "Ops FAQ",
    querySelector: () => null,
    querySelectorAll(selector: string) {
      if (selector === "h1, h2") return [];
      if (selector === OPEN_DETAILS_SELECTOR) return manyOpenPanels;
      if (selector === EXPANDED_CONTROL_SELECTOR) return [];
      if (selector === ANSWER_PANEL_SELECTOR) return [];
      if (selector === PRODUCT_SELECTOR) return [];
      if (selector === PARAGRAPH_SELECTOR) return [];
      return [];
    },
  },
});
assert.ok(cappedFaq);
assert.equal(cappedFaq?.textSnippets?.length, 8);

const pricedOnly = collectWebsiteKompisEmbedParentPageContext({
  location: { pathname: "/pricing" },
  locale: "pl",
  document: {
    title: "Cennik usług",
    querySelector: () => null,
    querySelectorAll(selector: string) {
      if (selector === "h1, h2") {
        return [{ tagName: "H1", textContent: "Cennik usług", closest: () => null }];
      }
      if (selector === OPEN_DETAILS_SELECTOR) return [];
      if (selector === EXPANDED_CONTROL_SELECTOR) return [];
      if (selector === ANSWER_PANEL_SELECTOR) return [];
      if (selector === PRODUCT_SELECTOR) {
        return [
          {
            textContent: "Pakiet startowy 199 kr miesięcznie z podstawowym wsparciem.",
            closest: () => null,
          },
        ];
      }
      if (selector === PARAGRAPH_SELECTOR) {
        return [
          {
            textContent: "Transparentny cennik dla zespołów w całej Europie Środkowej.",
            closest: () => null,
          },
        ];
      }
      return [];
    },
  },
});
assert.ok(pricedOnly?.textSnippets?.some((snippet) => /199 kr/i.test(snippet)));
assert.ok(pricedOnly?.textSnippets?.some((snippet) => /Transparentny cennik/i.test(snippet)));

// FAQ section outside <main> (common help layouts) — still capture open answer panels.
const sectionFaqButton = {
  tagName: "BUTTON",
  textContent: "How are desk passes issued?",
  getAttribute: (name: string) => {
    if (name === "aria-expanded") return "true";
    if (name === "aria-controls") return "desk-pass-panel";
    return null;
  },
  closest: makeClosest({}),
  nextElementSibling: null as { textContent?: string; id?: string } | null,
};
const sectionFaqPanel = {
  id: "desk-pass-panel",
  tagName: "DIV",
  className: "faq-answer",
  getAttribute: (name: string) => (name === "id" ? "desk-pass-panel" : null),
  textContent:
    "Desk passes are issued at reception after photo ID verification on weekdays before 16:00.",
  closest: makeClosest({}),
  style: {},
};
sectionFaqButton.nextElementSibling = sectionFaqPanel;

const sectionFaqCollected = collectWebsiteKompisEmbedParentPageContext({
  location: { pathname: "/help/desk-passes" },
  locale: "en",
  document: {
    title: "Desk pass help",
    getElementById: (id: string) => (id === "desk-pass-panel" ? sectionFaqPanel : null),
    querySelector: () => null,
    querySelectorAll(selector: string) {
      if (selector === "h1, h2") return [];
      if (selector === OPEN_DETAILS_SELECTOR) return [];
      if (selector === EXPANDED_CONTROL_SELECTOR) return [sectionFaqButton];
      if (selector === ANSWER_PANEL_SELECTOR) return [sectionFaqPanel];
      if (selector === ALL_ARIA_EXPANDED_SELECTOR) return [sectionFaqButton];
      if (selector === PRODUCT_SELECTOR) return [];
      if (selector === PARAGRAPH_SELECTOR) return [];
      return [];
    },
  },
});
assert.ok(sectionFaqCollected?.textSnippets?.some((snippet) => /photo ID verification/i.test(snippet)));

console.log("website-kompis-public-page-context.test.ts: all assertions passed");
