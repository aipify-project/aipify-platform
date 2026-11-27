import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const reconcile = readFileSync(
  "docs/platform/sql-candidates/20261127_staging_growth_partner_personal_page_interest_reconcile_v1.sql",
  "utf8",
);
const fixture = readFileSync(
  "docs/platform/sql-candidates/20261127_staging_growth_partner_interest_fixture_v1.sql",
  "utf8",
);

test("public interest stays closed in the application", async () => {
  const gate = await import("./lead-gate");
  assert.equal(gate.personalSalesLeadEnabled(), false);
  assert.equal(gate.PERSONAL_SALES_LEAD_GATE, "core_pending");
  const view = readFileSync("components/marketing/personal-sales-page/PersonalSalesPageView.tsx", "utf8");
  assert.doesNotMatch(view, /<form/);
  assert.doesNotMatch(view, /api\/personal-sales-page\/interest/);
});

test("reconciled register attaches only an approved certified link", () => {
  assert.match(reconcile, /_gp455a_resolve_slug\(p_code\)/);
  assert.match(reconcile, /link_status is distinct from 'active'/);
  assert.match(reconcile, /v_status is distinct from 'certified'/);
  assert.match(reconcile, /published = true/);
  assert.match(reconcile, /partner_status' is distinct from 'certified'/);
  assert.match(reconcile, /l\.profile_id = v_profile_id/);
  assert.match(reconcile, /is_platform_admin/);
  assert.doesNotMatch(reconcile, /seller_id|partner_id/);
});

test("reconciled register closes abuse and keeps stored false on rejection", () => {
  const lockAt = reconcile.indexOf("pg_advisory_xact_lock");
  const hourAt = reconcile.indexOf("interval '1 hour'");
  const dayAt = reconcile.indexOf("interval '1 day'");
  assert.ok(lockAt > 0 && lockAt < hourAt && lockAt < dayAt);
  assert.match(reconcile, />= 8/);
  assert.match(reconcile, />= 3/);
  assert.match(reconcile, /p_follow_up_acknowledged is distinct from true/);
  assert.match(reconcile, /p_company_website/);
  assert.match(reconcile, /'en', 'no', 'sv', 'da', 'pl', 'uk', 'es'/);
  assert.match(reconcile, /v_key !~ '\^\[A-Za-z0-9_-\]\{8,80\}\$'/);
  assert.match(reconcile, /'stored', false/);
  assert.match(reconcile, /'stored', v_id is not null/);
  assert.match(reconcile, /on conflict do nothing/);
  assert.doesNotMatch(reconcile, /jsonb_build_object\('stored', true, 'email'/);
});

test("reconciled SQL does not open the table, the register, or commission writes", () => {
  assert.match(reconcile, /force row level security/);
  assert.match(reconcile, /revoke all on table public\.growth_partner_ops_leads from public, anon, authenticated/);
  assert.match(reconcile, /from public, anon, authenticated, service_role/);
  assert.doesNotMatch(
    reconcile,
    /grant execute on function public\.register_personal_sales_page_interest/i,
  );
  assert.doesNotMatch(reconcile, /csp_qualified_sales|commission_ledger|growth_partner_commissions/i);
  assert.doesNotMatch(reconcile, /staging_interest_fixture_apply/);
  assert.match(reconcile, /lead register grants or row security drifted/);
});

test("fixture is separate, synthetic, and reversible", () => {
  assert.match(fixture, /DO NOT APPLY with the interest reconciliation/);
  assert.match(fixture, /staging_interest_fixture_cleanup/);
  assert.match(fixture, /fixture-interest@example\.com/);
  assert.match(fixture, /fixture slug or organization is already used/);
  assert.doesNotMatch(fixture, /insert into auth\.users|insert into public\.users/i);
  assert.doesNotMatch(fixture, /insert into public\.organization_role_permissions/i);
  assert.doesNotMatch(fixture, /insert into public\.organization_users/i);
  assert.match(fixture, /fixture changed leads, users, memberships, or grants/);
  assert.doesNotMatch(fixture, /grant execute on function public\.register_personal_sales_page_interest/i);
  assert.doesNotMatch(reconcile, /staging-interest-fixture/);
});
