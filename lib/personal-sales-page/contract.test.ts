import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  classifyPersonalSalesCode,
  personalSalesProductPath,
  publicAdvisorName,
  publicationFromPublicResolve,
} from "./contract";

test("rejects emails, uuids, and unknown shapes", () => {
  assert.equal(classifyPersonalSalesCode("seller@example.com"), "invalid");
  assert.equal(classifyPersonalSalesCode("11111111-1111-4111-8111-111111111111"), "invalid");
  assert.equal(classifyPersonalSalesCode("csp-0123456789ab"), "csp");
  assert.equal(classifyPersonalSalesCode("north-studio"), "growth_partner");
});

test("public resolve publishes a name only for an active growth partner link", () => {
  assert.deepEqual(
    publicationFromPublicResolve({
      code: "north-studio",
      resolved: { found: true, partner_name: "North Studio", partner_company: "Hidden AS" },
    }),
    { state: "published", code: "north-studio", advisorName: "North Studio" },
  );
  assert.equal(
    publicationFromPublicResolve({
      code: "north-studio",
      resolved: { found: false, error: "Partner link disabled" },
    }).state,
    "closed",
  );
  assert.equal(
    publicationFromPublicResolve({
      code: "csp-0123456789ab",
      resolved: { found: true, partner_name: "Should not publish" },
    }).state,
    "closed",
  );
});

test("advisor name drops email and markup", () => {
  assert.equal(publicAdvisorName("Ada <script>"), null);
  assert.equal(publicAdvisorName("ada@example.com"), null);
  assert.equal(publicAdvisorName("Ada Partner"), "Ada Partner");
});

test("attributed start uses the existing /p route and locale", () => {
  assert.equal(
    personalSalesProductPath("north-studio", "uk"),
    "/p/north-studio/kompis_web?channel=referral_link&lang=uk",
  );
  assert.equal(personalSalesProductPath("not a code", "en"), null);
});

test("seller pages are noindex and do not invent checkout", () => {
  const page = readFileSync("app/s/[code]/page.tsx", "utf8");
  const view = readFileSync("components/marketing/personal-sales-page/PersonalSalesPageView.tsx", "utf8");
  assert.match(page, /index:\s*false/);
  assert.match(page, /KOMPIS_WEB_SALES_CANONICAL_URL/);
  assert.match(view, /KompisWebSalesPage/);
  assert.match(view, /localePaths/);
  assert.doesNotMatch(view, /localePath=\{/);
  const sales = readFileSync("components/marketing/kompis-web-sales/KompisWebSalesPage.tsx", "utf8");
  assert.match(sales, /localePaths\?:/);
  assert.doesNotMatch(sales, /localePath\?: \(locale:/);
  assert.doesNotMatch(page, /checkoutEnabled:\s*true/);
  assert.doesNotMatch(page, /stripe/i);
  assert.doesNotMatch(view, /personal page is not available/i);
  assert.doesNotMatch(view, /api\/personal-sales-page\/interest/);
  assert.match(view, /interestPending/);
});

test("interest registration is live and ignores a client seller id", async () => {
  const gate = await import("./lead-gate");
  assert.equal(gate.personalSalesLeadEnabled(), true);
  assert.equal(gate.PERSONAL_SALES_LEAD_GATE, "live");
  assert.equal(gate.rejectClientSellerIdentity({ seller_id: "x" }), true);
  assert.equal(gate.rejectClientSellerIdentity({ email: "ada@example.com" }), false);
  const view = readFileSync("components/marketing/personal-sales-page/PersonalSalesPageView.tsx", "utf8");
  assert.doesNotMatch(view, /<form/);
  assert.doesNotMatch(view, /fetch\(/);
  assert.match(view, /interestPending/);
  assert.match(view, /PersonalSalesInterestForm/);
  const materials = readFileSync("components/platform/sellers/CertifiedSellersOpsPanel.tsx", "utf8");
  assert.match(materials, /type="file" disabled/);
  const nav = readFileSync("lib/partners-portal/csp-nav.ts", "utf8");
  assert.match(nav, /\/partners\/sales-page/);
  const norwegian = readFileSync("locales/no/partnersPortal.json", "utf8");
  assert.match(norwegian, /Salgsflyten/);
});
