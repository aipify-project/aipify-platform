import { ANALYTICS_BLOCKED_CAPABILITY_KEYS } from "@/lib/integration-intelligence/analytics/types";
import { ANALYTICS_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/analytics/manifests";
import { PROACTIVE_BLOCKED_CAPABILITY_KEYS } from "@/lib/integration-intelligence/proactive/types";
import { PROACTIVE_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/proactive/manifests";
import { COMMUNITY_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/community/manifests";
import { SECURITY_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/security/manifests";
import { SALES_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/sales/manifests";
import { FINANCE_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/finance/manifests";
import { WAREHOUSE_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/warehouse/manifests";
import { HR_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/hr/manifests";
import { HOSTS_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/hosts/manifests";
import { INDUSTRY_PACK_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/industry-packs/manifests";
import { SUPPORT_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/support/manifests";
import { SERVICES_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/services/manifests";
import { COMMERCE_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/commerce/manifests";
import { WORKSPACE_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/workspace/manifests";
import { MEDIA_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/media/manifests";
import { CREATIVE_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/creative/manifests";
import { DIRECTORY_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/directory/manifests";

export type CommercialCapabilityTier =
  | "core"
  | "business_pack"
  | "provider"
  | "organization_specific";

export type CommercialCapabilityStatus =
  | "production_ready"
  | "connected_but_partial"
  | "manifest_only"
  | "adapter_missing"
  | "specification_only"
  | "blocked_by_governance"
  | "disabled";

export type CommercialCapabilityEntry = {
  capability_id: string;
  provider_key: string;
  capability_key: string;
  operation: string;
  tier: CommercialCapabilityTier;
  status: CommercialCapabilityStatus;
  implementation_status: string;
  adapter_available: boolean;
  business_pack_key: string | null;
};

type GenericManifest = {
  provider_key: string;
  implementation_status: string;
  business_pack_key?: string | null;
  capabilities: readonly {
    capability_key: string;
    operation: string;
    adapter_available: boolean;
    approval_required?: boolean;
    privacy_sensitive?: boolean;
  }[];
};

const BLOCKED_CAPABILITY_KEYS = new Set<string>([
  ...PROACTIVE_BLOCKED_CAPABILITY_KEYS,
  ...ANALYTICS_BLOCKED_CAPABILITY_KEYS,
]);

const PROVIDER_MANIFEST_GROUPS: readonly { domain: string; manifests: readonly GenericManifest[] }[] =
  [
    { domain: "proactive", manifests: PROACTIVE_PROVIDER_MANIFESTS },
    { domain: "analytics", manifests: ANALYTICS_PROVIDER_MANIFESTS },
    { domain: "community", manifests: COMMUNITY_PROVIDER_MANIFESTS },
    { domain: "security", manifests: SECURITY_PROVIDER_MANIFESTS },
    { domain: "sales", manifests: SALES_PROVIDER_MANIFESTS },
    { domain: "finance", manifests: FINANCE_PROVIDER_MANIFESTS },
    { domain: "warehouse", manifests: WAREHOUSE_PROVIDER_MANIFESTS },
    { domain: "hr", manifests: HR_PROVIDER_MANIFESTS },
    { domain: "hosts", manifests: HOSTS_PROVIDER_MANIFESTS },
    { domain: "industry_packs", manifests: INDUSTRY_PACK_PROVIDER_MANIFESTS },
    { domain: "support", manifests: SUPPORT_PROVIDER_MANIFESTS },
    { domain: "services", manifests: SERVICES_PROVIDER_MANIFESTS },
    { domain: "commerce", manifests: COMMERCE_PROVIDER_MANIFESTS },
    { domain: "workspace", manifests: WORKSPACE_PROVIDER_MANIFESTS },
    { domain: "media", manifests: MEDIA_PROVIDER_MANIFESTS },
    { domain: "creative", manifests: CREATIVE_PROVIDER_MANIFESTS },
    { domain: "directory", manifests: DIRECTORY_PROVIDER_MANIFESTS },
  ];

function resolveCapabilityTier(manifest: GenericManifest): CommercialCapabilityTier {
  if (manifest.business_pack_key) return "business_pack";
  return "provider";
}

function classifyCapabilityStatus(
  manifest: GenericManifest,
  capability: GenericManifest["capabilities"][number],
): CommercialCapabilityStatus {
  if (BLOCKED_CAPABILITY_KEYS.has(capability.capability_key)) {
    return "blocked_by_governance";
  }

  if (manifest.implementation_status === "specification_only") {
    return "specification_only";
  }

  if (manifest.implementation_status === "placeholder") {
    return "manifest_only";
  }

  if (capability.adapter_available) {
    return manifest.implementation_status === "connected" ? "production_ready" : "connected_but_partial";
  }

  if (
    manifest.implementation_status === "connected" ||
    manifest.implementation_status === "partial" ||
    manifest.implementation_status === "implemented_disconnected"
  ) {
    return "adapter_missing";
  }

  return "manifest_only";
}

export function buildCommercialCapabilityMatrix(): CommercialCapabilityEntry[] {
  const entries: CommercialCapabilityEntry[] = [];

  for (const group of PROVIDER_MANIFEST_GROUPS) {
    for (const manifest of group.manifests) {
      for (const capability of manifest.capabilities) {
        entries.push({
          capability_id: `${manifest.provider_key}.${capability.capability_key}.${capability.operation}`,
          provider_key: manifest.provider_key,
          capability_key: capability.capability_key,
          operation: capability.operation,
          tier: resolveCapabilityTier(manifest),
          status: classifyCapabilityStatus(manifest, capability),
          implementation_status: manifest.implementation_status,
          adapter_available: capability.adapter_available,
          business_pack_key: manifest.business_pack_key ?? null,
        });
      }
    }
  }

  return entries;
}

export function summarizeCommercialCapabilityMatrix(entries: readonly CommercialCapabilityEntry[]): Record<
  CommercialCapabilityStatus,
  number
> {
  const summary: Record<CommercialCapabilityStatus, number> = {
    production_ready: 0,
    connected_but_partial: 0,
    manifest_only: 0,
    adapter_missing: 0,
    specification_only: 0,
    blocked_by_governance: 0,
    disabled: 0,
  };

  for (const entry of entries) {
    summary[entry.status] += 1;
  }

  return summary;
}

/** Manifest-only or spec-only capabilities must never be labeled production-ready in UI copy helpers. */
export function assertNoManifestOnlyMarkedProductionReady(
  entries: readonly CommercialCapabilityEntry[],
): boolean {
  return !entries.some(
    (entry) =>
      entry.status === "production_ready" &&
      (entry.implementation_status === "specification_only" ||
        entry.implementation_status === "placeholder"),
  );
}

export function listSpecificationOnlyProviders(): string[] {
  const providers = new Set<string>();
  for (const group of PROVIDER_MANIFEST_GROUPS) {
    for (const manifest of group.manifests) {
      if (manifest.implementation_status === "specification_only") {
        providers.add(manifest.provider_key);
      }
    }
  }
  return [...providers].sort();
}
