import assert from "node:assert/strict";
import { buildFallbackAnswer } from "@/lib/companion-platform-knowledge/answer-builder";
import { createWorkerScopedCompanionSupabase } from "@/lib/companion-runtime/companion-worker-scoped-supabase";
import {
  parseCompanionWorkerRuntimeBootstrap,
  type CompanionWorkerRuntimeScope,
} from "@/lib/companion-runtime/companion-worker-runtime-scope";
import {
  normalizeCompanionIdentityContext,
  parseIdentityRpcPayloads,
} from "@/lib/companion-runtime/companion-identity-context";
import { parseIdentityPermissionsDashboard } from "@/lib/aipify/identity-permissions/parse";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

const scope: CompanionWorkerRuntimeScope = {
  tenantId: "tenant-a",
  userId: "user-a",
  customerId: "tenant-a",
  companyId: "company-a",
  organizationId: "tenant-a",
  userRole: "owner",
  organizationRole: "organization_owner",
};

const bootstrapPayload = {
  ok: true,
  scope: {
    tenant_id: scope.tenantId,
    user_id: scope.userId,
    customer_id: scope.customerId,
    company_id: scope.companyId,
    organization_id: scope.organizationId,
    user_role: scope.userRole,
    organization_role: scope.organizationRole,
  },
  organization_context: {
    authenticated: true,
    state: "ready",
    user_role: "owner",
    organization_role: "organization_owner",
    company_id: scope.companyId,
    customer_id: scope.customerId,
    organization_id: scope.organizationId,
    workspace_name: "Test Org",
    licensed_to: "Test Org",
    plan_name: "Business",
    license_status: "active",
    has_customer: true,
    has_organization_membership: true,
    has_app_access: true,
    can_access_self_support: true,
  },
  identity_permissions: {
    has_organization: true,
    user_permissions: ["command_brief.view", "customer_community.view"],
    current_role: "organization_owner",
  },
  customer_license_center: {
    has_customer: true,
    subscription: { plan_key: "business", subscription_status: "active" },
  },
  integrations_hub: { connections: [], providers: [] },
  identity_center: { has_customer: true, profile: { tone: "supportive" } },
  assistant_identity: { has_customer: true, preferences: { allow_encouragement: true } },
  personality_card: {
    has_customer: true,
    personality_mode: "warm_professional",
    humor_enabled: true,
  },
  companion_identity_relationship: {
    has_customer: true,
    settings: { humor_preference: "subtle", personalization_enabled: true },
  },
  install_discovery_context: { found: false, discovery_status: "empty" },
  install_discovery_center: { found: false },
  support_operations_center: { has_customer: true, performance: { open_cases: 2 } },
  executive_command_center: { found: false, has_customer: true },
  marketplace_summary: { found: false },
  license_subscription_center: { found: false },
  memory_center_preferences: { found: false },
  learning_center: { has_customer: false },
};

async function run(): Promise<void> {
  const parsedBootstrap = parseCompanionWorkerRuntimeBootstrap(bootstrapPayload);
  assert.ok(parsedBootstrap, "bootstrap parses");
  assert.equal(parsedBootstrap?.scope.tenantId, "tenant-a");

  const orgContext = parseAppOrganizationContext(parsedBootstrap!.organization_context);
  assert.equal(orgContext.state, "ready");
  assert.equal(orgContext.organization_id, "tenant-a");

  const permissions = parseIdentityPermissionsDashboard(parsedBootstrap!.identity_permissions);
  assert.ok(permissions?.user_permissions.includes("customer_community.view"));

  const identityParsed = parseIdentityRpcPayloads({
    identityCenterRaw: parsedBootstrap!.identity_center,
    assistantIdentityRaw: parsedBootstrap!.assistant_identity,
    personalityRaw: parsedBootstrap!.personality_card,
    companionRelationshipRaw: parsedBootstrap!.companion_identity_relationship,
  });
  const identityContext = normalizeCompanionIdentityContext({
    locale: "en",
    identityCenter: identityParsed.identityCenter,
    assistantIdentity: identityParsed.assistantIdentity,
    personality: identityParsed.personality,
    companionRelationship: identityParsed.companionRelationship,
  });
  assert.equal(identityContext.humor_enabled, true);
  assert.equal(identityContext.personalization_enabled, true);

  const rpcCalls: string[] = [];
  const baseSupabase = {
    rpc(fn: string) {
      rpcCalls.push(fn);
      if (fn === "companion_worker_get_customer_member_directory_center") {
        return Promise.resolve({
          data: {
            found: true,
            source_reference: "get_customer_member_directory_center",
            total_member_count: 3,
            members: [],
          },
          error: null,
        });
      }
      return Promise.resolve({ data: null, error: null });
    },
  } as unknown as import("@supabase/supabase-js").SupabaseClient;

  const scoped = createWorkerScopedCompanionSupabase(baseSupabase, scope, parsedBootstrap!);
  const directory = await scoped.rpc("get_customer_member_directory_center", {
    p_search_term: "active",
  });
  assert.equal(
    (directory.data as { source_reference?: string }).source_reference,
    "get_customer_member_directory_center",
  );
  assert.ok(rpcCalls.includes("companion_worker_get_customer_member_directory_center"));

  const wrongTenantBootstrap = parseCompanionWorkerRuntimeBootstrap({
    ...bootstrapPayload,
    scope: { ...bootstrapPayload.scope, tenant_id: "tenant-b" },
  });
  assert.ok(wrongTenantBootstrap);
  assert.notEqual(wrongTenantBootstrap?.scope.tenantId, scope.tenantId);

  const fallback = buildFallbackAnswer((key) => key, { userRole: "owner" });
  assert.equal(fallback.sources.length, 0);

  console.log("companion-worker-context-parity.test.ts passed");
}

void run().catch((error) => {
  console.error(error);
  process.exit(1);
});
