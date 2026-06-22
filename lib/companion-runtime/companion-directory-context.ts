import type { DirectoryProviderManifest } from "@/lib/integration-intelligence/directory/types";
import { buildDirectoryCapabilityId } from "@/lib/integration-intelligence/directory/types";

export type CompanionDirectoryProviderStatus = {
  provider_key: string;
  implementation_status: string;
  adapter_available: boolean;
  active: boolean;
  business_pack_key: string | null;
};

export type CompanionDirectoryCapabilityRef = {
  capability_id: string;
  provider_key: string;
  capability_key: string;
  operation: string;
  adapter_available: boolean;
  privacy_sensitive: boolean;
  supported_search_fields: readonly string[];
};

export type CompanionDirectoryCommandBriefSignal = {
  signal_key: string;
  count: number | null;
};

export type CompanionDirectoryContext = {
  organization_id: string;
  tenant_id: string;
  providers: CompanionDirectoryProviderStatus[];
  capabilities: CompanionDirectoryCapabilityRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  audit_required: boolean;
  export_blocked: boolean;
  app_employee_adapter_connected?: boolean;
  app_employee_source_exact?: boolean;
  employee_candidate_count?: number;
  command_brief_signals?: readonly CompanionDirectoryCommandBriefSignal[];
  employee_directory_limitations?: readonly string[];
  crm_adapter_connected?: boolean;
  crm_source_exact?: boolean;
  crm_candidate_count?: number;
  crm_command_brief_signals?: readonly CompanionDirectoryCommandBriefSignal[];
  crm_directory_limitations?: readonly string[];
  supplier_adapter_connected?: boolean;
  supplier_source_exact?: boolean;
  supplier_candidate_count?: number;
  supplier_command_brief_signals?: readonly CompanionDirectoryCommandBriefSignal[];
  supplier_directory_limitations?: readonly string[];
};

export function createEmptyCompanionDirectoryContext(input: {
  organization_id: string;
  tenant_id: string;
}): CompanionDirectoryContext {
  return {
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    audit_required: true,
    export_blocked: true,
  };
}

export function buildCompanionDirectoryContextFromManifests(input: {
  organization_id: string;
  tenant_id: string;
  manifests: readonly DirectoryProviderManifest[];
  connectedProviders?: readonly string[];
}): CompanionDirectoryContext {
  const connected = new Set(input.connectedProviders ?? []);
  const providers: CompanionDirectoryProviderStatus[] = [];
  const capabilities: CompanionDirectoryCapabilityRef[] = [];

  for (const manifest of input.manifests) {
    const active = connected.has(manifest.provider_key);
    providers.push({
      provider_key: manifest.provider_key,
      implementation_status: manifest.implementation_status,
      adapter_available: manifest.capabilities.some((capability) => capability.adapter_available),
      active,
      business_pack_key: manifest.business_pack_key,
    });
    for (const capability of manifest.capabilities) {
      capabilities.push({
        capability_id: buildDirectoryCapabilityId(manifest.provider_key, capability.capability_key, capability.operation),
        provider_key: manifest.provider_key,
        capability_key: capability.capability_key,
        operation: capability.operation,
        adapter_available: capability.adapter_available,
        privacy_sensitive: capability.privacy_sensitive,
        supported_search_fields: capability.supported_search_fields ?? [],
      });
    }
  }

  return {
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: false,
    audit_required: true,
    export_blocked: true,
  };
}
