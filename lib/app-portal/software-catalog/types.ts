export type SoftwareCatalogSourceType = "package" | "module" | "business_pack";

export type SoftwareCatalogStatus =
  | "active"
  | "included"
  | "available"
  | "pending_approval"
  | "unavailable";

export type SoftwareCatalogItem = {
  id: string;
  sourceType: SoftwareCatalogSourceType;
  canonicalKey: string;
  name: string;
  valueProposition: string | null;
  description: string | null;
  category: string | null;
  /** Only when present from authoritative source — never invented. */
  price: string | null;
  billingPeriod: string | null;
  licenseModel: string | null;
  capacity: string | null;
  status: SoftwareCatalogStatus;
  included: boolean;
  active: boolean;
  available: boolean;
  pendingApproval: boolean;
  unavailable: boolean;
  detailsRoute: string | null;
  currentEntitlement: string | null;
  readiness: "operational" | "preview" | "foundation" | "disabled";
  features: string[];
};

export type SoftwareCatalogViewModel = {
  found: boolean;
  currentPackage: {
    packageKey: string;
    packageName: string;
    description: string | null;
  } | null;
  items: SoftwareCatalogItem[];
  referencePackKey: "aipify_hosts";
  sections: {
    packages: boolean;
    modules: boolean;
    businessPacks: boolean;
  };
  partial: boolean;
  diagnostics: string[];
};
