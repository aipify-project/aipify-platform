import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import daMarketing from "../../locales/da/marketing.json";
import enMarketing from "../../locales/en/marketing.json";
import esMarketing from "../../locales/es/marketing.json";
import noMarketing from "../../locales/no/marketing.json";
import plMarketing from "../../locales/pl/marketing.json";
import svMarketing from "../../locales/sv/marketing.json";
import ukMarketing from "../../locales/uk/marketing.json";
import { parseKompisWebSalesLabels } from "./kompis-web-sales/labels";
import {
  PUBLIC_AIPIFY_HOME_HREF,
  resolvePublicSafeBackHref,
  shouldUseHistoryBack,
} from "./public-safe-back";

const root = process.cwd();

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

assert.equal(resolvePublicSafeBackHref(), PUBLIC_AIPIFY_HOME_HREF);
assert.equal(resolvePublicSafeBackHref({ fallbackHref: "/contact/support" }), "/contact/support");
assert.equal(resolvePublicSafeBackHref({ fallbackHref: "https://evil.example" }), PUBLIC_AIPIFY_HOME_HREF);
assert.equal(resolvePublicSafeBackHref({ fallbackHref: "//evil.example" }), PUBLIC_AIPIFY_HOME_HREF);

assert.equal(
  shouldUseHistoryBack({
    referrer: "https://aipify.ai/",
    currentOrigin: "https://aipify.ai",
    historyLength: 3,
  }),
  true,
);
assert.equal(
  shouldUseHistoryBack({
    referrer: "https://evil.example/",
    currentOrigin: "https://aipify.ai",
    historyLength: 3,
  }),
  false,
);
assert.equal(
  shouldUseHistoryBack({
    referrer: "https://aipify.ai/",
    currentOrigin: "https://aipify.ai",
    historyLength: 1,
  }),
  false,
);

const localeBundles = [
  ["en", enMarketing],
  ["es", esMarketing],
  ["no", noMarketing],
  ["sv", svMarketing],
  ["da", daMarketing],
  ["pl", plMarketing],
  ["uk", ukMarketing],
] as const;

for (const [locale, marketing] of localeBundles) {
  const labels = parseKompisWebSalesLabels(marketing as Record<string, unknown>);
  assert.equal(
    labels.footer.tagline,
    "Aipify works for you",
    `${locale}: general footer must be Aipify brand only`,
  );
  assert.doesNotMatch(
    labels.footer.tagline,
    /Kompis|Buddy/i,
    `${locale}: general footer must not name the product helper`,
  );
  assert.ok(labels.start.back.length > 0, `${locale}: start.back required`);
  assert.doesNotMatch(
    labels.start.back,
    /Kompis|Buddy/i,
    `${locale}: general Back label must not name the product`,
  );
}

const contact = read("app/(kompis-sales)/contact/support/page.tsx");
assert.match(contact, /PublicSafeBackLink/);
assert.match(contact, /start\.back/);
assert.doesNotMatch(contact, /start\.backHome/);
assert.match(contact, /appName/);

const csp = read("app/(kompis-sales)/certified-sales-partner/page.tsx");
assert.match(csp, /PublicSafeBackLink/);
assert.match(csp, /start\.back/);
assert.doesNotMatch(csp, /start\.backHome/);

for (const rel of [
  "app/(kompis-sales)/privacy/page.tsx",
  "app/(kompis-sales)/terms/page.tsx",
  "app/(kompis-sales)/certified-sales-partner/page.tsx",
  "app/(kompis-sales)/contact/support/page.tsx",
]) {
  const src = read(rel);
  assert.match(src, /KompisWebSalesChrome|KompisWebLegalShell/, `${rel} keeps sales chrome`);
  assert.doesNotMatch(src, /Back to Kompis Web|Tilbake til Kompis Web/);
}

const chrome = read("components/marketing/kompis-web-sales/KompisWebSalesChrome.tsx");
assert.match(chrome, /labels\.footer\.tagline/);

const startPage = read("components/marketing/kompis-web-sales/KompisWebStartPage.tsx");
assert.match(startPage, /backHome/, "product start page may keep product backHome");

console.log("public-brand-shell-correction: PASS");
