import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseCompanionDeviceEcosystemDashboard } from "@/lib/aipify/companion-device-ecosystem/parse";
import { listMediaProviderManifests } from "@/lib/integration-intelligence/media/registry";
import type { MediaProviderImplementationStatus } from "@/lib/integration-intelligence/media/types";
import {
  buildMediaCapabilityRuntimeRef,
  createEmptyCompanionMediaContext,
  type CompanionMediaContext,
  type MediaProviderRuntimeStatus,
} from "./companion-media-context";

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
  return (
    serialized.includes(`"key":"${providerKey.toLowerCase()}"`) ||
    serialized.includes(providerKey.toLowerCase())
  );
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: MediaProviderImplementationStatus;
  deviceEcosystemEnabled: boolean;
  presenceOperationsEnabled: boolean;
  deviceEcosystemBlueprint?: Record<string, unknown>;
  presenceBlueprint?: Record<string, unknown>;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
}): MediaProviderRuntimeStatus {
  const inDeviceEcosystemBlueprint = blueprintContainsProvider(
    input.deviceEcosystemBlueprint,
    input.providerKey,
  );
  const inPresenceBlueprint = blueprintContainsProvider(input.presenceBlueprint, input.providerKey);
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
    device_ecosystem_enabled:
      input.deviceEcosystemEnabled &&
      (input.providerKey === "companion_device_ecosystem" || inDeviceEcosystemBlueprint),
    presence_operations_enabled:
      input.presenceOperationsEnabled &&
      (input.providerKey === "companion_presence_devices" || inPresenceBlueprint),
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
  };
}

export async function loadCompanionMediaContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
  },
): Promise<CompanionMediaContext> {
  const [deviceEcosystemResult, presenceResult] = await Promise.all([
    supabase.rpc("get_companion_device_ecosystem_dashboard"),
    supabase.rpc("get_companion_presence_operations_center", { p_section: null }),
  ]);

  const permissionDenied =
    (deviceEcosystemResult.error && isPermissionDeniedMessage(deviceEcosystemResult.error.message)) ||
    (presenceResult.error && isPermissionDeniedMessage(presenceResult.error.message));

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionMediaContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
    });
  }

  const deviceEcosystemDashboard = parseCompanionDeviceEcosystemDashboard(deviceEcosystemResult.data);
  const presenceCenter =
    presenceResult.data && typeof presenceResult.data === "object"
      ? (presenceResult.data as Record<string, unknown>)
      : {};

  const deviceEcosystemEnabled = Boolean(deviceEcosystemDashboard.has_organization);
  const presenceOperationsEnabled = presenceCenter.found !== false;

  const deviceEcosystemBlueprint = deviceEcosystemDashboard.implementation_blueprint_phase36 as
    | Record<string, unknown>
    | undefined;
  const presenceBlueprint =
    typeof presenceCenter.device_management === "object"
      ? (presenceCenter.device_management as Record<string, unknown>)
      : undefined;

  const connectedDevices = deviceEcosystemDashboard.ecosystem_summary?.connected_devices ?? 0;
  const onlineDevices = deviceEcosystemDashboard.ecosystem_summary?.online_devices ?? 0;

  const providers: MediaProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listMediaProviderManifests()) {
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      deviceEcosystemEnabled,
      presenceOperationsEnabled,
      deviceEcosystemBlueprint,
      presenceBlueprint,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
    });

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      capabilities.push(
        buildMediaCapabilityRuntimeRef({
          manifest,
          providerStatus,
          capability,
          hasPermission,
        }),
      );
    }
  }

  return createEmptyCompanionMediaContext({
    device_ecosystem_enabled: deviceEcosystemEnabled,
    presence_operations_enabled: presenceOperationsEnabled,
    connected_devices: connectedDevices,
    online_devices: onlineDevices,
    human_oversight_required: true,
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });
}

export { createEmptyCompanionMediaContext };
