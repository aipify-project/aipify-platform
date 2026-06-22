import { WORKSPACE_PROVIDER_MANIFESTS } from "./manifests";
import type { WorkspaceProviderManifest } from "./types";

const registry = new Map<string, WorkspaceProviderManifest>(
  WORKSPACE_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listWorkspaceProviderManifests(): readonly WorkspaceProviderManifest[] {
  return WORKSPACE_PROVIDER_MANIFESTS;
}

export function getWorkspaceProviderManifest(
  providerKey: string,
): WorkspaceProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerWorkspaceProviderManifest(
  manifest: WorkspaceProviderManifest,
): WorkspaceProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listWorkspaceProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function workspaceProviderHasCapability(
  manifest: WorkspaceProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) => capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
