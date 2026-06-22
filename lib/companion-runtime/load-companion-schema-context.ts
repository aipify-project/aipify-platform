import {
  buildCompanionSchemaCollection,
  type CompanionSchemaCollection,
} from "./companion-schema-context";
import type { CompanionBusinessPackCollection } from "./companion-business-pack-context";
import type { CompanionDiscoveryContext } from "./companion-discovery-context";

export type LoadCompanionSchemaInput = {
  discovery: CompanionDiscoveryContext;
  businessPackContext: CompanionBusinessPackCollection;
  connectedProviders: string[];
  effectivePermissions: string[];
};

export function loadCompanionSchemaContext(
  input: LoadCompanionSchemaInput,
): CompanionSchemaCollection {
  return buildCompanionSchemaCollection(input);
}
