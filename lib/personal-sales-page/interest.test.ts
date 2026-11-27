import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  interestStored,
  mapInterestRpcError,
  parsePersonalPageInterests,
  validatePersonalPageInterest,
} from "./interest";
import { personalSalesLeadEnabled } from "./lead-gate";

test("rejects client seller identity and keeps the public gate closed", () => {
  assert.equal(personalSalesLeadEnabled(), false);
  assert.equal(
    validatePersonalPageInterest({
      seller_id: "x",
      email: "ada@example.com",
      display_name: "Ada",
      product_key: "kompis_web",
      locale: "en",
      idempotency_key: "abcdefgh",
      follow_up_acknowledged: true,
      code: "north-studio",
    }).ok,
    false,
  );
});

test("requires acknowledgement, email, code, and published product shape", () => {
  assert.equal(
    validatePersonalPageInterest({
      email: "ada@example.com",
      display_name: "Ada",
      product_key: "kompis_web",
      locale: "en",
      idempotency_key: "abcdefgh",
      follow_up_acknowledged: false,
      code: "north-studio",
    }).ok,
    false,
  );
  assert.equal(
    validatePersonalPageInterest({
      email: "not-an-email",
      display_name: "Ada",
      product_key: "kompis_web",
      locale: "en",
      idempotency_key: "abcdefgh",
      follow_up_acknowledged: true,
      code: "north-studio",
    }).ok,
    false,
  );
  const ok = validatePersonalPageInterest({
    email: "Ada@Example.com",
    display_name: "Ada Partner",
    product_key: "kompis_web",
    locale: "no",
    idempotency_key: "idem-key-01",
    follow_up_acknowledged: true,
    code: "north-studio",
    company_website: "",
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.value.email, "ada@example.com");
    assert.equal(ok.value.code, "north-studio");
  }
});

test("parses only personal-page interests and never invents a store", () => {
  const rows = parsePersonalPageInterests({
    interests: [
      {
        id: "1",
        contact_name: "Ada",
        contact_email: "ada@example.com",
        product_key: "kompis_web",
        registered_at: "2026-11-27T00:00:00.000Z",
        lead_source: "personal_sales_page",
        lead_status: "new",
      },
      {
        id: "2",
        contact_name: "Other",
        contact_email: "other@example.com",
        product_key: "kompis_web",
        registered_at: "2026-11-27T00:00:00.000Z",
        lead_source: "manual",
        lead_status: "new",
      },
    ],
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.source, "personal_sales_page");
  assert.equal(interestStored({ stored: true }), true);
  assert.equal(interestStored({ stored: false, duplicate: true }), false);
  assert.equal(mapInterestRpcError({ error: "rate_limited" }), "rate_limited");
});

test("interest route stays gated and never trusts a browser seller id", () => {
  const route = readFileSync("app/api/personal-sales-page/interest/route.ts", "utf8");
  assert.match(route, /personalSalesLeadEnabled/);
  assert.match(route, /createServiceRoleClient/);
  assert.match(route, /register_personal_sales_page_interest/);
  assert.match(route, /rejectClientSellerIdentity/);
  assert.match(route, /p_code: validated\.value\.code/);
  assert.doesNotMatch(route, /seller_id/);
  const view = readFileSync("components/marketing/personal-sales-page/PersonalSalesPageView.tsx", "utf8");
  assert.match(view, /interestPending/);
  assert.match(view, /personalSalesLeadEnabled/);
  assert.doesNotMatch(view, /enabled\s*\?\s*true/);
  const gate = readFileSync("lib/personal-sales-page/lead-gate.ts", "utf8");
  assert.match(gate, /return false/);
});

test("CRM and platform surfaces read the Growth Partner lead register", () => {
  const crm = readFileSync("app/api/growth-partner/personal-page-interests/route.ts", "utf8");
  assert.match(crm, /list_own_personal_sales_page_interests/);
  const panel = readFileSync(
    "components/app/growth-partner-operations-center/GrowthPartnerOperationsCenterPanel.tsx",
    "utf8",
  );
  assert.match(panel, /personal-page-interests/);
  assert.match(panel, /personalPageTitle/);
  const platform = readFileSync("app/platform/sellers/personal-pages/page.tsx", "utf8");
  assert.match(platform, /list_platform_personal_sales_page_interests/);
  assert.doesNotMatch(platform, /csp_personal_page_interests/);
  assert.doesNotMatch(readFileSync("app/api/personal-sales-page/interest/route.ts", "utf8"), /csp_personal_page_interests/);
});
