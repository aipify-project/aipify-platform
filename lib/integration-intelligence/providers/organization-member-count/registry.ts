import type { OrganizationMemberCountProvider } from "./types";

const registry = new Map<string, OrganizationMemberCountProvider>();

export function registerOrganizationMemberCountProvider(
  provider: OrganizationMemberCountProvider,
): OrganizationMemberCountProvider {
  registry.set(provider.provider_key, provider);
  return provider;
}

export function listOrganizationMemberCountProviders(): readonly OrganizationMemberCountProvider[] {
  return [...registry.values()].sort((left, right) => right.priority - left.priority);
}

export function clearOrganizationMemberCountProvidersForTests(): void {
  registry.clear();
}
