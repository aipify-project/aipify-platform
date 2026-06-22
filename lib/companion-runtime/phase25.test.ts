import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listSecurityProviderManifests } from "@/lib/integration-intelligence/security/registry";
import {
  buildSecurityCapabilityId,
  SECURITY_BLOCKED_CAPABILITY_KEYS,
  SECURITY_BUSINESS_PACK_KEYS,
  isSecurityBusinessPackActive,
  isSecurityCapabilityBlocked,
} from "@/lib/integration-intelligence/security/types";
import {
  buildSecurityActionDefinitions,
  buildSecurityReadToolDefinitions,
  buildSecuritySchemaEntities,
  mapSecurityCapabilitiesToRefs,
  mergeSecurityCapabilities,
} from "./merge-security-runtime";
import {
  createEmptyCompanionSecurityContext,
  filterSecurityCapabilitiesForPrivacy,
  listEnabledSecurityCapabilities,
} from "./companion-security-context";
import {
  buildBlockedSecurityOperationAnswer,
  buildExternalSecurityUnavailableAnswer,
  buildSecurityProviderDiscoveryAnswer,
  hasBlockedSecurityOperationIntent,
  hasSecurityProviderIntent,
  matchSecurityProviderQuery,
} from "./security-answer";
import { buildActionDefinitionFromSecurityCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listSecurityProviderManifests();
assert.ok(manifests.length >= 6);

for (const blocked of SECURITY_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isSecurityCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

assert.equal(isSecurityBusinessPackActive(["governance_pack"]), true);
assert.equal(isSecurityBusinessPackActive(["security_pack"]), true);
assert.equal(isSecurityBusinessPackActive(["warehouse_pack"]), false);
assert.ok(SECURITY_BUSINESS_PACK_KEYS.includes("trust_center"));

const trustCenter = manifests.find(
  (manifest) => manifest.provider_key === "trust_center_verification",
);
assert.ok(trustCenter);
assert.equal(trustCenter?.business_pack_key, "trust_center");

const requiredReadCapabilities = [
  "verification.read",
  "verification_status.read",
  "access.read",
  "role.read",
  "permission.read",
  "security_event.read",
  "audit_log.read",
  "compliance_status.read",
  "policy_violation.read",
  "risk_signal.read",
  "access_review.read",
  "incident.read",
] as const;

for (const capabilityKey of requiredReadCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const requiredWriteCapabilities = ["verification.request", "access_review.create"] as const;

for (const capabilityKey of requiredWriteCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const securityContext = createEmptyCompanionSecurityContext({
  trust_center_verification_enabled: true,
  identity_access_enabled: true,
  security_compliance_enabled: true,
  audit_accountability_enabled: true,
  governance_management_enabled: true,
  role_based_access_active: true,
  sensitive_documents_masked: true,
  secrets_and_auth_data_filtered: true,
  command_brief_events_linked: true,
  command_brief_signals: [
    { signal_key: "verification_pending", count: 2 },
    { signal_key: "security_incident", count: 1 },
  ],
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    trust_center_verification_enabled: manifest.source_engine === "trust_center_verification",
    identity_access_enabled: manifest.source_engine === "identity_access",
    security_compliance_enabled: manifest.source_engine === "security_compliance",
    audit_accountability_enabled: manifest.source_engine === "audit_accountability",
    governance_management_enabled: manifest.source_engine === "governance_management",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active:
      manifest.business_pack_key === "governance_pack" || !manifest.business_pack_key,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildSecurityCapabilityId(
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
        (!capability.required_permission || capability.required_permission === "security.view") &&
        (capability.operation === "read" || capability.approval_required) &&
        manifest.implementation_status !== "placeholder",
    })),
  ),
});

const capabilityRefs = mapSecurityCapabilitiesToRefs(securityContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "security_provider"));

const mergedCapabilities = mergeSecurityCapabilities([], securityContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildSecuritySchemaEntities(securityContext, [
  "security.view",
  "trust_center.view",
  "audit.view",
]);
assert.ok(schemaEntities.length > 0);

const readTools = buildSecurityReadToolDefinitions({
  securityContext,
  effectivePermissions: ["security.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const verificationRequest = securityContext.capabilities.find(
  (capability) =>
    capability.capability_key === "verification.request" &&
    capability.provider_key === "trust_center_verification",
);
assert.ok(verificationRequest);

const verificationDefinition = buildActionDefinitionFromSecurityCapability(verificationRequest!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(verificationDefinition);
assert.equal(verificationDefinition?.source, "security_provider");
assert.equal(verificationDefinition?.enabled, true);

const securityActions = buildSecurityActionDefinitions({
  securityContext,
  effectivePermissions: ["trust_center.manage", "governance.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(securityActions.length > 0);
assert.ok(securityActions.every((action) => action.approval_required));

const privateCapabilities = filterSecurityCapabilitiesForPrivacy({
  ...securityContext,
  capabilities: securityContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const permissionFiltered = buildSecuritySchemaEntities(
  {
    ...securityContext,
    capabilities: securityContext.capabilities.map((capability) =>
      capability.required_permission === "trust_center.manage"
        ? { ...capability, enabled: false }
        : capability,
    ),
  },
  ["security.view"],
);
assert.ok(
  permissionFiltered.some((entity) => entity.entity_key.includes("security_compliance_center")),
);
assert.ok(
  permissionFiltered.every(
    (entity) => !entity.required_permissions.includes("trust_center.manage"),
  ),
);

const enabled = listEnabledSecurityCapabilities(securityContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ securityContext });
const match = matchSecurityProviderQuery(
  "show verification audit compliance and access review",
  tenantContext,
);
assert.ok(match);
assert.equal(
  hasSecurityProviderIntent("security verification audit compliance permission role 2fa"),
  true,
);
assert.equal(
  hasBlockedSecurityOperationIntent("auto approve identity delete audit log disable 2fa"),
  true,
);

const discovery = buildSecurityProviderDiscoveryAnswer(match!, securityContext, t);
assert.ok(discovery.directAnswer.includes("security.discoveryLead"));
assert.ok(discovery.explanation?.includes("security.sensitiveDocumentsMasked"));
assert.ok(discovery.explanation?.includes("security.commandBriefEventsLinked"));

const blocked = buildBlockedSecurityOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("security.blockedOperationLead"));

const externalUnavailable = buildExternalSecurityUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("security.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveSecurityProviderAnswer"));

const forbiddenTerms = [PILOT_INTEGRATION_PROVIDER_KEY, "okta.com", "frisør", "salon"];
for (const term of forbiddenTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-security-context.ts",
  "load-companion-security-context.ts",
  "merge-security-runtime.ts",
  "security-answer.ts",
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
  assert.ok(raw.includes('"security"'), locale);
}

console.log("phase25 companion runtime tests passed");
