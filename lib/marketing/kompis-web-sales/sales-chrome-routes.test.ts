import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

const salesSupport = "app/(kompis-sales)/contact/support/page.tsx";
const salesCsp = "app/(kompis-sales)/certified-sales-partner/page.tsx";
const salesPrivacy = "app/(kompis-sales)/privacy/page.tsx";
const salesTerms = "app/(kompis-sales)/terms/page.tsx";
const chrome = "components/marketing/kompis-web-sales/KompisWebSalesChrome.tsx";

assert.ok(existsSync(join(root, salesSupport)), "contact/support must live under (kompis-sales)");
assert.ok(existsSync(join(root, salesCsp)), "certified-sales-partner must live under (kompis-sales)");
assert.equal(
  existsSync(join(root, "app/(marketing)/contact/support/page.tsx")),
  false,
  "marketing contact/support must not remount mega-nav",
);
assert.equal(
  existsSync(join(root, "app/(marketing)/certified-sales-partner/page.tsx")),
  false,
  "marketing certified-sales-partner must not remount mega-nav",
);

for (const rel of [salesSupport, salesCsp, salesPrivacy, salesTerms]) {
  const src = read(rel);
  assert.match(src, /KompisWebSalesChrome|KompisWebLegalShell/, `${rel} must use sales chrome`);
  assert.doesNotMatch(src, /MarketingNavbar/, `${rel} must not import MarketingNavbar`);
  assert.doesNotMatch(src, /MarketingFooter/, `${rel} must not import MarketingFooter`);
}

const supportSrc = read(salesSupport);
assert.match(supportSrc, /PublicSafeBackLink/, "contact/support uses safe back");
assert.match(supportSrc, /start\.back/, "contact/support uses localized Back");
assert.doesNotMatch(supportSrc, /start\.backHome/, "contact/support must not say Back to Kompis Web");

const cspSrc = read(salesCsp);
assert.match(cspSrc, /PublicSafeBackLink/, "partner apply uses safe back");
assert.match(cspSrc, /start\.back/, "partner apply uses localized Back");
assert.doesNotMatch(cspSrc, /start\.backHome/, "partner apply must not say Back to Kompis Web");

const chromeSrc = read(chrome);
assert.match(chromeSrc, /kompis-web-sales-nav/);
assert.match(chromeSrc, /becomeSeller/);
assert.doesNotMatch(chromeSrc, /from ["']@\/components\/marketing\/MarketingNavbar["']/);
assert.doesNotMatch(chromeSrc, /from ["']@\/components\/marketing\/MarketingFooter["']/);
assert.match(chromeSrc, /KompisWebSalesLocaleSwitcher/);

const salesPage = read("components/marketing/kompis-web-sales/KompisWebSalesPage.tsx");
assert.match(salesPage, /growthPartners\.learnMore/);
assert.doesNotMatch(
  salesPage,
  /href=\{labels\.hrefs\.growthPartners\}[\s\S]{0,120}footer\.becomeSeller/,
  "secondary Growth Partners CTA must not reuse Become a seller label",
);

console.log("kompis-web-sales sales-chrome-routes: PASS");
