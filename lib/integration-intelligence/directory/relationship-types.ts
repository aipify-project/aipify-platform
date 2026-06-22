export const DIRECTORY_RELATIONSHIP_TYPES = [
  "customer",
  "member",
  "employee",
  "lead",
  "prospect",
  "partner",
  "seller",
  "supplier",
  "contact",
  "guest",
  "applicant",
  "support_contact",
  "custom_relationship",
] as const;

export type DirectoryRelationshipType = (typeof DIRECTORY_RELATIONSHIP_TYPES)[number];

const RELATIONSHIP_ALIASES: Record<string, DirectoryRelationshipType> = {
  customer: "customer",
  client: "customer",
  member: "member",
  membership: "member",
  employee: "employee",
  staff: "employee",
  lead: "lead",
  prospect: "prospect",
  partner: "partner",
  seller: "seller",
  sales_rep: "seller",
  supplier: "supplier",
  vendor: "supplier",
  contact: "contact",
  guest: "guest",
  applicant: "applicant",
  support_contact: "support_contact",
  custom: "custom_relationship",
};

/** Normalize provider-specific relationship labels to Core relationship types. */
export function normalizeDirectoryRelationshipType(
  raw: string | null | undefined,
): DirectoryRelationshipType | null {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, "_");
  return RELATIONSHIP_ALIASES[normalized] ?? (normalized as DirectoryRelationshipType);
}

export function isDirectoryRelationshipType(value: string): value is DirectoryRelationshipType {
  return (DIRECTORY_RELATIONSHIP_TYPES as readonly string[]).includes(value);
}
