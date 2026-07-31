import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Presentation quality UI scan — targets visible Platform/APP customer cards.
 * Intentionally narrow to avoid false positives in tests, APIs, and parsers.
 */

const ROOT = process.cwd();

const UI_TARGETS = [
  "components/platform/platform-portal/PlatformPortalAppKompisDeliveryPanel.tsx",
  "components/platform/platform-portal/CustomerWebsiteRuntimeDeliveryPanel.tsx",
  "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx",
  "components/platform/platform-portal/PlatformPortalWebsiteKompisActivationPanel.tsx",
  "components/platform/platform-portal/PlatformLicensesOverviewPanel.tsx",
  "components/platform/platform-portal/PlatformCustomerAgreementsOverviewPanel.tsx",
  "components/platform/platform-portal/PlatformCustomerSuccessOverviewPanel.tsx",
  "components/app/website/CustomerWebsiteRuntimeReadinessCard.tsx",
];

const FORBIDDEN_LITERALS = [
  /\{["']active["']\}/,
  /\{["']ready["']\}/,
  /\{["']enabled["']\}/,
  /\{["']pending["']\}/,
  /\{["']not_ready["']\}/,
];

const FORBIDDEN_ISO_RENDER = [
  /toISOString\(\)/,
  /lastCheckedAt\s*\?\?\s*["']—["']/,
  /lastAttemptAt\s*\?\?\s*["']—["']/,
  /lastFullyVerifiedAt\s*\?\?\s*["']—["']/,
];

const REQUIRED_HELPERS = [
  /formatPlatformDateTime(Full|Short)/,
  /resolvePlatformStatusLabel|activationStatuses|deliveryStatuses|statusLabel\(/,
];

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

test("targeted UI files avoid raw ISO and raw status rendering", () => {
  for (const relative of UI_TARGETS) {
    const source = stripComments(readFileSync(join(ROOT, relative), "utf8"));
    for (const pattern of FORBIDDEN_ISO_RENDER) {
      assert.equal(
        pattern.test(source),
        false,
        `${relative} still renders raw ISO / unformatted timestamp via ${pattern}`,
      );
    }
    for (const pattern of FORBIDDEN_LITERALS) {
      assert.equal(
        pattern.test(source),
        false,
        `${relative} embeds raw status literal ${pattern}`,
      );
    }
    // Soft check: raw status ?? "—" badge patterns for known fields
    if (relative.includes("AppKompisDelivery") || relative.includes("WebsiteKompisActivation")) {
      assert.equal(
        /label=\{data\.(parentLicense|appPanel|childEntitlement|installation)\.status\s*\?\?/.test(
          source,
        ),
        false,
        `${relative} still renders raw nested status on Badge`,
      );
      assert.equal(
        /\{data\.agreement\.status\s*\?\?/.test(source),
        false,
        `${relative} still renders raw agreement status`,
      );
    }
  }
});

test("targeted UI files use central presentation helpers", () => {
  for (const relative of UI_TARGETS) {
    if (
      relative.includes("OverviewPanel") ||
      relative.includes("CustomerDetailPanel")
    ) {
      const source = readFileSync(join(ROOT, relative), "utf8");
      assert.match(
        source,
        /formatPlatformDate(TimeFull|Only|TimeShort)/,
        `${relative} must format dates through presentation helpers`,
      );
      continue;
    }
    const source = readFileSync(join(ROOT, relative), "utf8");
    const matched = REQUIRED_HELPERS.some((pattern) => pattern.test(source));
    assert.equal(matched, true, `${relative} missing presentation helpers`);
  }
});

test("no CSS capitalize status fix in targeted panels", () => {
  for (const relative of UI_TARGETS) {
    const source = readFileSync(join(ROOT, relative), "utf8");
    assert.equal(
      /text-transform:\s*capitalize|capitalize\s*status/i.test(source),
      false,
      `${relative} must not use CSS capitalize as status fix`,
    );
  }
});

test("presentation quality module exists and is not empty", () => {
  const dir = join(ROOT, "lib/platform-presentation-quality");
  assert.ok(statSync(dir).isDirectory());
  const files = readdirSync(dir);
  assert.ok(files.includes("date-time.ts"));
  assert.ok(files.includes("status-contract.ts"));
  assert.ok(files.includes("index.ts"));
});

console.log("platform-presentation-quality ui-scan: all passed");
