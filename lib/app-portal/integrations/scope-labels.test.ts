import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveIntegrationScopeLabel } from "./scope-labels";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;

const REQUIRED_SCOPE_KEYS = [
  "metadata_read",
  "organization_read",
  "integration_status_read",
  "platform_metadata_read",
  "read_products",
  "read_orders",
  "read_customers",
] as const;

const scopeDescriptions = {
  "metadata.read": "Lese grunnleggende integrasjonsinformasjon",
  read_products: "Lese produkter",
  metadata_read: "Fallback metadata",
};

assert.equal(
  resolveIntegrationScopeLabel("metadata.read", scopeDescriptions, "Godkjent tilgang"),
  "Lese grunnleggende integrasjonsinformasjon",
);
assert.equal(
  resolveIntegrationScopeLabel("read_products", scopeDescriptions, "Godkjent tilgang"),
  "Lese produkter",
);
assert.equal(
  resolveIntegrationScopeLabel("platform.metadata.read", scopeDescriptions, "Godkjent tilgang"),
  "Godkjent tilgang",
);
assert.equal(
  resolveIntegrationScopeLabel("custom.scope", scopeDescriptions, "Godkjent tilgang"),
  "Godkjent tilgang",
);

for (const locale of LOCALES) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(ROOT, `locales/${locale}/customer-app/portalStructure.json`), "utf8"),
  ) as {
    integrations?: {
      setup?: {
        scopeDescriptions?: Record<string, string>;
        scopeUnknownFallback?: string;
        completion?: { technicalDetailsLabel?: string };
      };
    };
  };
  const integrations = dict.portalStructure?.integrations;
  assert.ok(integrations?.scopeUnknownFallback, `${locale}: scopeUnknownFallback`);
  assert.ok(
    integrations?.setup?.completion?.technicalDetailsLabel,
    `${locale}: completion.technicalDetailsLabel`,
  );
  for (const key of REQUIRED_SCOPE_KEYS) {
    assert.ok(integrations?.scopeDescriptions?.[key], `${locale}: scopeDescriptions.${key}`);
  }
}

console.log("scope-labels.test.ts: all assertions passed");
