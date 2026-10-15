import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { PlatformLayoutClasses } from "./platform-layout";

const ROOT = process.cwd();

test("platform layout fasit is full width (customers pattern)", () => {
  assert.match(PlatformLayoutClasses.page, /\bw-full\b/);
  assert.doesNotMatch(PlatformLayoutClasses.page, /max-w-/);
  assert.doesNotMatch(PlatformLayoutClasses.pageWidth, /max-w-/);
  assert.match(PlatformLayoutClasses.card, /bg-white/);
  assert.match(PlatformLayoutClasses.metricGrid, /xl:grid-cols-4/);
  assert.match(PlatformLayoutClasses.tabActive, /sky-100/);
});

test("dashboard and customers consume shared Platform page frame", () => {
  const dashboard = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalDashboardPanel.tsx"),
    "utf8",
  );
  const customers = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalCustomersPanel.tsx"),
    "utf8",
  );
  const foundation = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalFoundationPanel.tsx"),
    "utf8",
  );
  const shell = readFileSync(join(ROOT, "components/dashboard/DashboardShell.tsx"), "utf8");
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");

  assert.match(dashboard, /PlatformPageFrame/);
  assert.match(dashboard, /PlatformLayoutClasses/);
  assert.doesNotMatch(dashboard, /max-w-\[1680px\]/);
  assert.match(customers, /PlatformPageFrame/);
  assert.match(foundation, /PlatformPageFrame/);
  assert.match(shell, /aipify-platform-shell/);
  assert.match(css, /\.aipify-platform-shell/);
  assert.match(css, /#f3f5fb/i);
});

test("support and billing panels are not redesigned in this job", () => {
  const support = readFileSync(join(ROOT, "components/platform/PlatformSupportPanel.tsx"), "utf8");
  const billing = readFileSync(join(ROOT, "components/platform/BillingPanel.tsx"), "utf8");
  assert.match(support, /max-w-6xl/);
  assert.match(billing, /max-w-6xl/);
});

console.log("platform-layout: all tests passed");
