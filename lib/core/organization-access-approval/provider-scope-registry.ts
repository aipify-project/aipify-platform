import type {
  OrganizationAccessConsentType,
  OrganizationProviderAccessManifest,
} from "./types";

export type OrganizationProviderAccessManifestEntry = Omit<
  OrganizationProviderAccessManifest,
  "consent_type"
> & {
  consent_type?: OrganizationAccessConsentType;
};

/** Generic provider scope manifests — no customer-specific providers. */
const MANIFEST_ENTRIES: readonly OrganizationProviderAccessManifestEntry[] = [
  {
    provider_key: "community_member_directory",
    provider_label_key: "customerApp.organizationAccessApproval.providers.communityMemberDirectory.label",
    data_type_label_key: "customerApp.organizationAccessApproval.providers.communityMemberDirectory.dataType",
    why_needed_label_key: "customerApp.organizationAccessApproval.providers.communityMemberDirectory.whyNeeded",
    resource_ownership: "organization_owned_resource",
    consent_type: "organization_access_approval",
    search_terms: ["medlem", "member", "medlemmer", "members", "medlemsregister", "member directory"],
    required_scopes: [
      {
        scope_key: "community.members.read",
        permission_key: "customer_community.view",
        label_key: "customerApp.organizationAccessApproval.scopes.communityMembersRead",
        risk_level: 1,
        default_access_mode: "ongoing",
        default_duration_hours: null,
      },
    ],
  },
  {
    provider_key: "organization_member_count",
    provider_label_key: "customerApp.organizationAccessApproval.providers.memberCount.label",
    data_type_label_key: "customerApp.organizationAccessApproval.providers.memberCount.dataType",
    why_needed_label_key: "customerApp.organizationAccessApproval.providers.memberCount.whyNeeded",
    resource_ownership: "organization_owned_resource",
    consent_type: "organization_access_approval",
    search_terms: ["medlemstall", "member count", "hvor mange medlemmer", "how many members", "antall medlemmer"],
    required_scopes: [
      {
        scope_key: "organization.members.count.read",
        permission_key: "customer_community.view",
        label_key: "customerApp.organizationAccessApproval.scopes.memberCountRead",
        risk_level: 1,
        default_access_mode: "one_time",
        default_duration_hours: 24,
      },
    ],
  },
  {
    provider_key: "autonomous_support_operations",
    provider_label_key: "customerApp.organizationAccessApproval.providers.supportOperations.label",
    data_type_label_key: "customerApp.organizationAccessApproval.providers.supportOperations.dataType",
    why_needed_label_key: "customerApp.organizationAccessApproval.providers.supportOperations.whyNeeded",
    consent_type: "business_pack_entitlement",
    required_scopes: [
      {
        scope_key: "support.queue.read",
        permission_key: "support.view_metrics",
        label_key: "customerApp.organizationAccessApproval.scopes.supportQueueRead",
        risk_level: 1,
        default_access_mode: "ongoing",
        default_duration_hours: null,
      },
    ],
  },
  {
    provider_key: "member_verification",
    provider_label_key: "customerApp.organizationAccessApproval.providers.memberVerification.label",
    data_type_label_key: "customerApp.organizationAccessApproval.providers.memberVerification.dataType",
    why_needed_label_key: "customerApp.organizationAccessApproval.providers.memberVerification.whyNeeded",
    required_scopes: [
      {
        scope_key: "verification.queue.read",
        permission_key: "moderation.review",
        label_key: "customerApp.organizationAccessApproval.scopes.verificationQueueRead",
        risk_level: 2,
        default_access_mode: "one_time",
        default_duration_hours: 8,
      },
    ],
  },
];

export const ORGANIZATION_PROVIDER_ACCESS_MANIFESTS =
  MANIFEST_ENTRIES as readonly OrganizationProviderAccessManifest[];

const PROVIDER_KEY_ALIASES: Record<string, string> = {
  member_verification_center: "member_verification",
  community_member_verification: "member_verification",
  command_brief: "community_member_directory",
};

export function normalizeOrganizationAccessProviderKey(providerKey: string): string {
  return PROVIDER_KEY_ALIASES[providerKey] ?? providerKey;
}

function resolveProviderAccessManifestEntry(
  providerKey: string,
): OrganizationProviderAccessManifestEntry | null {
  const normalized = normalizeOrganizationAccessProviderKey(providerKey);
  return MANIFEST_ENTRIES.find((entry) => entry.provider_key === normalized) ?? null;
}

export function resolveOrganizationAccessConsentType(
  providerKey: string,
): OrganizationAccessConsentType {
  return resolveProviderAccessManifestEntry(providerKey)?.consent_type ?? "organization_access_approval";
}

export function resolveProviderAccessManifest(
  providerKey: string,
): OrganizationProviderAccessManifest | null {
  return resolveProviderAccessManifestEntry(providerKey) as OrganizationProviderAccessManifest | null;
}

export function resolveScopesForCapability(input: {
  provider_key: string;
  capability_key?: string | null;
}): string[] {
  const manifest = resolveProviderAccessManifest(input.provider_key);
  if (!manifest) return [];
  return manifest.required_scopes.map((scope) => scope.scope_key);
}

export function resolveMissingScopePermissionKeys(scopeKeys: readonly string[]): string[] {
  const keys = new Set<string>();
  for (const manifest of ORGANIZATION_PROVIDER_ACCESS_MANIFESTS) {
    for (const scope of manifest.required_scopes) {
      if (scopeKeys.includes(scope.scope_key)) {
        keys.add(scope.permission_key);
      }
    }
  }
  return [...keys];
}
