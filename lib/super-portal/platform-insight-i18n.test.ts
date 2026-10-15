import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { LOCALES } from "@/lib/i18n/config";
import { buildPlatformSuperAdminInsightLabels } from "@/lib/super-portal/platform-insight-labels";

const REQUIRED_KEYS = [
  "title",
  "subtitle",
  "loading",
  "loadError",
  "retry",
  "privacyNote",
  "periodNote",
  "totalOrganizations",
  "totalRegisteredUsers",
  "totalActiveSubscriptions",
  "activePlatformSupportAdmins",
  "openCriticalIncidents",
  "globalPlatformStatus",
  "organizationGrowth30d",
  "subscriptionGrowth30d",
  "executiveAlertCount",
  "openSuperDashboard",
] as const;

function loadInsight(locale: string): Record<string, unknown> {
  const file = path.join(process.cwd(), "locales", locale, "platform.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as {
    portalStructure?: { dashboard?: { superAdminInsight?: Record<string, unknown> } };
  };
  const insight = data.portalStructure?.dashboard?.superAdminInsight;
  assert.ok(insight, `missing superAdminInsight in ${locale}`);
  return insight;
}

function main() {
  for (const locale of LOCALES) {
    const insight = loadInsight(locale);
    for (const key of REQUIRED_KEYS) {
      assert.equal(typeof insight[key], "string", `${locale}.${key}`);
      assert.ok(String(insight[key]).trim().length > 0, `${locale}.${key} empty`);
    }
    const statuses = insight.statuses as Record<string, string>;
    assert.ok(statuses?.operational);
    assert.ok(statuses?.attention_required);
    assert.ok(statuses?.unknown);
  }

  const t = (key: string) => {
    if (key.endsWith(".title")) return "Group overview";
    if (key.includes(".statuses.")) return "Operational";
    return key.split(".").pop() ?? key;
  };
  const labels = buildPlatformSuperAdminInsightLabels(t as never);
  assert.equal(labels.title, "Group overview");
  assert.ok(labels.openSuperDashboard);

  console.log("platform-insight-i18n.test.ts: all assertions passed");
}

main();
