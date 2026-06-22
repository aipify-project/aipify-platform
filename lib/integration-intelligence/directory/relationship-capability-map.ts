import type { DirectoryCapabilityKey } from "./types";
import type { DirectoryRelationshipType } from "./relationship-types";

export function capabilityKeyForRelationship(
  relationshipType: DirectoryRelationshipType,
): DirectoryCapabilityKey {
  if (relationshipType === "custom_relationship") return "directory.search";
  return `${relationshipType}.search` as DirectoryCapabilityKey;
}
