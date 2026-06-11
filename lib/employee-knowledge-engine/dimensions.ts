export const KNOWLEDGE_CATEGORIES = [
  "company_info",
  "policies",
  "procedures",
  "product",
  "support_procedures",
  "training",
] as const;

export const EMPLOYEE_ROLES = ["owner", "admin", "support", "staff"] as const;

export const ACCESS_LEVELS = ["read", "write", "admin"] as const;

export const CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;

export const SOURCE_TYPES = [
  "manual",
  "upload",
  "website",
  "business_dna",
  "google_drive",
  "sharepoint",
  "wiki",
  "video",
] as const;
