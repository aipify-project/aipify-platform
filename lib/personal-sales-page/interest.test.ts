import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { interestStored, parsePersonalPageInterests, validatePersonalPageInterest } from "./interest";

const valid = {
  display_name: "Ada Partner",
  email: "ada@example.com",
  product_key: "kompis_web",
  locale: "no",
  idempotency_key: "idem-12345678",
  follow_up_acknowledged: true,
  company_website: "",
};

test("rejects a client seller id, invalid email, missing acknowledgement, and a honeypot", () => {
  assert.equal(validatePersonalPageInterest({ ...valid, seller_id: "x" }).ok, false);
  assert.equal(validatePersonalPageInterest({ ...valid, email: "not-an-email" }).ok, false);
  assert.equal(validatePersonalPageInterest({ ...valid, follow_up_acknowledged: false }).ok, false);
  assert.equal(validatePersonalPageInterest({ ...valid, company_website: "https://spam.example" }).ok, false);
  assert.equal(validatePersonalPageInterest({ ...valid, display_name: "  " }).ok, false);
  const parsed = validatePersonalPageInterest(valid);
  assert.equal(parsed.ok, true);
});

test("a duplicate or missing write is not a success", () => {
  assert.equal(interestStored({ ok: true, stored: false, duplicate: true }), false);
  assert.equal(interestStored({ ok: false, stored: false, error: "core_pending" }), false);
  assert.equal(interestStored({ stored: true }), true);
});

test("interest rows stay on the personal page source and drop incomplete records", () => {
  const rows = parsePersonalPageInterests({
    interests: [
      {
        id: "1",
        contact_name: "Ada",
        contact_email: "ada@example.com",
        product_key: "kompis_web",
        registered_at: "2026-11-27T12:00:00Z",
        lead_source: "personal_sales_page",
        lead_status: "new",
      },
      {
        id: "2",
        contact_name: "Other",
        contact_email: "other@example.com",
        product_key: "kompis_web",
        registered_at: "2026-11-27T12:00:00Z",
        lead_source: "manual",
        lead_status: "new",
      },
    ],
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.source, "personal_sales_page");
});

test("core candidate resolves the public code, isolates the partner, and does not create a sale", () => {
  const sql = readFileSync("docs/platform/sql-candidates/csp_personal_sales_page_interest_v1.sql", "utf8");
  assert.match(sql, /_gp455a_resolve_slug/);
  assert.match(sql, /v_status is distinct from 'certified'/);
  assert.match(sql, /link_status is distinct from 'active'/);
  assert.match(sql, /csp_sales_products/);
  assert.match(sql, /published = true/);
  assert.match(sql, /acknowledgement_required/);
  assert.match(sql, /rate_limited/);
  assert.match(sql, /force row level security/);
  assert.match(sql, /where l\.profile_id = v_profile_id/);
  assert.match(sql, /is_platform_admin\(\)/);
  assert.match(sql, /revoke all on function public\.register_personal_sales_page_interest/);
  assert.doesNotMatch(sql, /insert into public\.csp_qualified_sales/i);
  assert.doesNotMatch(sql, /grant execute on function public\.register_personal_sales_page_interest[\s\S]*anon/);
  const route = readFileSync("app/api/personal-sales-page/interest/route.ts", "utf8");
  assert.match(route, /stored: false/);
  assert.match(route, /core_pending/);
  assert.doesNotMatch(route, /stored: true/);
  const view = readFileSync("components/marketing/personal-sales-page/PersonalSalesPageView.tsx", "utf8");
  assert.match(view, /personalSalesLeadEnabled\(\)/);
  assert.match(view, /PersonalSalesInterestForm/);
});
