import { canvaArtifactHandoffAdapter } from "@/lib/integration-intelligence/providers/canva/artifact-handoff-adapter";
import { CANVA_ARTIFACT_HANDOFF_PROVIDER_KEY } from "@/lib/integration-intelligence/providers/canva/connect-capabilities-audit";
import {
  microsoftExcelArtifactHandoffAdapter,
  microsoftPowerpointArtifactHandoffAdapter,
  microsoftWordArtifactHandoffAdapter,
} from "@/lib/integration-intelligence/providers/microsoft365/artifact-handoff-adapter";
import type {
  ExternalArtifactHandoffAdapter,
  ExternalArtifactHandoffProviderReadiness,
} from "./types";

const registry = new Map<string, ExternalArtifactHandoffAdapter>([
  [CANVA_ARTIFACT_HANDOFF_PROVIDER_KEY, canvaArtifactHandoffAdapter],
  ["microsoft_word", microsoftWordArtifactHandoffAdapter],
  ["microsoft_excel", microsoftExcelArtifactHandoffAdapter],
  ["microsoft_powerpoint", microsoftPowerpointArtifactHandoffAdapter],
]);

export function listExternalArtifactHandoffProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function getExternalArtifactHandoffAdapter(
  providerKey: string,
): ExternalArtifactHandoffAdapter | null {
  return registry.get(providerKey.trim().toLowerCase()) ?? null;
}

export function isExternalArtifactHandoffProviderRegistered(providerKey: string): boolean {
  return registry.has(providerKey.trim().toLowerCase());
}

export function getExternalArtifactHandoffProviderReadiness(
  providerKey: string,
  connectionConnected = false,
): ExternalArtifactHandoffProviderReadiness {
  const adapter = getExternalArtifactHandoffAdapter(providerKey);
  if (!adapter) return "adapter_missing";
  if (adapter.readiness === "partial" && !connectionConnected) return "partial";
  if (adapter.readiness === "partial" && connectionConnected) return "adapter_available";
  return adapter.readiness;
}

export function listExternalArtifactHandoffCapabilities(
  providerKey: string,
): readonly string[] {
  return getExternalArtifactHandoffAdapter(providerKey)?.capabilities ?? [];
}
