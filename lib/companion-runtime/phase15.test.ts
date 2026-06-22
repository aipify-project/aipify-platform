import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listWorkspaceProviderManifests } from "@/lib/integration-intelligence/workspace/registry";
import { buildWorkspaceCapabilityId } from "@/lib/integration-intelligence/workspace/types";
import {
  buildWorkspaceActionDefinitions,
  buildWorkspaceReadToolDefinitions,
  buildWorkspaceSchemaEntities,
  mapWorkspaceCapabilitiesToRefs,
  mergeWorkspaceCapabilities,
} from "./merge-workspace-runtime";
import {
  createEmptyCompanionWorkspaceContext,
  filterWorkspaceCapabilitiesForPrivacy,
  listEnabledWorkspaceCapabilities,
} from "./companion-workspace-context";
import {
  buildExternalWorkspaceUnavailableAnswer,
  buildWorkspaceProviderDiscoveryAnswer,
  hasExternalWorkspaceConnectorIntent,
  hasWorkspaceProviderIntent,
  matchWorkspaceProviderQuery,
} from "./workspace-answer";
import { buildActionDefinitionFromWorkspaceCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listWorkspaceProviderManifests();
assert.ok(manifests.length >= 8);

const forbiddenProviders = [
  "microsoft_365",
  "google_workspace",
  "gmail",
  "outlook",
  "google_calendar",
  "google_drive",
  "onedrive",
  "slack",
  "microsoft_teams",
];
for (const provider of forbiddenProviders) {
  assert.equal(manifests.some((manifest) => manifest.provider_key === provider), false, provider);
}

const organizationCalendar = manifests.find(
  (manifest) => manifest.provider_key === "organization_calendar",
);
assert.ok(organizationCalendar);
assert.equal(organizationCalendar?.implementation_status, "partial");

const capabilityId = buildWorkspaceCapabilityId(
  "organization_tasks",
  "task.read",
  "read",
);
assert.equal(capabilityId, "organization_tasks.task.read.read");

const workspaceContext = createEmptyCompanionWorkspaceContext({
  calendar_enabled: true,
  tasks_enabled: true,
  documents_enabled: true,
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    calendar_enabled: manifest.source_engine === "calendar_scheduling",
    context_calendar_enabled: manifest.source_engine === "context_engine",
    tasks_enabled: manifest.source_engine === "task_management",
    documents_enabled: manifest.source_engine === "document_knowledge",
    search_enabled: manifest.source_engine === "universal_search",
    notifications_enabled: manifest.source_engine === "notification_orchestration",
    print_enabled: manifest.source_engine === "print_output",
    support_email_enabled: manifest.source_engine === "business_dna",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildWorkspaceCapabilityId(
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
      enabled: capability.operation === "read" || (capability.approval_required && capability.reversible),
    })),
  ),
  privacy_filtered: true,
});

const capabilityRefs = mapWorkspaceCapabilitiesToRefs(workspaceContext);
assert.ok(
  capabilityRefs.some((ref) => ref.capability_id === "organization_calendar.calendar.read.read"),
);

const mergedCapabilities = mergeWorkspaceCapabilities([], workspaceContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildWorkspaceSchemaEntities(workspaceContext, [
  "calendar.view",
  "tasks.view",
  "documents.view",
]);
assert.ok(schemaEntities.length > 0);

const readTools = buildWorkspaceReadToolDefinitions({
  workspaceContext,
  effectivePermissions: ["calendar.view", "tasks.view", "documents.view"],
});
assert.ok(readTools.length > 0);
assert.equal(readTools.every((tool) => tool.enabled), false);

const draftCapability = workspaceContext.capabilities.find(
  (capability) => capability.capability_id === "support_email_drafts.email.draft.write",
);
assert.ok(draftCapability);

const writeActions = buildWorkspaceActionDefinitions({
  workspaceContext,
  effectivePermissions: ["calendar.manage", "tasks.manage", "documents.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(writeActions.length > 0);
const reversibleActions = writeActions.filter((action) => action.reversible);
assert.ok(reversibleActions.length > 0);
assert.ok(reversibleActions.every((action) => action.approval_required));
assert.ok(reversibleActions.every((action) => action.risk_level <= 2));

const draftDefinition = buildActionDefinitionFromWorkspaceCapability(draftCapability!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(draftDefinition);
assert.equal(draftDefinition?.source, "workspace_provider");
assert.equal(draftDefinition?.approval_required, true);

const deniedContext = createEmptyCompanionWorkspaceContext({ permission_denied: true });
assert.equal(filterWorkspaceCapabilitiesForPrivacy(deniedContext).length, 0);
assert.equal(listEnabledWorkspaceCapabilities(deniedContext).length, 0);

const tenantContext = createEmptyCompanionTenantContext({ workspaceContext });
const t = (key: string) => key;

assert.equal(hasWorkspaceProviderIntent("show calendar appointments"), true);
assert.equal(hasExternalWorkspaceConnectorIntent("external inbox oauth mailbox"), true);

const match = matchWorkspaceProviderQuery("calendar appointments this week", tenantContext);
assert.ok(match);
assert.equal(match?.provider_key, "organization_calendar");

const discovery = buildWorkspaceProviderDiscoveryAnswer(match!, workspaceContext, t);
assert.ok(discovery.directAnswer.includes("workspace.discoveryLead"));
assert.ok(discovery.explanation?.includes("workspace.privacyNote"));

const externalUnavailable = buildExternalWorkspaceUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("workspace.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveWorkspaceProviderAnswer"));
for (const brand of ["gmail", "outlook", "microsoft", "google", "slack", "teams"]) {
  assert.equal(new RegExp(`\\b${brand}\\b`, "i").test(orchestratorSource), false, brand);
}

const runtimeFiles = [
  "companion-workspace-context.ts",
  "load-companion-workspace-context.ts",
  "merge-workspace-runtime.ts",
  "workspace-answer.ts",
  "orchestrator.ts",
];
for (const file of runtimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  for (const brand of ["gmail", "outlook", "microsoft", "google", "slack", "teams"]) {
    assert.equal(new RegExp(`\\b${brand}\\b`, "i").test(source), false, `${file}:${brand}`);
  }
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"workspace"'), locale);
}

console.log("phase15 companion runtime tests passed");
