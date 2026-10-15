import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { LOCALES } from "@/lib/i18n/config";
import { buildPlatformSuperRoleAccessLabels } from "@/lib/super-portal/platform-role-access-labels";

const REQUIRED_KEYS = [
  "title",
  "subtitle",
  "sourceNote",
  "definitionNote",
  "loading",
  "loadError",
  "retry",
  "empty",
  "unavailableTitle",
  "unavailableMessage",
  "openSuperMatrix",
  "backToPlatform",
  "totalPermissions",
  "totalModules",
  "organizationsWithGrants",
  "totalRoleGrants",
  "userOverrides",
  "customRoles",
  "templates",
] as const;

function loadRoleAccess(locale: string): Record<string, unknown> {
  const file = path.join(process.cwd(), "locales", locale, "platform.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as {
    portalStructure?: { superRoleAccess?: Record<string, unknown> };
    nav?: { superRoleAccess?: string };
  };
  assert.ok(data.nav?.superRoleAccess, `missing nav.superRoleAccess in ${locale}`);
  const block = data.portalStructure?.superRoleAccess;
  assert.ok(block, `missing portalStructure.superRoleAccess in ${locale}`);
  return block;
}

function main() {
  for (const locale of LOCALES) {
    const block = loadRoleAccess(locale);
    for (const key of REQUIRED_KEYS) {
      assert.equal(typeof block[key], "string", `${locale}.${key}`);
      assert.ok(String(block[key]).trim().length > 0, `${locale}.${key} empty`);
    }
  }

  const no = loadRoleAccess("no");
  assert.equal(no.title, "Roller og tilganger");

  const t = (key: string) => {
    if (!key.startsWith("platform.portalStructure.superRoleAccess.")) {
      return key;
    }
    const rest = key.replace("platform.portalStructure.superRoleAccess.", "");
    const en = loadRoleAccess("en");
    return String(en[rest as keyof typeof en] ?? key);
  };

  const labels = buildPlatformSuperRoleAccessLabels(t);
  assert.equal(labels.title, "Roles & access");
  assert.equal(labels.totalPermissions, "Permission definitions");

  console.log("platform-role-access-i18n.test.ts: all assertions passed");
}

void main();
