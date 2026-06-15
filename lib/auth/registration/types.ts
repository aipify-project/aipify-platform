import type {
  EmployeeRange,
  Industry,
  OrganizationType,
  PackagePlan,
  PrimaryUseCase,
  WorkspaceLanguage,
} from "./constants";

export type RegistrationDraft = {
  step: number;
  owner: {
    fullName: string;
    businessEmail: string;
    phone: string;
    phoneDialCode: string;
    country: string;
  };
  organization: {
    companyName: string;
    organizationNumber: string;
    businessAddress: string;
    postalCode: string;
    city: string;
    country: string;
    website: string;
    logoUrl: string;
    primaryLanguage: WorkspaceLanguage | "";
    secondaryLanguages: WorkspaceLanguage[];
  };
  profile: {
    industry: Industry | "";
    employeeRange: EmployeeRange | "";
    primaryUseCases: PrimaryUseCase[];
    organizationType: OrganizationType | "";
  };
  package: {
    selectedPlan: PackagePlan | "";
    billingPath: "instant" | "enterprise" | "";
  };
  security: {
    twoFactorChoice: "skip" | "enable_later";
  };
  confirmation: {
    termsAccepted: boolean;
    authorityAccepted: boolean;
    productUpdatesOptIn: boolean;
  };
  accountCreated: boolean;
};

export type WorkspaceRegistrationPayload = {
  owner_full_name: string;
  business_email: string;
  owner_phone: string;
  owner_country: string;
  company_name: string;
  organization_number: string;
  business_address: string;
  postal_code: string;
  city: string;
  organization_country: string;
  website: string;
  logo_url: string;
  industry: string;
  employee_range: string;
  primary_use_cases: string[];
  organization_type: string;
  product_updates_opt_in: boolean;
  registration_2fa_skipped: boolean;
  registration_2fa_enabled: boolean;
  terms_accepted: boolean;
  authority_accepted: boolean;
  workspace_metadata?: {
    billing_path?: string;
  };
};

export type WorkspaceRegistrationResult = {
  organization_id: string;
  customer_id: string;
  slug: string;
  redirect_path: string;
};

export const EMPTY_REGISTRATION_DRAFT: RegistrationDraft = {
  step: 1,
  owner: {
    fullName: "",
    businessEmail: "",
    phone: "",
    phoneDialCode: "+47",
    country: "NO",
  },
  organization: {
    companyName: "",
    organizationNumber: "",
    businessAddress: "",
    postalCode: "",
    city: "",
    country: "NO",
    website: "",
    logoUrl: "",
    primaryLanguage: "en",
    secondaryLanguages: [],
  },
  profile: {
    industry: "",
    employeeRange: "",
    primaryUseCases: [],
    organizationType: "company",
  },
  package: {
    selectedPlan: "",
    billingPath: "",
  },
  security: {
    twoFactorChoice: "skip",
  },
  confirmation: {
    termsAccepted: false,
    authorityAccepted: false,
    productUpdatesOptIn: false,
  },
  accountCreated: false,
};
