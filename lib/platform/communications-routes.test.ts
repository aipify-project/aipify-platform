import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { getPlatformActiveNavId, PLATFORM_ADMIN_NAV } from "./nav-config";
import { LOCALES } from "@/lib/i18n/config";

const ROOT = process.cwd();

test("communications landing page exists under Platform app routes", () => {
  assert.ok(existsSync(join(ROOT, "app/platform/communications/page.tsx")));
  assert.ok(existsSync(join(ROOT, "app/platform/communications/announcement-center/page.tsx")));
  assert.ok(existsSync(join(ROOT, "app/platform/communications/website-kompis-plans/page.tsx")));
});

test("website-kompis-plans page does not pass translator function to client panel", () => {
  const page = readFileSync(
    join(ROOT, "app/platform/communications/website-kompis-plans/page.tsx"),
    "utf8",
  );
  const panel = readFileSync(
    join(ROOT, "components/platform/WebsiteKompisPlansCommunicationPanel.tsx"),
    "utf8",
  );
  assert.doesNotMatch(page, /\bt=\{t\}/);
  assert.match(page, /previews=\{previews\}/);
  assert.match(panel, /previews:/);
  assert.doesNotMatch(panel, /t:\s*\(key:\s*string\)\s*=>\s*string/);
  assert.match(panel, /PlatformPageFrame/);
});

test("communications nav and active states are wired", () => {
  const item = PLATFORM_ADMIN_NAV.find((i) => i.id === "communications");
  assert.ok(item);
  assert.equal(item!.href, "/platform/communications");
  assert.equal(getPlatformActiveNavId("/platform/communications"), "communications");
  assert.equal(
    getPlatformActiveNavId("/platform/communications/announcement-center"),
    "communications",
  );
  assert.equal(
    getPlatformActiveNavId("/platform/communications/website-kompis-plans"),
    "websiteKompisPlans",
  );
});

test("locale parity for communications landing and preview-only copy", () => {
  for (const locale of LOCALES) {
    const data = JSON.parse(
      readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"),
    ) as {
      nav?: { communications?: string };
      communications?: {
        title?: string;
        notSupportInbox?: string;
        cards?: { announcements?: { title?: string }; planMessages?: { title?: string } };
      };
      websiteKompisPlans?: { noCustomerSend?: string; checkoutNotEnabled?: string };
    };
    assert.ok(data.nav?.communications, `missing nav.communications for ${locale}`);
    assert.ok(data.communications?.title, `missing communications.title for ${locale}`);
    assert.ok(data.communications?.notSupportInbox, `missing notSupportInbox for ${locale}`);
    assert.ok(
      data.communications?.cards?.announcements?.title,
      `missing announcements card for ${locale}`,
    );
    assert.ok(
      data.communications?.cards?.planMessages?.title,
      `missing planMessages card for ${locale}`,
    );
    assert.ok(
      data.websiteKompisPlans?.noCustomerSend,
      `missing noCustomerSend for ${locale}`,
    );
    assert.ok(
      data.websiteKompisPlans?.checkoutNotEnabled,
      `missing checkoutNotEnabled for ${locale}`,
    );
  }

  const no = JSON.parse(
    readFileSync(join(ROOT, "locales/no/platform.json"), "utf8"),
  ) as {
    nav: { communications: string };
    communications: { title: string };
    websiteKompisPlans: { noCustomerSend: string };
  };
  assert.equal(no.nav.communications, "Kommunikasjon");
  assert.equal(no.communications.title, "Kommunikasjon");
  assert.match(no.websiteKompisPlans.noCustomerSend, /forhåndsvisning/i);
});

console.log("platform-communications-routes: all tests passed");
