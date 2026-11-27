/**
 * APP Profile / Customer relationship read model.
 * Each UI field maps to an explicit source — never invent contact or company values.
 */

export type AccountProfileFieldSource =
  | "users.full_name"
  | "auth.users.email"
  | "auth.users.phone"
  | "auth.users.updated_at"
  | "users.role"
  | "users.created_at"
  | "get_app_organization_context.workspace_name"
  | "get_app_organization_context.plan_name"
  | "get_app_organization_context.license_status"
  | "get_app_organization_context.customer_id"
  | "customers.customer_number"
  | "auth.user_metadata.avatar_url"
  | "unavailable";

export type AccountProfileRole =
  | "owner"
  | "admin"
  | "support"
  | "staff"
  | "read_only"
  | "member";

export type AccountProfileLicense =
  | "active"
  | "paused"
  | "grace"
  | "trialing"
  | "cancelled";

export type AccountProfileField = {
  value: string | null;
  source: AccountProfileFieldSource;
  /** Auth email and platform-owned identity stay locked. */
  editable: false;
};

export type AccountProfileView = {
  fullName: AccountProfileField;
  email: AccountProfileField;
  phone: AccountProfileField;
  address: AccountProfileField;
  role: AccountProfileRole | null;
  roleSource: AccountProfileFieldSource;
  avatarUrl: string | null;
  avatarSource: AccountProfileFieldSource;
  initials: string;
  /** True only when a company field has a stored value. Workspace name is not company data. */
  hasCompanyDetails: boolean;
  companyName: AccountProfileField;
  companyWebsite: AccountProfileField;
  companyPhone: AccountProfileField;
  companyAddress: AccountProfileField;
  relationship: {
    workspaceName: AccountProfileField;
    planName: AccountProfileField;
    license: AccountProfileLicense | null;
    licenseSource: AccountProfileFieldSource;
    customerReference: AccountProfileField;
    /** Raw UUID references stay off the page. */
    referenceHidden: boolean;
    /** Official AIP-###### number for this organization only. */
    officialCustomerNumber: AccountProfileField;
    registeredAt: AccountProfileField;
    updatedAt: AccountProfileField;
  };
  /** Secure APP screen lock is not active without owner-approved backend. */
  screenLock: {
    status: "not_activated";
  };
  links: {
    subscription: string;
    invoices: string;
    security: string;
    privacy: string;
    license: string;
    notifications: string;
    companySettings: string | null;
  };
};

export type AccountProfileDataMappingRow = {
  uiField: string;
  source: AccountProfileFieldSource;
  editable: boolean;
};
