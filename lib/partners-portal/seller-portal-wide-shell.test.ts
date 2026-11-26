import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "path";
import test from "node:test";
import { LOCALES } from "@/lib/i18n/config";
import { SELLER_PORTAL_LAYOUT } from "./design-tokens";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

test("seller portal shell is full-width with fixed sidebar", () => {
  const shell = read("components/partners-portal/PartnersPortalShell.tsx");
  assert.match(shell, /sticky top-0 hidden h-screen/);
  assert.match(shell, /SELLER_PORTAL_LAYOUT\.sidebarWidthClass|w-\[256px\]/);
  assert.doesNotMatch(shell, /max-w-\[1600px\]/);
  assert.doesNotMatch(shell, /CONTENT_MAX/);
  assert.match(shell, /role="dialog"/);
  assert.match(shell, /Escape/);
  assert.equal(SELLER_PORTAL_LAYOUT.sidebarWidthPx, 256);
});

test("workspace panel no longer repeats canvas hero chrome", () => {
  const workspace = read("components/partners-portal/CertifiedSalesPartnerWorkspacePanel.tsx");
  assert.doesNotMatch(workspace, /AipifyShellClasses\.canvas/);
  assert.doesNotMatch(workspace, /<h1 className=.*\{labels\.title\}/);
  assert.match(workspace, /useOptionalCspPortalSession/);
});

test("partner panels do not re-clamp content to 1600px", () => {
  for (const rel of [
    "components/partners-portal/CertifiedSalesPartnerLinkPanel.tsx",
    "components/partners-portal/CertifiedSalesPartnerProductCatalogPanel.tsx",
    "components/partners-portal/CertifiedSalesPartnerHelpPanel.tsx",
    "components/partners-portal/CertifiedSalesPartnerNotificationsPanel.tsx",
    "components/partners-portal/CertifiedSalesPartnerPortalPanels.tsx",
  ]) {
    assert.doesNotMatch(read(rel), /max-w-\[1600px\]/, rel);
  }
});

test("topbar profile menu and settingsMenu locale keys exist", () => {
  const topbar = read("components/partners-portal/PartnersPortalTopbarActions.tsx");
  assert.match(topbar, /settingsMenu/);
  assert.match(topbar, /role="menu"/);
  for (const locale of LOCALES) {
    const json = JSON.parse(read(`locales/${locale}/partnersPortal.json`));
    assert.equal(typeof json.certifiedSalesPartner.topbar.settingsMenu, "string");
    assert.ok(json.certifiedSalesPartner.topbar.settingsMenu.length > 2, locale);
  }
});

test("design primitives are partners-portal scoped", () => {
  assert.match(read("components/partners-portal/design/AipifyAlert.tsx"), /aria-live/);
  assert.match(read("components/partners-portal/design/AipifyStatusBadge.tsx"), /Never color alone/);
  assert.match(read("components/partners-portal/design/AipifyPageHeader.tsx"), /no mascot/);
});

console.log("seller-portal-wide-shell.test.ts: ok");
