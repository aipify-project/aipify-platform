import type { DirectoryCapabilityKey } from "./types";
import type { DirectoryRelationshipType } from "./relationship-types";

export function capabilityKeyForRelationship(
  relationshipType: DirectoryRelationshipType,
): DirectoryCapabilityKey {
  if (relationshipType === "custom_relationship") return "directory.search";
  if (relationshipType === "service_provider") return "supplier.search";
  if (relationshipType === "vendor") return "vendor.search";
  if (relationshipType === "supplier_contact") return "supplier_contact.search";
  return `${relationshipType}.search` as DirectoryCapabilityKey;
}
