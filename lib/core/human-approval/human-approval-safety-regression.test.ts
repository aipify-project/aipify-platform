/**
 * CORE.APPROVAL.02AN — read-only Human Approval safety regression.
 * Run: npx --yes tsx lib/core/human-approval/human-approval-safety-regression.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  CORE_HUMAN_APPROVAL_UI_ENV_KEY,
  HUMAN_APPROVAL_NAV_ID,
  HUMAN_APPROVAL_ROUTE,
  filterHumanApprovalNavItems,
  isCoreHumanApprovalUiEnabled,
  resolveHumanApprovalAccessState,
  shouldShowHumanApprovalNav,
} from "@/lib/app/human-approval-nav";
import { CUSTOMER_APP_SPLIT_NAMES } from "@/lib/i18n/customer-app-split-config";
import { buildHumanApprovalUiLabels } from "@/lib/core/human-approval/labels-client";
import { readHumanApprovalLocaleFileSync } from "@/lib/core/human-approval/labels-server";
import { createTranslator } from "@/lib/i18n/translate";

const repoRoot = path.join(import.meta.dirname, "..", "..", "..");

const envSnapshot = process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY];
delete process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY];

// --- 1. Feature flag default OFF ---
assert.equal(isCoreHumanApprovalUiEnabled(), false, "feature flag default OFF");
assert.equal(
  shouldShowHumanApprovalNav({ featureEnabled: false, organizationRole: "owner" }),
  false,
  "nav hidden when flag OFF even for owner",
);
assert.equal(
  resolveHumanApprovalAccessState({
    authenticated: true,
    organizationRole: "owner",
    featureEnabled: false,
  }),
  "feature_disabled",
);

const envExamplePath = path.join(repoRoot, ".env.example");
if (fs.existsSync(envExamplePath)) {
  const envExample = fs.readFileSync(envExamplePath, "utf8");
  assert.equal(
    /^[^#\n]*NEXT_PUBLIC_CORE_HUMAN_APPROVAL_UI\s*=\s*true/m.test(envExample),
    false,
    ".env.example must not enable Human Approval by default",
  );
}

// --- 2. Owner/admin nav gate ---
const employeeRoles = ["staff", "member", "employee", "viewer", "manager"] as const;
for (const role of employeeRoles) {
  assert.equal(
    shouldShowHumanApprovalNav({ featureEnabled: true, organizationRole: role }),
    false,
    `${role} must not see Human Approval nav`,
  );
}
for (const role of ["owner", "administrator", "admin"] as const) {
  assert.equal(
    shouldShowHumanApprovalNav({ featureEnabled: true, organizationRole: role }),
    true,
    `${role} may see Human Approval nav when flag ON`,
  );
}

const navFixture = [
  { id: "approvals", href: "/app/approvals", labelKey: "x" },
  { id: HUMAN_APPROVAL_NAV_ID, href: HUMAN_APPROVAL_ROUTE, labelKey: "y" },
];
assert.equal(
  filterHumanApprovalNavItems(navFixture, { featureEnabled: true, organizationRole: "member" })
    .length,
  1,
  "member does not get Human Approval nav item",
);

// --- 3. Read-only invariant (UI surface scan) ---
const uiSurfaceFiles = [
  "components/app/human-approval/HumanApprovalCenterPanel.tsx",
  "components/app/human-approval/HumanApprovalDetailPanel.tsx",
  "components/app/human-approval/HumanApprovalStatusBadge.tsx",
];

const forbiddenMutationButtonPatterns = [
  />\s*(Approve|Deny|Revoke|Execute|Emergency stop|Godkjenn|Avslå|Tilbakekall|Utfør|Nødstopp)\s*</i,
  /labels\.(approveAction|denyAction|revokeAction|executeAction|emergencyStop)/i,
  /onClick=\{[^}]*\b(approve|deny|revoke|execute)\b/i,
  /fetch\s*\(\s*['"`]\/api\/actions\//i,
  /method:\s*['"`]POST['"`]/i,
];

for (const relativePath of uiSurfaceFiles) {
  const source = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
  for (const pattern of forbiddenMutationButtonPatterns) {
    assert.equal(
      pattern.test(source),
      false,
      `${relativePath} must not expose mutation control matching ${pattern}`,
    );
  }
}

const localeActionKeys = ["approveAction", "denyAction", "revokeAction", "executeAction", "emergencyStop"];
for (const locale of ["en", "no"] as const) {
  const localeJson = JSON.stringify(readHumanApprovalLocaleFileSync(locale));
  for (const key of localeActionKeys) {
    assert.equal(localeJson.includes(`"${key}"`), false, `${locale} humanApproval must not define ${key}`);
  }
}

// --- 4. i18n coverage (NO/EN + no raw keys) ---
assert.ok(
  (CUSTOMER_APP_SPLIT_NAMES as readonly string[]).includes("humanApproval"),
  "humanApproval registered in i18n split",
);

for (const locale of ["en", "no"] as const) {
  const file = readHumanApprovalLocaleFileSync(locale);
  assert.ok(typeof file.navLabel === "string" && file.navLabel.length > 0, `${locale} navLabel`);
  assert.ok(typeof file.title === "string" && file.title.length > 0, `${locale} title`);
  assert.ok(typeof file.viewDetail === "string", `${locale} viewDetail`);
}

for (const locale of ["en", "no"] as const) {
  const dict = {
    customerApp: { humanApproval: readHumanApprovalLocaleFileSync(locale) },
  };
  const labels = buildHumanApprovalUiLabels(createTranslator(dict));
  const serialized = JSON.stringify(labels);
  assert.equal(serialized.includes("customerApp.humanApproval"), false, `${locale} labels must not leak raw keys`);
  assert.match(labels.navLabel, /\S/, `${locale} navLabel resolved`);
  assert.match(labels.title, /\S/, `${locale} title resolved`);
}

// --- 5. Route isolation ---
const routeSurfaceFiles = [
  "app/app/human-approval/page.tsx",
  "app/app/human-approval/[id]/page.tsx",
  "app/api/app/human-approval/route.ts",
  "app/api/app/human-approval/[id]/route.ts",
  ...uiSurfaceFiles,
];

const forbiddenImportPatterns = [
  /@\/components\/app\/approvals\/ApprovalsCenterPanel/i,
  /from\s+['"]@\/components\/app\/approvals['"]/i,
  /from\s+['"]@\/lib\/approvals-center\/client['"]/i,
  /\/api\/actions\/\[id\]\/approve/i,
  /\bapproveAndExecute\b/,
  /\bexecuteApproval\b/,
  /redirect\s*\(\s*['"`]\/app\/approvals['"`]/i,
];

for (const relativePath of routeSurfaceFiles) {
  const source = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
  for (const pattern of forbiddenImportPatterns) {
    assert.equal(
      pattern.test(source),
      false,
      `${relativePath} must not reuse mutation center: ${pattern}`,
    );
  }
}

for (const relativePath of [
  "app/api/app/human-approval/route.ts",
  "app/api/app/human-approval/[id]/route.ts",
]) {
  const source = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
  assert.match(source, /export async function POST\(\)/, `${relativePath} blocks POST`);
  assert.match(source, /Method not allowed/i, `${relativePath} rejects mutations`);
  assert.match(source, /export async function GET\(/, `${relativePath} allows GET only for reads`);
}

if (envSnapshot === undefined) {
  delete process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY];
} else {
  process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY] = envSnapshot;
}

console.log("human-approval safety regression tests passed");
