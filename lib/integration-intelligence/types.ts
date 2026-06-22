import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";

export type IntegrationCapabilityKey = "platform_snapshot" | "connection_status";

export type IntegrationEntityType = "module" | "feature" | "metric";

export type LocalizedAliases = Partial<Record<CustomerActiveLocale | "en", readonly string[]>>;

export type LocalizedDisplayNames = Partial<Record<CustomerActiveLocale | "en", string>>;

export type IntegrationManifestEntity = {
  type: IntegrationEntityType;
  key: string;
  displayNameKey?: string;
  displayNames?: LocalizedDisplayNames;
  aliases?: LocalizedAliases;
};

export type IntegrationCapabilityManifest = {
  key: IntegrationCapabilityKey;
  description: string;
  fields: readonly string[];
};

export type IntegrationProviderManifest = {
  provider: string;
  displayName: string;
  displayNameKey?: string;
  capabilities: readonly IntegrationCapabilityManifest[];
  entities: readonly IntegrationManifestEntity[];
};

export type GenericIntegrationIntentKind =
  | "connection_status"
  | "platform_availability"
  | "platform_environment"
  | "platform_version"
  | "platform_supported_languages"
  | "list_capabilities"
  | "entity_active_status"
  | "platform_checked_at"
  | "full_platform_summary"
  | "visibility_summary"
  | "unsupported_metric"
  | "forbidden_data_request";

export type IntegrationPresentationMode = "direct_fact" | "multi_item_summary" | "full_snapshot";

export type GenericIntegrationIntent = {
  providerKey: string;
  requiresLive: boolean;
  blocksKnowledgeCenter: boolean;
  queryKind: GenericIntegrationIntentKind;
  presentationMode: IntegrationPresentationMode;
  capability: IntegrationCapabilityKey;
  targetEntityKeys?: readonly string[];
};

export type NormalizedActiveModule = {
  key: string;
  active: boolean;
};

export type NormalizedPlatformSnapshotData = {
  availability: "available" | "degraded" | "maintenance";
  environment: string;
  version: string | null;
  supportedLocales: readonly string[];
  activeModules: readonly NormalizedActiveModule[];
  checkedAt: string;
};

export type NormalizedIntegrationSource = {
  type: "verified_integration";
  readOnly: true;
  labelKey: string;
};

export type NormalizedIntegrationToolResult =
  | {
      status: "success";
      provider: string;
      capability: IntegrationCapabilityKey;
      data: NormalizedPlatformSnapshotData;
      source: NormalizedIntegrationSource;
      toolName: string;
    }
  | {
      status: "failure";
      provider: string;
      capability: IntegrationCapabilityKey;
      failureCode: string;
      source: NormalizedIntegrationSource;
      toolName: string;
    };

export type IntegrationIntelligenceContext = {
  activeProviderKey?: string | null;
  snapshotContext?: {
    activeModuleKeys?: readonly string[];
  };
};

export type CompanionLiveToolName =
  | "get_platform_snapshot"
  | "get_connection_status"
  | "forbidden_data_denied"
  | "unsupported_live_metric"
  | "none";
