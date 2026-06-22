import type { AppPortalIntegrationProvider } from "./types";

export function resolveIntegrationProviderDisplayName(
  providerKey: string,
  providers: AppPortalIntegrationProvider[],
  providerNameLabels: Record<string, string>
): string {
  const fromHub = providers.find((p) => p.provider_key === providerKey)?.display_name;
  if (fromHub?.trim()) return fromHub.trim();

  const fromLabels = providerNameLabels[providerKey];
  if (fromLabels?.trim()) return fromLabels.trim();

  return providerKey.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function interpolateIntegrationLabel(template: string, provider: string): string {
  return template.replace(/\{provider\}/g, provider);
}
