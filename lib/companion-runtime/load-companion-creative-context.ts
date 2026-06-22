import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseAipifyDesktopCompanionCreativeBridgeEngineDashboard } from "@/lib/aipify/aipify-desktop-companion-creative-bridge-engine/parse";
import { parseAipifyStudioCreativeIntelligenceEngineDashboard } from "@/lib/aipify/aipify-studio-creative-intelligence-engine/parse";
import { listCreativeProviderManifests } from "@/lib/integration-intelligence/creative/registry";
import type { CreativeProviderImplementationStatus } from "@/lib/integration-intelligence/creative/types";
import {
  buildCreativeCapabilityRuntimeRef,
  createEmptyCompanionCreativeContext,
  type CompanionCreativeContext,
  type CreativeProviderRuntimeStatus,
} from "./companion-creative-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function blueprintContainsProvider(
  blueprint: Record<string, unknown> | undefined,
  providerKey: string,
): boolean {
  if (!blueprint) return false;
  const serialized = JSON.stringify(blueprint).toLowerCase();
  return serialized.includes(`"key":"${providerKey.toLowerCase()}"`) || serialized.includes(providerKey.toLowerCase());
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: CreativeProviderImplementationStatus;
  studioEnabled: boolean;
  bridgeEnabled: boolean;
  studioBlueprint?: Record<string, unknown>;
  bridgeBlueprint?: Record<string, unknown>;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
}): CreativeProviderRuntimeStatus {
  const inStudioBlueprint = blueprintContainsProvider(input.studioBlueprint, input.providerKey);
  const inBridgeBlueprint = blueprintContainsProvider(input.bridgeBlueprint, input.providerKey);
  const verified = input.connectedProviders.includes(input.providerKey);

  let implementationStatus = input.manifestStatus;
  if (verified && input.manifestStatus === "implemented_disconnected") {
    implementationStatus = "connected";
  } else if (!verified && input.manifestStatus === "connected") {
    implementationStatus = "implemented_disconnected";
  }

  return {
    provider_key: input.providerKey,
    implementation_status: implementationStatus,
    studio_enabled: input.studioEnabled && inStudioBlueprint,
    bridge_enabled: input.bridgeEnabled && inBridgeBlueprint,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
  };
}

export async function loadCompanionCreativeContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
  },
): Promise<CompanionCreativeContext> {
  const [studioResult, bridgeResult] = await Promise.all([
    supabase.rpc("get_aipify_studio_creative_intelligence_engine_dashboard"),
    supabase.rpc("get_aipify_desktop_companion_creative_bridge_engine_dashboard"),
  ]);

  const permissionDenied =
    (studioResult.error && isPermissionDeniedMessage(studioResult.error.message)) ||
    (bridgeResult.error && isPermissionDeniedMessage(bridgeResult.error.message));

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionCreativeContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
    });
  }

  const studioDashboard = parseAipifyStudioCreativeIntelligenceEngineDashboard(studioResult.data);
  const bridgeDashboard = parseAipifyDesktopCompanionCreativeBridgeEngineDashboard(bridgeResult.data);

  const studioEnabled = Boolean(studioDashboard.enabled && studioDashboard.has_customer);
  const bridgeEnabled = Boolean(bridgeDashboard.enabled && bridgeDashboard.has_customer);

  const studioBlueprint = studioDashboard.aipify_studio_creative_intelligence_blueprint as
    | Record<string, unknown>
    | undefined;
  const bridgeBlueprint = bridgeDashboard.aipify_desktop_companion_creative_bridge_blueprint as
    | Record<string, unknown>
    | undefined;

  const providers: CreativeProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listCreativeProviderManifests()) {
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      studioEnabled,
      bridgeEnabled,
      studioBlueprint,
      bridgeBlueprint,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
    });

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      capabilities.push(
        buildCreativeCapabilityRuntimeRef({
          manifest,
          providerStatus,
          capability,
          hasPermission,
        }),
      );
    }
  }

  return createEmptyCompanionCreativeContext({
    studio_enabled: studioEnabled,
    bridge_enabled: bridgeEnabled,
    human_oversight_required:
      Boolean(studioDashboard.human_oversight_required) ||
      Boolean(bridgeDashboard.human_oversight_required),
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });
}

export { createEmptyCompanionCreativeContext };
