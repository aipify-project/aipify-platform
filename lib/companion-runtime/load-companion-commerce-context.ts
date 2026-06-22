import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listCommerceProviderManifests } from "@/lib/integration-intelligence/commerce/registry";
import type { CommerceProviderImplementationStatus } from "@/lib/integration-intelligence/commerce/types";
import {
  buildCommerceCapabilityRuntimeRef,
  createEmptyCompanionCommerceContext,
  type CompanionCommerceContext,
  type CommerceProviderRuntimeStatus,
} from "./companion-commerce-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function rpcEnabled(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  if (record.found === false) return false;
  if (record.has_access === false) return false;
  if (record.has_customer === false) return false;
  return true;
}

function engineEnabled(data: unknown, flagKey: string): boolean {
  if (!rpcEnabled(data)) return false;
  const record = data as Record<string, unknown>;
  const flag = record[flagKey];
  if (typeof flag === "boolean") return flag;
  return true;
}

function platformPrepared(data: unknown, platformKey: string): boolean {
  if (!data || typeof data !== "object") return false;
  const platforms = (data as Record<string, unknown>).platforms;
  if (!Array.isArray(platforms)) return false;
  return platforms.some((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const row = entry as Record<string, unknown>;
    return (
      String(row.platform_key ?? "").toLowerCase() === platformKey &&
      ["prepared", "connected"].includes(String(row.status ?? "").toLowerCase())
    );
  });
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: CommerceProviderImplementationStatus;
  retailEnabled: boolean;
  intelligenceEnabled: boolean;
  automationEnabled: boolean;
  multiStoreEnabled: boolean;
  platformPrepared: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
}): CommerceProviderRuntimeStatus {
  const verified =
    input.connectedProviders.includes(input.providerKey) || input.platformPrepared;

  let implementationStatus = input.manifestStatus;
  if (verified && input.manifestStatus === "specification_only") {
    implementationStatus = "implemented_disconnected";
  } else if (verified && input.manifestStatus === "implemented_disconnected") {
    implementationStatus = "connected";
  } else if (!verified && input.manifestStatus === "connected") {
    implementationStatus = "implemented_disconnected";
  }

  return {
    provider_key: input.providerKey,
    implementation_status: implementationStatus,
    retail_operations_enabled: input.retailEnabled,
    intelligence_enabled: input.intelligenceEnabled,
    automation_enabled: input.automationEnabled,
    multi_store_enabled: input.multiStoreEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    retail: boolean;
    intelligence: boolean;
    automation: boolean;
    multiStore: boolean;
    shopifyPrepared: boolean;
    woocommercePrepared: boolean;
    wordpressPrepared: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "commerce_retail_operations":
      return flags.retail;
    case "commerce_intelligence":
      return flags.intelligence;
    case "product_automation":
      return flags.automation;
    case "multi_store_orchestration":
      return flags.multiStore;
    case "shopify":
      return flags.shopifyPrepared || flags.retail;
    case "woocommerce":
      return flags.woocommercePrepared || flags.retail;
    case "wordpress":
      return flags.wordpressPrepared || flags.retail;
    default:
      return false;
  }
}

export async function loadCompanionCommerceContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
  },
): Promise<CompanionCommerceContext> {
  const [retailResult, intelligenceResult, automationResult, multiStoreResult] = await Promise.all([
    supabase.rpc("get_commerce_retail_operations_center"),
    supabase.rpc("get_commerce_intelligence_dashboard"),
    supabase.rpc("get_product_automation_dashboard"),
    supabase.rpc("get_multi_store_orchestration_dashboard"),
  ]);

  const permissionDenied = [retailResult, intelligenceResult, automationResult, multiStoreResult].some(
    (result) => result.error && isPermissionDeniedMessage(result.error.message),
  );

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionCommerceContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const retailEnabled = rpcEnabled(retailResult.data);
  const intelligenceEnabled = engineEnabled(intelligenceResult.data, "engine_enabled");
  const automationEnabled = engineEnabled(automationResult.data, "engine_enabled");
  const multiStoreEnabled = engineEnabled(multiStoreResult.data, "orchestration_enabled");

  const engineFlags = {
    retail: retailEnabled,
    intelligence: intelligenceEnabled,
    automation: automationEnabled,
    multiStore: multiStoreEnabled,
    shopifyPrepared: platformPrepared(retailResult.data, "shopify"),
    woocommercePrepared: platformPrepared(retailResult.data, "woocommerce"),
    wordpressPrepared: platformPrepared(retailResult.data, "wordpress"),
  };

  const autoPublishDisabled =
    automationResult.data &&
    typeof automationResult.data === "object" &&
    (automationResult.data as Record<string, unknown>).auto_publish_disabled !== false;

  const autoImportDisabled =
    intelligenceResult.data &&
    typeof intelligenceResult.data === "object" &&
    (intelligenceResult.data as Record<string, unknown>).auto_import_disabled !== false;

  const humanOversightRequired =
    Boolean(
      retailResult.data &&
        typeof retailResult.data === "object" &&
        (retailResult.data as Record<string, unknown>).abos_principle,
    ) ||
    Boolean(
      intelligenceResult.data &&
        typeof intelligenceResult.data === "object" &&
        (intelligenceResult.data as Record<string, unknown>).human_oversight_required,
    ) ||
    Boolean(
      automationResult.data &&
        typeof automationResult.data === "object" &&
        (automationResult.data as Record<string, unknown>).human_oversight_required,
    );

  const providers: CommerceProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listCommerceProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      retailEnabled: engineEnabledForProvider && manifest.source_engine === "commerce_retail_operations_pack"
        ? retailEnabled
        : retailEnabled,
      intelligenceEnabled,
      automationEnabled,
      multiStoreEnabled,
      platformPrepared:
        (manifest.provider_key === "shopify" && engineFlags.shopifyPrepared) ||
        (manifest.provider_key === "woocommerce" && engineFlags.woocommercePrepared) ||
        (manifest.provider_key === "wordpress" && engineFlags.wordpressPrepared),
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
    });

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildCommerceCapabilityRuntimeRef({
        manifest,
        providerStatus,
        capability,
        hasPermission,
      });

      if (runtimeRef) {
        capabilities.push(runtimeRef);
      }
    }
  }

  return createEmptyCompanionCommerceContext({
    retail_operations_enabled: retailEnabled,
    intelligence_enabled: intelligenceEnabled,
    automation_enabled: automationEnabled,
    multi_store_enabled: multiStoreEnabled,
    human_oversight_required: humanOversightRequired,
    auto_publish_disabled: autoPublishDisabled,
    auto_import_disabled: autoImportDisabled,
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });
}
