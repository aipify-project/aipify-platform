import type { CompanionSemanticCapabilityDescriptor } from "@/lib/integration-intelligence/semantic/types";
import { SUPPORT_SEMANTIC_DESCRIPTORS, type SupportSemanticDescriptor } from "./support-semantic-intent";
import { collectVerificationDescriptorsFromManifests } from "./verification-semantic-intent";
import { listCommunityProviderManifests } from "@/lib/integration-intelligence/community/registry";
import { DIRECTORY_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/directory/manifests";
import { listSupportProviderManifests } from "@/lib/integration-intelligence/support/registry";
import { collectDirectoryRelationshipDescriptorsFromManifests } from "./directory-semantic-intent";

/** Frozen Core registry — maps generic organization intent to registered capabilities. */
export type OrganizationCapabilityModuleId =
  | "directory.community_member"
  | "verification.member"
  | "support.case"
  | "support.sla"
  | "organization.priority_signals";

export type OrganizationCapabilityDefinition = {
  module_id: OrganizationCapabilityModuleId;
  capability_key: string;
  provider_key: string;
  semantic: CompanionSemanticCapabilityDescriptor;
};

const MEMBER_DIRECTORY_SEMANTIC: CompanionSemanticCapabilityDescriptor = {
  capability_key: "member.search",
  entity: "member",
  domain: "organization_directory",
  metrics: ["total", "active", "list", "pending", "status", "count"],
  operations: ["count", "list", "read", "status"],
  time_scopes: ["current"],
  entity_aliases: {
    en: [
      "members",
      "member directory",
      "community members",
      "registered members",
      "active members",
      "verified members",
      "member list",
      "membership",
    ],
    no: [
      "medlemmer",
      "medlemsregister",
      "aktive medlemmer",
      "verifiserte medlemmer",
      "registrerte medlemmer",
      "medlemsliste",
      "medlemskap",
    ],
    sv: ["medlemmar", "medlemsregister", "aktiva medlemmar", "verifierade medlemmar"],
    da: ["medlemmer", "medlemsregister", "aktive medlemmer", "verificerede medlemmer"],
    pl: ["czlonkowie", "rejestr czlonkow", "aktywni czlonkowie"],
    uk: ["uchasnyky", "reiestr uchasnykiv", "aktyvni uchasnyky"],
  },
  metric_mappings: [
    { requested_metric: "active_members", when: { metric: "active", operation: "list" } },
    { requested_metric: "total_members", when: { metric: "total", operation: "count" } },
    { requested_metric: "pending_verification", when: { metric: "pending", operation: "list" } },
    { requested_metric: "member_status", when: { metric: "status", operation: "status" } },
    { requested_metric: "member_list", when: { metric: "list", operation: "list" } },
  ],
};

const VERIFICATION_MEMBER_SEMANTIC: CompanionSemanticCapabilityDescriptor = {
  capability_key: "verification_queue.read",
  entity: "verification",
  domain: "member_verification",
  metrics: ["pending", "status", "count"],
  operations: ["list", "count", "status", "read"],
  time_scopes: ["current"],
  entity_aliases: {
    en: [
      "verification",
      "member verification",
      "pending verification",
      "waiting for verification",
      "verification queue",
      "verified",
    ],
    no: [
      "verifisering",
      "medlemsverifisering",
      "venter på verifisering",
      "verifiseringskø",
      "verifisert",
    ],
    sv: ["verifiering", "väntar på verifiering", "verifieringskö"],
    da: ["verificering", "venter på verificering", "verificeret"],
    pl: ["weryfikacja", "oczekuje na weryfikacje"],
    uk: ["верифікація", "очікують на верифікацію"],
  },
};

function supportDescriptorToSemantic(
  entry: SupportSemanticDescriptor,
): CompanionSemanticCapabilityDescriptor {
  return {
    capability_key: entry.capability_key,
    entity: entry.entity,
    domain: "support",
    metrics: [...entry.metrics],
    operations: ["count", "list", "status", "read"],
    entity_aliases: entry.aliases,
  };
}

const PRIORITIZATION_SEMANTIC: CompanionSemanticCapabilityDescriptor = {
  capability_key: "command_brief.prioritize",
  entity: "priorities",
  domain: "command_brief",
  metrics: ["list"],
  operations: ["read", "list"],
  time_scopes: ["current"],
  entity_aliases: {
    en: ["prioritize", "priorities", "what should i prioritize", "focus today", "attention today"],
    no: ["prioritere", "prioriteringer", "hva bør jeg prioritere", "fokus i dag"],
    sv: ["prioritera", "prioriteringar", "vad bör jag prioritera"],
    da: ["prioriter", "prioriteringer", "hvad skal jeg prioritere"],
    pl: ["priorytetyzuj", "priorytety", "co powinienem priorytetyzowac"],
    uk: ["priorytetyzuvaty", "priorytety", "shcho maiu prioritetyzuvaty"],
  },
};

export const ORGANIZATION_CAPABILITY_REGISTRY: readonly OrganizationCapabilityDefinition[] = [
  {
    module_id: "directory.community_member",
    capability_key: "member.search",
    provider_key: "community_member_directory",
    semantic: MEMBER_DIRECTORY_SEMANTIC,
  },
  {
    module_id: "verification.member",
    capability_key: "verification_queue.read",
    provider_key: "member_verification_center",
    semantic: VERIFICATION_MEMBER_SEMANTIC,
  },
  {
    module_id: "support.sla",
    capability_key: "support_sla.read",
    provider_key: "autonomous_support_operations",
    semantic: supportDescriptorToSemantic(
      SUPPORT_SEMANTIC_DESCRIPTORS.find((entry) => entry.capability_key === "support_sla.read")!,
    ),
  },
  {
    module_id: "support.case",
    capability_key: "support_queue.read",
    provider_key: "autonomous_support_operations",
    semantic: supportDescriptorToSemantic(
      SUPPORT_SEMANTIC_DESCRIPTORS.find((entry) => entry.capability_key === "support_queue.read")!,
    ),
  },
  {
    module_id: "organization.priority_signals",
    capability_key: "command_brief.prioritize",
    provider_key: "command_brief",
    semantic: PRIORITIZATION_SEMANTIC,
  },
];

export function collectOrganizationSemanticDescriptors(): CompanionSemanticCapabilityDescriptor[] {
  const fromRegistry = ORGANIZATION_CAPABILITY_REGISTRY.map((entry) => entry.semantic);
  const directoryDescriptors = collectDirectoryRelationshipDescriptorsFromManifests(DIRECTORY_PROVIDER_MANIFESTS)
    .filter((entry) => entry.relationship_type === "member")
    .map(
      (entry): CompanionSemanticCapabilityDescriptor => ({
        capability_key: entry.capability_key,
        entity: "member",
        domain: "organization_directory",
        metrics: ["total", "active", "list", "pending", "status"],
        operations: ["count", "list", "read", "status"],
        entity_aliases: entry.aliases,
      }),
    );

  const communityManifests = listCommunityProviderManifests();
  const verificationDescriptors = collectVerificationDescriptorsFromManifests(communityManifests).map(
    (entry): CompanionSemanticCapabilityDescriptor => ({
      capability_key: entry.capability_key,
      entity: entry.entity,
      domain: "member_verification",
      metrics: [...entry.metrics],
      operations: ["count", "list", "status", "read"],
      entity_aliases: entry.aliases,
    }),
  );

  const supportManifests = listSupportProviderManifests();
  const supportDescriptors = SUPPORT_SEMANTIC_DESCRIPTORS.map(
    (entry): CompanionSemanticCapabilityDescriptor => ({
      capability_key: entry.capability_key,
      entity: entry.entity,
      domain: "support",
      metrics: [...entry.metrics],
      operations: ["count", "list", "status", "read"],
      entity_aliases: entry.aliases,
    }),
  );

  const merged = [
    ...fromRegistry,
    ...directoryDescriptors,
    ...verificationDescriptors,
    ...supportDescriptors,
  ];

  const byKey = new Map<string, CompanionSemanticCapabilityDescriptor>();
  for (const descriptor of merged) {
    const existing = byKey.get(descriptor.capability_key);
    if (!existing) {
      byKey.set(descriptor.capability_key, descriptor);
      continue;
    }
    byKey.set(descriptor.capability_key, {
      ...existing,
      entity_aliases: {
        ...existing.entity_aliases,
        ...descriptor.entity_aliases,
        en: [...new Set([...(existing.entity_aliases?.en ?? []), ...(descriptor.entity_aliases?.en ?? [])])],
      },
    });
  }

  return [...byKey.values()];
}

export function findOrganizationCapabilityByKey(
  capabilityKey: string,
): OrganizationCapabilityDefinition | null {
  return ORGANIZATION_CAPABILITY_REGISTRY.find((entry) => entry.capability_key === capabilityKey) ?? null;
}

export function findOrganizationCapabilityByModule(
  moduleId: OrganizationCapabilityModuleId,
): OrganizationCapabilityDefinition | null {
  return ORGANIZATION_CAPABILITY_REGISTRY.find((entry) => entry.module_id === moduleId) ?? null;
}
