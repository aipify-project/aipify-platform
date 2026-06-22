import {
  resolveCompanionToolRegistry,
} from "./companion-tool-registry";
import type { CompanionToolRegistry } from "./companion-tool-definition";
import type { CompanionBusinessPackCollection } from "./companion-business-pack-context";
import type { CompanionDiscoveryContext } from "./companion-discovery-context";
import type { CompanionSchemaCollection } from "./companion-schema-context";
import type { CompanionCapabilityRef } from "./companion-business-pack-context";

export type LoadCompanionToolRegistryInput = {
  connectedProviders: string[];
  entitledCapabilities: CompanionCapabilityRef[];
  schemaContext: CompanionSchemaCollection;
  businessPackContext: CompanionBusinessPackCollection;
  discovery: CompanionDiscoveryContext;
  effectivePermissions: string[];
};

export function loadCompanionToolRegistry(
  input: LoadCompanionToolRegistryInput,
): CompanionToolRegistry {
  return resolveCompanionToolRegistry(input);
}
