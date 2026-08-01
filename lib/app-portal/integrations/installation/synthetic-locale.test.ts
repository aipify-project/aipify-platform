import assert from "node:assert/strict";
import { LOCALES } from "@/lib/i18n/config";
import {
  installationLocaleFallback,
  listInstallationLocales,
  resolveCustomerSafeText,
  resolveInstallationTextDirection,
} from "./locale";

const SYNTHETIC = "fr-test";

// Production registry unchanged — wizard still reads canonical LOCALES by default.
assert.deepEqual([...listInstallationLocales()], [...LOCALES]);
assert.equal(listInstallationLocales().includes(SYNTHETIC), false);

// Synthetic locale accepted via registry fixture without wizard UI code changes.
const extended = listInstallationLocales([...LOCALES, SYNTHETIC]);
assert.equal(extended.includes(SYNTHETIC), true);
assert.equal(extended.includes("en"), true);

// Missing provider-specific map entry falls back to English.
const resolved = resolveCustomerSafeText(
  {
    kind: "locale_map",
    values: { en: "Connection ready", no: "Tilkobling klar" },
    fallbackLocale: "en",
  },
  {
    locale: SYNTHETIC,
    translate: (key) => key,
    emptyFallback: "safe-empty",
  },
);
assert.equal(resolved, "Connection ready");
assert.equal(resolved.includes("locale_map"), false);
assert.equal(resolved.includes(SYNTHETIC), false);

// Missing dictionary key never surfaces raw key.
const missing = resolveCustomerSafeText(
  { kind: "locale_key", key: "customerApp.portalStructure.integrations.installationWizard.missingKey" },
  {
    locale: SYNTHETIC,
    translate: (key) => key,
    emptyFallback: "Continue when you are ready.",
  },
);
assert.equal(missing, "Continue when you are ready.");
assert.equal(missing.includes("missingKey"), false);

assert.equal(installationLocaleFallback(), "en");
assert.equal(resolveInstallationTextDirection("en"), "ltr");
assert.equal(resolveInstallationTextDirection("ar", true), "rtl");
assert.equal(resolveInstallationTextDirection(SYNTHETIC, true), "ltr");

console.log("synthetic-locale.test.ts: ok", { synthetic: SYNTHETIC, registrySize: extended.length });
