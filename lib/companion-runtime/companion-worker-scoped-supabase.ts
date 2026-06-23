import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CompanionWorkerRuntimeBootstrap,
  CompanionWorkerRuntimeScope,
} from "./companion-worker-runtime-scope";
import { parseCompanionWorkerRuntimeBootstrap } from "./companion-worker-runtime-scope";

const BOOTSTRAP_RPC_MAP: Record<string, keyof CompanionWorkerRuntimeBootstrap> = {
  get_app_organization_context: "organization_context",
  get_identity_permissions_dashboard: "identity_permissions",
  get_customer_license_center: "customer_license_center",
  get_app_portal_integrations_hub: "integrations_hub",
  get_customer_identity_center: "identity_center",
  get_assistant_identity_profile: "assistant_identity",
  get_personality_card: "personality_card",
  get_companion_identity_relationship_center: "companion_identity_relationship",
  get_companion_install_discovery_context: "install_discovery_context",
  get_install_discovery_data_connection_center: "install_discovery_center",
  get_customer_support_operations_center: "support_operations_center",
  get_organization_executive_command_center: "executive_command_center",
  get_my_marketplace_summary: "marketplace_summary",
  get_license_subscription_center: "license_subscription_center",
  get_organization_memory_center: "memory_center_preferences",
  get_customer_learning_center: "learning_center",
};

const WORKER_RPC_MAP: Record<string, string> = {
  get_customer_member_directory_center: "companion_worker_get_customer_member_directory_center",
  get_customer_member_verification_center: "companion_worker_get_customer_member_verification_center",
  get_playful_bell_moment: "companion_worker_get_playful_bell_moment",
};

type RpcResult = { data: unknown; error: { message: string } | null };

function injectWorkerScope(
  fn: string,
  scope: CompanionWorkerRuntimeScope,
  params?: Record<string, unknown>,
): Record<string, unknown> {
  const base = { ...(params ?? {}) };
  if (
    fn === "companion_worker_get_customer_member_directory_center" ||
    fn === "companion_worker_get_customer_member_verification_center" ||
    fn === "companion_worker_get_customer_support_operations_center" ||
    fn === "companion_worker_get_playful_bell_moment"
  ) {
    return {
      ...base,
      p_tenant_id: scope.tenantId,
      p_user_id: scope.userId,
    };
  }
  return base;
}

/**
 * Service-role worker client that replays session RPCs from bootstrap payloads
 * and routes tenant-scoped reads through companion_worker_* RPCs.
 */
export function createWorkerScopedCompanionSupabase(
  base: SupabaseClient,
  scope: CompanionWorkerRuntimeScope,
  bootstrap: CompanionWorkerRuntimeBootstrap,
): SupabaseClient {
  const originalRpc = base.rpc.bind(base);

  const scopedRpc = async (
    fn: string,
    params?: Record<string, unknown>,
  ): Promise<RpcResult> => {
    const bootstrapKey = BOOTSTRAP_RPC_MAP[fn];
    if (bootstrapKey && bootstrap[bootstrapKey] != null) {
      return { data: bootstrap[bootstrapKey], error: null };
    }

    const workerFn = WORKER_RPC_MAP[fn];
    if (workerFn) {
      if (fn === "get_customer_support_operations_center") {
        return originalRpc(
          "companion_worker_get_customer_support_operations_center",
          injectWorkerScope("companion_worker_get_customer_support_operations_center", scope, params),
        );
      }
      return originalRpc(workerFn, injectWorkerScope(workerFn, scope, params));
    }

    return originalRpc(fn, params);
  };

  return new Proxy(base, {
    get(target, prop, receiver) {
      if (prop === "rpc") {
        return scopedRpc;
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as SupabaseClient;
}

export async function fetchCompanionWorkerRuntimeBootstrap(
  supabase: SupabaseClient,
  tenantId: string,
  userId: string,
  locale: string,
): Promise<CompanionWorkerRuntimeBootstrap | null> {
  const { data, error } = await supabase.rpc("companion_worker_get_runtime_bootstrap", {
    p_tenant_id: tenantId,
    p_user_id: userId,
    p_locale: locale,
  });

  if (error) return null;
  return parseCompanionWorkerRuntimeBootstrap(data);
}

export { parseCompanionWorkerRuntimeBootstrap } from "./companion-worker-runtime-scope";
