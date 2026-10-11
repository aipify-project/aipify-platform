import assert from "node:assert/strict";
import { pickWebsiteKompisPublicContactHref } from "@/lib/marketing/website-kompis-public-contact";

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

console.log("website-kompis-public-contact.test.ts: all assertions passed");
