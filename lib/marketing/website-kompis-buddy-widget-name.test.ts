/**
 * Owner freeze exception: user-facing Website Kompis / Buddy names in the public visitor widget.
 * Nordic (no/sv/da): Kompis · Website Kompis
 * Non-Nordic embed locales (en/pl/uk) + English fallback: Buddy · Website Buddy
 * ES and other unsupported host locales resolve through English Buddy shell.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  kompisFamilyName,
  kompisProductDisplayName,
} from "@/lib/brand/kompis-buddy-display";
import { resolveWebsiteKompisEmbedUiLabels } from "@/lib/marketing/website-kompis-visitor-tone";

const NORDIC = ["no", "sv", "da"] as const;
const BUDDY = ["en", "pl", "uk"] as const;

for (const locale of NORDIC) {
  const labels = resolveWebsiteKompisEmbedUiLabels({
    locale,
    welcomeMessageVariant: "standard",
  });
  assert.equal(labels.productName, "Kompis", locale);
  assert.equal(labels.title, "Website Kompis", locale);
  assert.match(labels.open, /Kompis/);
  assert.doesNotMatch(labels.open, /Buddy/);
  assert.equal(labels.productName, kompisFamilyName(locale));
  assert.equal(labels.title, kompisProductDisplayName("website_kompis", locale));
}

for (const locale of BUDDY) {
  const labels = resolveWebsiteKompisEmbedUiLabels({
    locale,
    welcomeMessageVariant: "standard",
  });
  assert.equal(labels.productName, "Buddy", locale);
  assert.equal(labels.title, "Website Buddy", locale);
  assert.match(labels.open, /Buddy/);
  assert.doesNotMatch(`${labels.productName} ${labels.title} ${labels.open}`, /\bKompis\b/);
  assert.equal(labels.productName, kompisFamilyName(locale));
  assert.equal(labels.title, kompisProductDisplayName("website_kompis", locale));
}

/** Brand contract: Spanish (and other non-Nordic) → Buddy. */
assert.equal(kompisFamilyName("es"), "Buddy");
assert.equal(kompisProductDisplayName("website_kompis", "es"), "Website Buddy");

const loader = readFileSync(join(process.cwd(), "public/embed/website-kompis.js"), "utf8");
assert.match(loader, /Website Buddy/);
assert.match(loader, /Website Kompis/);
assert.match(loader, /websiteKompisIframeProductTitle/);

const installConfig = readFileSync(
  join(process.cwd(), "lib/marketing/website-kompis-install-config.ts"),
  "utf8",
);
assert.match(installConfig, /Website Buddy is temporarily unavailable/);
assert.match(installConfig, /Website Kompis er midlertidig utilgjengelig/);
assert.match(installConfig, /isNordicKompisLocale\(locale\) \? "Website Kompis" : "Website Buddy"/);

console.log(
  "website-kompis-buddy-widget-name: PASS",
  `nordic=${NORDIC.join(",")}`,
  `buddy=${BUDDY.join(",")}`,
  "es→Buddy",
);
