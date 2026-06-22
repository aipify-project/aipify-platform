export type CreativeProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type CreativeCapabilityOperation = "read" | "write";

export type CreativeCapabilityKey =
  | "design.read"
  | "design.create"
  | "design.from_template"
  | "image.generate"
  | "image.edit"
  | "video.create"
  | "video.edit"
  | "media.export"
  | "brand_kit.read"
  | "presentation.create";

export type CreativeCapabilityManifest = {
  capability_key: CreativeCapabilityKey;
  operation: CreativeCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
};

export type CreativeProviderSourceEngine = "studio_byol" | "studio_module" | "bridge_app";

export type CreativeProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: CreativeProviderSourceEngine;
  implementation_status: CreativeProviderImplementationStatus;
  capabilities: readonly CreativeCapabilityManifest[];
  search_terms_key: string;
};

export function buildCreativeCapabilityId(
  providerKey: string,
  capabilityKey: CreativeCapabilityKey,
  operation: CreativeCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}
