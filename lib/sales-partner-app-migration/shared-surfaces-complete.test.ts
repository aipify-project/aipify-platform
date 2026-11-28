import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  SALES_PARTNER_FEEDBACK_AND_SUPPORT_CONTRACT,
  SALES_PARTNER_HELP_SUBPATH_MAP,
  SALES_PARTNER_MODULE_ONLY_SURFACES,
  SALES_PARTNER_SHARED_APP_SURFACES,
  SALES_PARTNER_SHARED_SURFACES_COMPLETE_MARKER,
} from "./shared-surfaces-complete";
import { mapPartnersHrefToAppHost } from "./phase-c-shared-surfaces";
import { PARTNER_MESSAGES_APP_PATH } from "./messaging-performance";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("shared surfaces complete marker and APP reuse paths", () => {
  assert.equal(SALES_PARTNER_SHARED_SURFACES_COMPLETE_MARKER, "shared_surfaces_complete_v1");
  assert.equal(SALES_PARTNER_SHARED_APP_SURFACES.appProfile.href, "/app/profile");
  assert.equal(SALES_PARTNER_SHARED_APP_SURFACES.appSupport.href, "/app/support");
  assert.equal(SALES_PARTNER_SHARED_APP_SURFACES.appNotifications.href, "/app/notifications");
  assert.equal(SALES_PARTNER_SHARED_APP_SURFACES.knowledgeCenter.href, "/knowledge/articles");
  assert.equal(SALES_PARTNER_MODULE_ONLY_SURFACES.partnerMessages.href, PARTNER_MESSAGES_APP_PATH);
});

test("help subpaths map to APP thin hosts and exist on disk", () => {
  for (const [from, to] of Object.entries(SALES_PARTNER_HELP_SUBPATH_MAP)) {
    assert.equal(mapPartnersHrefToAppHost(from), to);
    const fileRel = path.join("app", to.replace(/^\//, ""), "page.tsx");
    assert.ok(existsSync(path.join(root, fileRel)), fileRel);
  }
});

test("topbar links APP profile and support without message list fetch", () => {
  const topbar = readFileSync(
    path.join(root, "components/partners-portal/PartnersPortalTopbarActions.tsx"),
    "utf8",
  );
  assert.match(topbar, /SALES_PARTNER_SHARED_APP_SURFACES/);
  assert.match(topbar, /appProfileHref|appProfile/);
  assert.match(topbar, /appSupportHref|appSupport/);
  assert.doesNotMatch(topbar, /\/api\/certified-sales-partner\/messages/);
});

test("help labels map partners hrefs to APP and expose shared APP cards", () => {
  const labels = readFileSync(
    path.join(root, "lib/partners-portal/csp-section-labels.ts"),
    "utf8",
  );
  assert.match(labels, /mapPartnersHrefToAppHost/);
  assert.match(labels, /sharedAppTitle/);
  assert.match(labels, /SALES_PARTNER_SHARED_APP_SURFACES/);
});

test("contact and profile use APP module hosts for messages and settlement", () => {
  const contact = readFileSync(
    path.join(root, "components/partners-portal/CertifiedSalesPartnerContactPanel.tsx"),
    "utf8",
  );
  assert.match(contact, /\/app\/sales-partner\/messages/);
  assert.match(contact, /\/app\/support/);
  assert.doesNotMatch(contact, /\/partners\/account\/messages/);

  const profile = readFileSync(
    path.join(root, "components/partners-portal/CertifiedSalesPartnerProfilePanel.tsx"),
    "utf8",
  );
  assert.match(profile, /\/app\/sales-partner\/help\/contact/);
  assert.match(profile, /\/app\/sales-partner\/commissions/);
});

test("feedback contract keeps VoC and does not edit Agent 3 ownership", () => {
  assert.equal(
    SALES_PARTNER_FEEDBACK_AND_SUPPORT_CONTRACT.productFeedback,
    "voice_of_the_customer",
  );
  assert.equal(
    SALES_PARTNER_FEEDBACK_AND_SUPPORT_CONTRACT.supportTickets.agent3Ownership,
    "support_intake_redis_public_channels",
  );
});

test("sales experience content hrefs are APP hosts", () => {
  const content = readFileSync(
    path.join(root, "lib/partners-portal/sales-experience-content.ts"),
    "utf8",
  );
  assert.match(content, /mapPartnersHrefToAppHost/);
  assert.doesNotMatch(content, /href: "\/partners\//);
});

test("core locale keys exist for shared surfaces", () => {
  for (const locale of ["en", "no", "sv", "da", "pl", "uk"]) {
    const json = JSON.parse(
      readFileSync(path.join(root, `locales/${locale}/partnersPortal.json`), "utf8"),
    );
    const topbar = json.certifiedSalesPartner.topbar;
    assert.ok(topbar.appProfile?.length > 2, locale);
    assert.ok(topbar.appSupport?.length > 2, locale);
    const help = json.certifiedSalesPartner.help;
    assert.ok(help.sharedAppTitle?.length > 2, locale);
    assert.ok(help.sharedApp?.profile?.cta, locale);
    assert.ok(json.certifiedSalesPartner.guides.contact.appSupportCta?.length > 2, locale);
  }
});
