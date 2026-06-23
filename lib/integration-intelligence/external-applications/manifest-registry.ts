import { EXTERNAL_APPLICATION_MANIFESTS } from "./manifests";
import type { ExternalApplicationManifest } from "@/lib/companion-runtime/external-application-orchestration";

const registry = new Map<string, ExternalApplicationManifest>(
  EXTERNAL_APPLICATION_MANIFESTS.map((manifest) => [manifest.application_key, manifest]),
);

export function listExternalApplicationManifests(): readonly ExternalApplicationManifest[] {
  return EXTERNAL_APPLICATION_MANIFESTS;
}

export function getExternalApplicationManifest(
  applicationKey: string,
): ExternalApplicationManifest | null {
  return registry.get(applicationKey.trim().toLowerCase()) ?? null;
}

export function listExternalApplicationKeys(): readonly string[] {
  return [...registry.keys()];
}

export function summarizeExternalApplicationRegistry(): {
  total: number;
  by_readiness: Record<string, number>;
  by_adapter_type: Record<string, number>;
  handoff_registered: readonly string[];
} {
  const byReadiness: Record<string, number> = {};
  const byAdapterType: Record<string, number> = {};

  for (const manifest of EXTERNAL_APPLICATION_MANIFESTS) {
    byReadiness[manifest.readiness] = (byReadiness[manifest.readiness] ?? 0) + 1;
    byAdapterType[manifest.adapter_type] = (byAdapterType[manifest.adapter_type] ?? 0) + 1;
  }

  return {
    total: EXTERNAL_APPLICATION_MANIFESTS.length,
    by_readiness: byReadiness,
    by_adapter_type: byAdapterType,
    handoff_registered: EXTERNAL_APPLICATION_MANIFESTS.filter((manifest) =>
      manifest.capabilities.some(
        (capability) => capability.operation === "handoff" && capability.adapter_registered,
      ),
    ).map((manifest) => manifest.application_key),
  };
}
