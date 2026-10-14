/**
 * Job 63 — premium APP visual system + layered background (presentation only).
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  APP_VISUAL_SYSTEM_VERSION,
  AppVisualClasses,
  AppVisualColors,
} from "@/lib/design/app-visual-system";
import { KOMPIS_BEDRIFT_FLAT_NAV, KOMPIS_WEB_FLAT_NAV } from "@/lib/app-portal/nav-config";

const ROOT = process.cwd();

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

assert.equal(APP_VISUAL_SYSTEM_VERSION, "63.5");
assert.equal(AppVisualColors.canvas, "#F3F5FB");
assert.equal(AppVisualColors.surface, "#F8F9FD");
assert.equal(AppVisualColors.card, "#FFFFFF");
assert.equal(AppVisualColors.primary, "#7357E8");
assert.equal(AppVisualColors.primaryBlue, "#5577F2");
assert.ok(AppVisualClasses.shellRoot.includes("aipify-app-shell"));
assert.ok(AppVisualClasses.navItemActive.includes("primary-soft"));

const globals = read("app/globals.css");
assert.match(globals, /\.aipify-app-shell\s*\{/);
assert.match(globals, /--app-canvas:\s*#f3f5fb/i);
assert.match(globals, /--app-primary:\s*#7357e8/i);
assert.match(globals, /\.aipify-app-canvas-layer/);
assert.match(globals, /\.aipify-app-decorative-orb/);
assert.match(globals, /prefers-reduced-motion/);
assert.match(globals, /--aipify-companion-purple:\s*var\(--app-primary\)/);

const shell = read("components/dashboard/DashboardShell.tsx");
assert.match(shell, /AppCanvasBackground/);
assert.match(shell, /AppVisualClasses\.shellRoot/);
assert.match(shell, /shellVariant === "customer"/);
assert.match(shell, /data-aipify-app-shell/);

const flat = read("components/dashboard/FlatSidebar.tsx");
assert.match(flat, /AppVisualClasses\.navItemActive/);
assert.doesNotMatch(flat, /className=\{`[^`]*bg-aipify-companion/);
assert.match(AppVisualClasses.navItemActive, /primary-soft-fill|primary-soft/);

assert.ok(fs.existsSync(path.join(ROOT, "components/app/design/AppCanvasBackground.tsx")));
assert.ok(fs.existsSync(path.join(ROOT, "components/app/design/AppDecorativeOrb.tsx")));

const hub = read("components/app/hubs/AppHubShell.tsx");
assert.match(hub, /decorativeAccent/);
assert.match(hub, /AppDecorativeOrb/);
assert.match(hub, /clearDecorativeOrb=\{decorativeAccent\}/);

const pageHeader = read("components/app/design/AppPageHeader.tsx");
assert.match(pageHeader, /clearDecorativeOrb/);
assert.match(pageHeader, /max-w-2xl/);
assert.match(pageHeader, /--app-border-accent/);
assert.doesNotMatch(pageHeader, /border-b border-aipify-border/);

assert.match(read("app/app/website-kompis/page.tsx"), /decorativeAccent/);
assert.match(read("app/app/kompis-bedrift/page.tsx"), /decorativeAccent/);
assert.match(read("components/app/foundation/AppFoundationDashboard.tsx"), /AppDecorativeOrb/);

const card = read("components/app/design/AppIconActionCard.tsx");
assert.match(card, /AppVisualClasses\.cardInteractive/);
assert.match(card, /StatusDot/);

const bedriftDash = read("app/app/kompis-bedrift/page.tsx");
assert.match(bedriftDash, /HubFeatureIcon/);
assert.doesNotMatch(bedriftDash, /HubArrowIcon/);
assert.match(read("components/app/hubs/HubFeatureIcon.tsx"), /export function HubFeatureIcon/);
assert.match(read("lib/design/light-enterprise-theme.ts"), /w-\[256px\]/);
assert.match(read("lib/design/light-enterprise-theme.ts"), /desktopWidthPx:\s*256/);
assert.match(read("components/analytics/AnalyticsConsentProvider.tsx"), /aipify-privacy-settings-trigger/);
assert.match(read("components/analytics/AnalyticsConsentProvider.tsx"), /hideFloatingSettingsTrigger/);
assert.match(read("app/app/layout.tsx"), /hideFloatingSettingsTrigger/);
assert.match(read("components/app/license/LicenseSidebarPanel.tsx"), /aipify-sidebar-privacy-trigger/);
assert.match(read("components/app/license/LicenseSidebarPanel.tsx"), /openPrivacySettings/);
assert.match(read("components/app/voice-of-the-customer/ShareFeedbackDialog.tsx"), /createPortal/);
assert.match(read("components/app/voice-of-the-customer/ShareFeedbackDialog.tsx"), /document\.body/);
assert.match(globals, /aipify-privacy-settings-trigger/);
assert.match(globals, /display:\s*none/);
assert.match(globals, /aipify-app-decorative-orb__mascot/);

// Flat nav contract preserved (job 60/61)
assert.equal(KOMPIS_WEB_FLAT_NAV.length, 8);
assert.equal(KOMPIS_BEDRIFT_FLAT_NAV.length, 11);
assert.ok(!KOMPIS_WEB_FLAT_NAV.some((i) => i.href === "/app/kompis"));
assert.ok(!KOMPIS_BEDRIFT_FLAT_NAV.some((i) => i.href === "/app/kompis"));

// No companion reintroduction in shell/hub
assert.doesNotMatch(shell, /CompanionShell/);
assert.doesNotMatch(hub, /CompanionShell/);
assert.doesNotMatch(flat, /CompanionShell/);

// No model picker / temperature in APP hub chrome
assert.doesNotMatch(hub, /temperature|systemPrompt|gpt-|claude/i);
assert.doesNotMatch(card, /temperature|systemPrompt/i);

// Frozen Website Kompis hashes unchanged
const manifest = JSON.parse(
  read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256").update(read(entry.path)).digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

console.log("premium-visual-system-63.test.ts: all assertions passed");
