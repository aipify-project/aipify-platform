import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { LOCALES } from "@/lib/i18n/config";
import { buildPlatformSuperRevisionLabels } from "@/lib/super-portal/platform-revision-labels";

const REQUIRED_KEYS = [
  "title",
  "subtitle",
  "sourceNote",
  "periodNote",
  "loading",
  "loadError",
  "retry",
  "empty",
  "unavailableTitle",
  "unavailableMessage",
  "openSuperRevision",
  "backToPlatform",
  "noValue",
] as const;

const COLUMN_KEYS = ["actor", "action", "when", "previous", "next"] as const;

function loadRevision(locale: string): Record<string, unknown> {
  const file = path.join(process.cwd(), "locales", locale, "platform.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as {
    portalStructure?: { superRevision?: Record<string, unknown> };
    nav?: { superRevision?: string };
  };
  assert.ok(data.nav?.superRevision, `missing nav.superRevision in ${locale}`);
  const revision = data.portalStructure?.superRevision;
  assert.ok(revision, `missing portalStructure.superRevision in ${locale}`);
  return revision;
}

function main() {
  for (const locale of LOCALES) {
    const revision = loadRevision(locale);
    for (const key of REQUIRED_KEYS) {
      assert.equal(typeof revision[key], "string", `${locale}.${key}`);
      assert.ok(String(revision[key]).trim().length > 0, `${locale}.${key} empty`);
    }
    const columns = revision.columns as Record<string, string>;
    for (const key of COLUMN_KEYS) {
      assert.equal(typeof columns?.[key], "string", `${locale}.columns.${key}`);
      assert.ok(columns[key].trim().length > 0, `${locale}.columns.${key} empty`);
    }
  }

  const t = (key: string) => {
    if (!key.startsWith("platform.portalStructure.superRevision.")) {
      return key;
    }
    const rest = key.replace("platform.portalStructure.superRevision.", "");
    const en = loadRevision("en");
    if (rest.startsWith("columns.")) {
      const col = rest.replace("columns.", "");
      return (en.columns as Record<string, string>)[col];
    }
    return String(en[rest as keyof typeof en] ?? key);
  };

  const labels = buildPlatformSuperRevisionLabels(t);
  assert.equal(labels.title, "Revision log");
  assert.equal(labels.columns.actor, "Administrator");

  console.log("platform-revision-i18n.test.ts: all assertions passed");
}

void main();
