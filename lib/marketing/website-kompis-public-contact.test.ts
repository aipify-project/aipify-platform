import assert from "node:assert/strict";
import {
  evaluateWebsiteKompisPublicContactHrefFromIndex,
  pickWebsiteKompisPublicContactHref,
  pickWebsiteKompisPublicContactHrefFromIndex,
} from "@/lib/marketing/website-kompis-public-contact";

assert.equal(
  pickWebsiteKompisPublicContactHref(
    [
      {
        title: "Hours",
        content_type: "opening_hours",
        source_url: "https://customer.example/hours",
      },
      {
        title: "Contact us",
        content_type: "contact",
        source_url: "https://customer.example/kontakt",
        score: 40,
      },
    ],
    "customer.example",
  ),
  "https://customer.example/kontakt",
);

assert.equal(
  pickWebsiteKompisPublicContactHref(
    [
      {
        title: "Support",
        content_type: "faq",
        source_url: "/kontakt",
        score: 80,
      },
    ],
    "customer.example",
  ),
  "/kontakt",
);

assert.equal(
  pickWebsiteKompisPublicContactHref(
    [
      {
        title: "Contact",
        content_type: "contact",
        source_url: "https://evil.example/kontakt",
      },
    ],
    "customer.example",
  ),
  null,
);

assert.equal(
  pickWebsiteKompisPublicContactHref(
    [
      {
        title: "Membership",
        content_type: "faq",
        source_url: "https://customer.example/membership",
      },
    ],
    "customer.example",
  ),
  null,
);

assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "About",
        pathname: "/about",
        canonicalUrl: "https://customer.example/about",
        score: 90,
      },
      {
        title: "Kontakt oss",
        pathname: "/kontakt",
        canonicalUrl: "https://customer.example/kontakt",
        score: 40,
      },
    ],
    "customer.example",
  ),
  "https://customer.example/kontakt",
);

assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "Membership guide",
        pathname: "/no/membership-guide",
        canonicalUrl: "https://customer.example/no/membership-guide",
        score: 88,
      },
    ],
    "customer.example",
  ),
  null,
);

assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "Support",
        pathname: "/help/support",
        canonicalUrl: "https://evil.example/help/support",
        score: 70,
      },
    ],
    "customer.example",
  ),
  null,
);

assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "Kundeservice",
        pathname: "/no/kunde-service",
        canonicalUrl: "https://customer.example/no/kunde-service",
        score: 55,
      },
    ],
    "customer.example",
  ),
  "https://customer.example/no/kunde-service",
);

assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "Kundeservice",
        pathname: "/no/customer-service",
        canonicalUrl: "https://customer.example/no/customer-service",
        score: 35,
      },
    ],
    "customer.example",
  ),
  "https://customer.example/no/customer-service",
);

// Index-only contact page without FAQ source_url — title + path.
assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "Kontakt oss",
        pathname: "/no/kontakt-oss",
        canonicalUrl: "https://customer-b.example/no/kontakt-oss",
        excerpt: "Send oss en melding via kontaktskjemaet.",
        score: 22,
      },
    ],
    "customer-b.example",
  ),
  "https://customer-b.example/no/kontakt-oss",
);

// Form evidence on a public page with non-contact path but contact title.
assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "Skriv til oss",
        pathname: "/no/info/reach-out",
        canonicalUrl: "https://customer.example/no/info/reach-out",
        excerpt: "Bruk kontaktskjemaet nedenfor for å ta kontakt.",
        score: 18,
      },
    ],
    "customer.example",
  ),
  "https://customer.example/no/info/reach-out",
);

// Private path rejected even with contact title.
assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "Kontakt support",
        pathname: "/member/kontakt",
        canonicalUrl: "https://customer.example/member/kontakt",
        score: 99,
      },
    ],
    "customer.example",
  ),
  null,
);

// Deterministic tier: path contact beats higher-scoring about page.
const multi = evaluateWebsiteKompisPublicContactHrefFromIndex(
  [
    {
      title: "Om oss",
      pathname: "/no/about",
      canonicalUrl: "https://customer.example/no/about",
      excerpt: "Vi elsker å hjelpe medlemmer.",
      score: 95,
    },
    {
      title: "Support tiers",
      pathname: "/no/pricing",
      canonicalUrl: "https://customer.example/no/pricing",
      score: 80,
    },
    {
      title: "Kontakt",
      pathname: "/no/kontakt",
      canonicalUrl: "https://customer.example/no/kontakt",
      excerpt: "Kontaktskjema for publikum.",
      score: 12,
    },
  ],
  "customer.example",
);
assert.equal(multi.href, "https://customer.example/no/kontakt");
assert.equal(multi.selected?.tier, 0);
assert.equal(multi.selected?.pathname, "/no/kontakt");
// Higher-scoring non-contact pages are sorted after tier-0 and never selected.
assert.doesNotMatch(multi.selected?.canonicalUrl ?? "", /about|pricing/);

// Second tenant shape: /en/contact-us
assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "Get in touch",
        pathname: "/en/contact-us",
        canonicalUrl: "https://tenant-two.example/en/contact-us",
        score: 30,
      },
    ],
    "tenant-two.example",
  ),
  "https://tenant-two.example/en/contact-us",
);

// http rejected (HTTPS required for absolute URLs)
assert.equal(
  pickWebsiteKompisPublicContactHrefFromIndex(
    [
      {
        title: "Contact",
        pathname: "/contact",
        canonicalUrl: "http://customer.example/contact",
        score: 50,
      },
    ],
    "customer.example",
  ),
  null,
);

console.log("website-kompis-public-contact.test.ts: all assertions passed");
