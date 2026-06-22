import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listFinanceProviderManifests } from "@/lib/integration-intelligence/finance/registry";
import {
  buildFinanceCapabilityId,
  FINANCE_BLOCKED_CAPABILITY_KEYS,
  FINANCE_BUSINESS_PACK_KEYS,
  isFinanceBusinessPackActive,
  isFinanceCapabilityBlocked,
} from "@/lib/integration-intelligence/finance/types";
import {
  buildFinanceActionDefinitions,
  buildFinanceReadToolDefinitions,
  buildFinanceSchemaEntities,
  mapFinanceCapabilitiesToRefs,
  mergeFinanceCapabilities,
} from "./merge-finance-runtime";
import {
  createEmptyCompanionFinanceContext,
  filterFinanceCapabilitiesForPrivacy,
  listEnabledFinanceCapabilities,
} from "./companion-finance-context";
import {
  buildBlockedFinanceOperationAnswer,
  buildExternalFinanceUnavailableAnswer,
  buildFinanceProviderDiscoveryAnswer,
  hasBlockedFinanceOperationIntent,
  hasFinanceProviderIntent,
  matchFinanceProviderQuery,
} from "./finance-answer";
import { buildActionDefinitionFromFinanceCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listFinanceProviderManifests();
assert.ok(manifests.length >= 6);

for (const blocked of FINANCE_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isFinanceCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

assert.equal(isFinanceBusinessPackActive(["finance_pack"]), true);
assert.equal(isFinanceBusinessPackActive(["finance_operations"]), true);
assert.equal(isFinanceBusinessPackActive(["warehouse_pack"]), false);
assert.ok(FINANCE_BUSINESS_PACK_KEYS.includes("finance_pack"));

const financeOpsCenter = manifests.find(
  (manifest) => manifest.provider_key === "finance_operations_center",
);
assert.ok(financeOpsCenter);
assert.equal(financeOpsCenter?.business_pack_key, "finance_pack");

const requiredReadCapabilities = [
  "revenue.read",
  "expense.read",
  "invoice.read",
  "subscription.read",
  "payment.read",
  "payout.read",
  "billing_profile.read",
  "forecast.read",
  "report.read",
  "reconciliation.read",
] as const;

for (const capabilityKey of requiredReadCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const requiredWriteCapabilities = ["invoice.draft", "report.export"] as const;

for (const capabilityKey of requiredWriteCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const financeContext = createEmptyCompanionFinanceContext({
  finance_operations_enabled: true,
  revenue_operations_enabled: true,
  unified_billing_enabled: true,
  payment_providers_enabled: true,
  finance_role_filter_active: true,
  sensitive_account_data_masked: true,
  no_raw_card_or_bank_details: true,
  command_brief_events_linked: true,
  command_brief_signals: [
    { signal_key: "overdue_invoice", count: 2 },
    { signal_key: "forecast_warning", count: 1 },
  ],
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    finance_operations_enabled: manifest.source_engine === "finance_operations",
    revenue_operations_enabled: manifest.source_engine === "revenue_operations",
    unified_billing_enabled: manifest.source_engine === "unified_billing",
    payment_providers_enabled: manifest.source_engine === "payment_providers",
    enterprise_invoicing_enabled: manifest.source_engine === "enterprise_invoicing",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active:
      manifest.business_pack_key === "finance_pack" || !manifest.business_pack_key,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildFinanceCapabilityId(
        manifest.provider_key,
        capability.capability_key,
        capability.operation,
      ),
      provider_key: manifest.provider_key,
      capability_key: capability.capability_key,
      operation: capability.operation,
      entity: capability.entity,
      adapter_available: false,
      approval_required: capability.approval_required,
      reversible: capability.reversible,
      risk_level: capability.risk_level,
      required_permission: capability.required_permission,
      runtime_status: manifest.implementation_status,
      privacy_sensitive: capability.privacy_sensitive,
      enabled:
        (!capability.required_permission || capability.required_permission === "finance.view") &&
        (capability.operation === "read" || capability.approval_required) &&
        manifest.implementation_status !== "placeholder",
    })),
  ),
});

const capabilityRefs = mapFinanceCapabilitiesToRefs(financeContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "finance_provider"));

const mergedCapabilities = mergeFinanceCapabilities([], financeContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildFinanceSchemaEntities(financeContext, [
  "finance.view",
  "finance.manage",
]);
assert.ok(schemaEntities.length > 0);

const readTools = buildFinanceReadToolDefinitions({
  financeContext,
  effectivePermissions: ["finance.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const invoiceDraft = financeContext.capabilities.find(
  (capability) =>
    capability.capability_key === "invoice.draft" &&
    capability.provider_key === "finance_operations_center",
);
assert.ok(invoiceDraft);

const invoiceDefinition = buildActionDefinitionFromFinanceCapability(invoiceDraft!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(invoiceDefinition);
assert.equal(invoiceDefinition?.source, "finance_provider");
assert.equal(invoiceDefinition?.enabled, true);

const financeActions = buildFinanceActionDefinitions({
  financeContext,
  effectivePermissions: ["finance.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(financeActions.length > 0);
assert.ok(financeActions.every((action) => action.approval_required));

const privateCapabilities = filterFinanceCapabilitiesForPrivacy({
  ...financeContext,
  capabilities: financeContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const permissionFiltered = buildFinanceSchemaEntities(
  {
    ...financeContext,
    capabilities: financeContext.capabilities.map((capability) =>
      capability.required_permission === "finance.manage"
        ? { ...capability, enabled: false }
        : capability,
    ),
  },
  ["finance.view"],
);
assert.ok(
  permissionFiltered.some((entity) => entity.entity_key.includes("finance_operations_center")),
);
assert.ok(
  permissionFiltered.every(
    (entity) => !entity.required_permissions.includes("finance.manage"),
  ),
);

const enabled = listEnabledFinanceCapabilities(financeContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ financeContext });
const match = matchFinanceProviderQuery(
  "show revenue expenses invoices and subscription billing",
  tenantContext,
);
assert.ok(match);
assert.equal(hasFinanceProviderIntent("finance revenue invoice subscription payment"), true);
assert.equal(
  hasBlockedFinanceOperationIntent("execute payment and issue refund bank transfer"),
  true,
);

const discovery = buildFinanceProviderDiscoveryAnswer(match!, financeContext, t);
assert.ok(discovery.directAnswer.includes("finance.discoveryLead"));
assert.ok(discovery.explanation?.includes("finance.sensitiveDataMasked"));
assert.ok(discovery.explanation?.includes("finance.commandBriefEventsLinked"));

const blocked = buildBlockedFinanceOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("finance.blockedOperationLead"));

const externalUnavailable = buildExternalFinanceUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("finance.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveFinanceProviderAnswer"));

const forbiddenTerms = ["unonight", "stripe.com", "frisør", "salon"];
for (const term of forbiddenTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-finance-context.ts",
  "load-companion-finance-context.ts",
  "merge-finance-runtime.ts",
  "finance-answer.ts",
  "tenant-context.ts",
  "orchestrator.ts",
];
for (const file of coreRuntimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  for (const term of forbiddenTerms) {
    assert.equal(new RegExp(`\\b${term}\\b`, "i").test(source), false, `${file}:${term}`);
  }
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"finance"'), locale);
}

console.log("phase23 companion runtime tests passed");
