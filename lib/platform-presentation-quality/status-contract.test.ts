import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALES } from "@/lib/i18n/config";
import {
  getPlatformStatusPresentation,
  PLATFORM_STATUS_CODES,
  resolvePlatformStatusLabel,
  resolvePlatformStatusSeverity,
} from "./status-contract";
import { buildPlatformPresentationQualityLabels } from "./labels";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

function loadStatuses(locale: string): Record<string, string> {
  const json = JSON.parse(
    readFileSync(join(process.cwd(), "locales", locale, "platform.json"), "utf8"),
  ) as { presentationQuality: { statuses: Record<string, string>; unknownStatus: string } };
  const presentation = buildPlatformPresentationQualityLabels((key) => {
    const parts = key.replace(/^platform\./, "").split(".");
    let cursor: unknown = { presentationQuality: json.presentationQuality };
    for (const part of parts) {
      if (!cursor || typeof cursor !== "object") return key;
      cursor = (cursor as Record<string, unknown>)[part];
    }
    return typeof cursor === "string" ? cursor : key;
  });
  return presentation.statuses;
}

test("Norwegian required status mapping", () => {
  const statuses = loadStatuses("no");
  assert.equal(resolvePlatformStatusLabel({
    status: "active",
    labels: statuses,
    unknownFallback: "Ukjent status",
  }), "Aktiv");
  assert.equal(resolvePlatformStatusLabel({
    status: "ready",
    labels: statuses,
    unknownFallback: "Ukjent status",
  }), "Klar");
  assert.equal(resolvePlatformStatusLabel({
    status: "enabled",
    labels: statuses,
    unknownFallback: "Ukjent status",
  }), "Aktivert");
  assert.equal(resolvePlatformStatusLabel({
    status: "not_ready",
    labels: statuses,
    unknownFallback: "Ukjent status",
  }), "Ikke klar");
});

test("unknown status never returns raw enum", () => {
  const label = resolvePlatformStatusLabel({
    status: "totally_made_up_status",
    labels: { active: "Active" },
    unknownFallback: "Unknown status",
    logUnknown: false,
  });
  assert.equal(label, "Unknown status");
  assert.notEqual(label, "totally_made_up_status");
});

test("severity contract separates label from tone", () => {
  assert.equal(resolvePlatformStatusSeverity("active"), "success");
  assert.equal(resolvePlatformStatusSeverity("attention"), "warning");
  assert.equal(resolvePlatformStatusSeverity("failed"), "danger");
  assert.equal(resolvePlatformStatusSeverity("not_configured"), "muted");
  const presentation = getPlatformStatusPresentation({
    status: "verified",
    labels: { verified: "Verified" },
    unknownFallback: "Unknown",
  });
  assert.equal(presentation.label, "Verified");
  assert.equal(presentation.severity, "success");
  assert.equal(presentation.ariaLabel, "Verified");
});

test("locale parity for presentationQuality statuses", () => {
  const requiredLocaleKeys = [
    "active",
    "ready",
    "enabled",
    "disabled",
    "pending",
    "provisioning",
    "provisioned",
    "verified",
    "acknowledged",
    "attention",
    "blocked",
    "failed",
    "suspended",
    "revoked",
    "expired",
    "archived",
    "notReady",
    "notConfigured",
    "notAvailable",
  ];

  for (const locale of LOCALES) {
    const json = JSON.parse(
      readFileSync(join(process.cwd(), "locales", locale, "platform.json"), "utf8"),
    ) as {
      presentationQuality: {
        statuses: Record<string, string>;
        unknownStatus: string;
        scopes: Record<string, string>;
        terms: Record<string, string>;
      };
    };
    assert.ok(json.presentationQuality, `missing presentationQuality in ${locale}`);
    for (const key of requiredLocaleKeys) {
      const value = json.presentationQuality.statuses[key];
      assert.ok(value && value.trim(), `${locale} missing status ${key}`);
      assert.notEqual(value, key);
      assert.ok(!/^[a-z]+(_[a-z]+)+$/.test(value), `${locale} raw snake_case for ${key}`);
    }
    assert.ok(json.presentationQuality.unknownStatus);
    assert.ok(json.presentationQuality.scopes.delivery);
    assert.ok(json.presentationQuality.terms.deliveryStatus);
  }

  assert.ok(PLATFORM_STATUS_CODES.includes("active"));
});

console.log("platform-presentation-quality status-contract: all passed");
