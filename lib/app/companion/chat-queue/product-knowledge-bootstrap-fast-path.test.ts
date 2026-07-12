import assert from "node:assert/strict";
import { bootstrapCompanionWorkerTenantRuntime } from "./load-worker-tenant-context";
import { resolveCompanionTurnTimeoutMs } from "./worker-route-timeout";
import { classifyCompanionTurnRoute } from "@/lib/companion-runtime/companion-turn-route";
import { isPlatformProductKnowledgeQuery } from "@/lib/companion-platform-knowledge/aipify-core-runtime";

const workerProfileStub = {
  customerId: "customer-1",
  user: { id: "user-1", role: "owner" as const },
  company: { id: "company-1" },
};

function createMinimalBootstrapRpcPayload() {
  return {
    ok: true,
    scope: {
      tenant_id: workerProfileStub.customerId,
      user_id: workerProfileStub.user.id,
      customer_id: workerProfileStub.customerId,
      company_id: workerProfileStub.company.id,
      organization_id: "org-example-1",
      user_role: workerProfileStub.user.role,
      organization_role: "owner",
    },
    organization_context: {
      organization_name: "Example Organization",
      plan_name: "Business",
      license_status: "active",
      default_language: "no",
    },
    identity_permissions: { user_permissions: [] },
    customer_license_center: { subscription: { plan_key: "business", status: "active" } },
    integrations_hub: { connections: [] },
    identity_center: null,
    assistant_identity: null,
    personality_card: null,
    companion_identity_relationship: null,
    install_discovery_context: null,
    install_discovery_center: null,
    support_operations_center: null,
    executive_command_center: null,
    marketplace_summary: { installed_pack_keys: [] },
    license_subscription_center: null,
    memory_center_preferences: null,
    learning_center: null,
  };
}

function createTrackingSupabase() {
  const rpcCalls: string[] = [];
  const supabase = {
    rpc: async (fn: string) => {
      rpcCalls.push(fn);
      if (fn === "companion_worker_get_runtime_bootstrap") {
        return { data: createMinimalBootstrapRpcPayload(), error: null };
      }
      if (fn === "get_companion_calendar_context") {
        return { data: { ok: true }, error: null };
      }
      return { data: null, error: null };
    },
    getRpcCalls: () => [...rpcCalls],
  };
  return supabase;
}

const query = "Hvilke løsninger har Aipify?";

async function testProductKnowledgeBootstrapFastPath() {
  const route = classifyCompanionTurnRoute(query, "no");
  assert.equal(route, "lightweight");
  assert.equal(isPlatformProductKnowledgeQuery(query), true);
  assert.equal(resolveCompanionTurnTimeoutMs(route, { query }), 15_000);

  const supabase = createTrackingSupabase();
  const result = await bootstrapCompanionWorkerTenantRuntime(
    supabase as never,
    workerProfileStub as never,
    "no",
    { query },
  );
  assert.equal(result.ok, true);

  for (const marker of [
    "get_companion_calendar_context",
    "get_organization_inventory_center",
    "get_support_ai_engine_dashboard",
    "get_organization_appointment_center",
  ]) {
    assert.equal(supabase.getRpcCalls().includes(marker), false, marker);
  }
}

async function testOperationalSupportQueryKeepsHeavyLoader() {
  const operationalQuery = "Show me all open support cases and pending orders";
  assert.notEqual(classifyCompanionTurnRoute(operationalQuery, "en"), "lightweight");

  const supabase = createTrackingSupabase();
  const result = await bootstrapCompanionWorkerTenantRuntime(
    supabase as never,
    workerProfileStub as never,
    "en",
    { query: operationalQuery },
  );
  assert.equal(result.ok, true);
  assert.ok(supabase.getRpcCalls().includes("get_companion_calendar_context"));
}

void testProductKnowledgeBootstrapFastPath()
  .then(() => testOperationalSupportQueryKeepsHeavyLoader())
  .then(() => {
    console.log("product-knowledge-bootstrap-fast-path.test.ts: all assertions passed");
  });
