import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildCspPublicLinkPath, resolveCspProductDestination } from "../certified-sales-partner/attribution-policy";
import { appendAllowlistedShareLocale, isCspShareLocale } from "../certified-sales-partner/share-locale";
import { listPublishedSalesCopyForLocale } from "../certified-sales-partner/sales-materials-catalog";
import { cspSocialPlatformSupportsWebShare } from "../certified-sales-partner/social-share";
import { LOCALES } from "../i18n/config";
import { CSP_PARTNER_PORTAL_NAV_GROUPS } from "./csp-nav";

const root = new URL("../../", import.meta.url);

test("server pages do not call client label builders", () => {
  const settings = readFileSync(new URL("app/partners/account/settings/page.tsx", root), "utf8");
  const notifications = readFileSync(new URL("app/partners/account/notifications/page.tsx", root), "utf8");
  const settlement = readFileSync(new URL("app/partners/settlement/page.tsx", root), "utf8");
  assert.match(settings, /csp-section-labels/);
  assert.match(notifications, /csp-section-labels/);
  assert.match(settlement, /csp-workspace-labels/);
  assert.doesNotMatch(settlement, /csp-section-labels/);
  assert.doesNotMatch(settings, /buildCspHelpLabels[\s\S]*from "@\/components/);
  assert.doesNotMatch(notifications, /buildCspNotificationsLabels[\s\S]*from "@\/components/);
  assert.doesNotMatch(settlement, /buildCspBankPanelLabels[\s\S]*from "@\/components/);
  const bank = readFileSync(new URL("components/partners-portal/CertifiedSalesPartnerBankPanel.tsx", root), "utf8");
  assert.doesNotMatch(bank, /export function buildCspBankPanelLabels/);
});

test("portal overview fetch stays in layout session provider", () => {
  const layout = readFileSync(new URL("app/partners/layout.tsx", root), "utf8");
  const provider = readFileSync(new URL("components/partners-portal/CspPortalSessionProvider.tsx", root), "utf8");
  const workspace = readFileSync(new URL("components/partners-portal/CertifiedSalesPartnerWorkspacePanel.tsx", root), "utf8");
  const guard = readFileSync(new URL("components/partners-portal/PartnersPortalAuthGuard.tsx", root), "utf8");
  const loading = readFileSync(new URL("app/partners/loading.tsx", root), "utf8");
  assert.match(layout, /CspPortalSessionProvider/);
  assert.match(layout, /serverAuthorized/);
  assert.match(provider, /\/api\/certified-sales-partner\/portal/);
  assert.match(provider, /SILENT_REVALIDATE_MIN_MS/);
  assert.doesNotMatch(workspace, /\/api\/certified-sales-partner\/portal/);
  assert.match(guard, /SILENT_ACCESS_MIN_MS/);
  assert.match(loading, /AipifyLoader/);
});

test("help payouts CTA still points at settlement after bank label move", () => {
  const labels = readFileSync(new URL("lib/partners-portal/csp-section-labels.ts", root), "utf8");
  assert.match(labels, /payouts[\s\S]*\/partners\/settlement/);
  assert.match(labels, /export function buildCspBankPanelLabels/);
});

test("compact nav reuses routes and has no duplicate hrefs", () => {
  const hrefs = CSP_PARTNER_PORTAL_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.href));
  assert.equal(new Set(hrefs).size, hrefs.length);
  assert.ok(hrefs.includes("/partners/marketing/assets"));
  assert.ok(hrefs.includes("/partners/marketing/assets?section=library"));
  assert.equal(CSP_PARTNER_PORTAL_NAV_GROUPS.find((group) => group.items.some((item) => item.href === "/partners/account/settings"))?.id, "communication");
});

test("marketing language does not fall back to English", () => {
  for (const locale of LOCALES) {
    const rows = listPublishedSalesCopyForLocale({ productKey: "kompis_web", locale });
    assert.ok(rows.length > 0, locale);
    assert.equal(rows.every((row) => row.text.length > 0), true);
  }
  assert.equal(listPublishedSalesCopyForLocale({ productKey: "aipify_voice", locale: "en" }).length, 0);
  assert.equal(listPublishedSalesCopyForLocale({ productKey: "kompis_web", locale: "zz" }).length, 0);
});

test("personal link keeps the seller code and an allowlisted language", () => {
  const path = buildCspPublicLinkPath({
    code: "csp-0123456789ab",
    productKey: "kompis_web",
    channel: "referral_link",
  });
  assert.ok(path?.startsWith("/p/csp-0123456789ab/kompis_web?"));
  const target = new URL("https://example.com/");
  appendAllowlistedShareLocale(target, "es");
  appendAllowlistedShareLocale(target, "fr");
  assert.equal(target.searchParams.get("lang"), "es");
  assert.equal(isCspShareLocale("uk"), true);
  assert.equal(resolveCspProductDestination("aipify_voice"), null);
  assert.equal(buildCspPublicLinkPath({ code: "csp-0123456789ab", productKey: "aipify_voice", channel: "referral_link" }), null);
});

test("only Facebook, X, and LinkedIn have a web share URL", () => {
  assert.equal(cspSocialPlatformSupportsWebShare("facebook"), true);
  assert.equal(cspSocialPlatformSupportsWebShare("x"), true);
  assert.equal(cspSocialPlatformSupportsWebShare("linkedin"), true);
  assert.equal(cspSocialPlatformSupportsWebShare("instagram"), false);
  assert.equal(cspSocialPlatformSupportsWebShare("tiktok"), false);
  assert.equal(cspSocialPlatformSupportsWebShare("snapchat"), false);
});

test("payment RPC candidate revokes anon and stays unapplied", () => {
  const sql = readFileSync(new URL("docs/platform/sql-candidates/csp_payment_rpc_anon_revoke_v7.sql", root), "utf8");
  const route = readFileSync(new URL("app/api/webhooks/stripe/route.ts", root), "utf8");
  assert.match(sql, /PREPARED_ONLY/);
  assert.match(sql, /APPLY_BLOCKED_UNTIL_SERVICE_ROLE_CLIENT/);
  assert.match(sql, /revoke all on function public\.handle_payment_webhook_event\(text, text, jsonb, uuid\) from anon/i);
  assert.match(sql, /revoke all on function public\.register_trial_payment_method\(text\) from anon/i);
  assert.match(sql, /grant execute on function public\.handle_payment_webhook_event\(text, text, jsonb, uuid\) to service_role/i);
  assert.doesNotMatch(sql, /drop function/i);
  // Signature gate stays fail-closed; Core mutation uses service_role only (payment hardening).
  assert.match(route, /authorizeStripeWebhook/);
  assert.match(route, /createServiceRoleClient/);
  assert.doesNotMatch(route, /createClient\(/);
});
