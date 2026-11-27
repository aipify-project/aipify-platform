import { companyProfileInitials } from "@/lib/app/settings/company-profile-view";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import type { AppUser } from "@/lib/tenant/types";
import type {
  AccountProfileDataMappingRow,
  AccountProfileField,
  AccountProfileLicense,
  AccountProfileRole,
  AccountProfileView,
} from "./types";

const LICENSES = new Set<AccountProfileLicense>([
  "active",
  "paused",
  "grace",
  "trialing",
  "cancelled",
]);

const UUID_REFERENCE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function locked(
  value: string | null,
  source: AccountProfileField["source"]
): AccountProfileField {
  const text = value?.trim() || null;
  return { value: text, source, editable: false };
}

function readableReference(value: string | null): { value: string | null; hidden: boolean } {
  const text = value?.trim() || null;
  if (!text) return { value: null, hidden: false };
  if (UUID_REFERENCE.test(text)) return { value: null, hidden: true };
  return { value: text, hidden: false };
}

export function mapAccountProfileRole(role: string | null): AccountProfileRole | null {
  const value = role?.trim().toLowerCase() ?? "";
  if (!value) return null;
  if (value.includes("owner")) return "owner";
  if (value.includes("admin")) return "admin";
  if (value.includes("support")) return "support";
  if (value.includes("staff")) return "staff";
  if (value.includes("read")) return "read_only";
  return "member";
}

export function mapAccountProfileLicense(status: string | null): AccountProfileLicense | null {
  const value = status?.trim().toLowerCase() ?? "";
  if (!value) return null;
  if (value === "grace_period") return "grace";
  if (value === "trial") return "trialing";
  if (value === "canceled") return "cancelled";
  return LICENSES.has(value as AccountProfileLicense) ? (value as AccountProfileLicense) : null;
}

export function buildAccountProfileView(input: {
  user: AppUser | null;
  loginEmail: string | null;
  phone?: string | null;
  updatedAt?: string | null;
  avatarUrl: string | null;
  context: AppOrganizationContext | null;
  company?: {
    name?: string | null;
    website?: string | null;
    phone?: string | null;
    address?: string | null;
  } | null;
  canOpenCompanySettings: boolean;
  officialCustomerNumber?: string | null;
}): AccountProfileView {
  const context = input.context;
  const ready = context?.state === "ready";
  const fullName = input.user?.full_name?.trim() || null;
  const workspace =
    (ready ? context?.workspace_name ?? context?.licensed_to : null)?.trim() || null;
  // Organization display name from Core workspace — never invent firm legal data.
  const explicitCompanyName = input.company?.name?.trim() || null;
  const organizationName = explicitCompanyName || workspace || null;
  const companyName = locked(
    organizationName,
    organizationName
      ? "get_app_organization_context.workspace_name"
      : "unavailable",
  );
  const companyWebsite = locked(input.company?.website ?? null, "unavailable");
  const companyPhone = locked(input.company?.phone ?? null, "unavailable");
  const companyAddress = locked(input.company?.address ?? null, "unavailable");
  const hasCompanyDetails = Boolean(
    companyName.value || companyWebsite.value || companyPhone.value || companyAddress.value,
  );
  const reference = readableReference(ready ? context?.customer_id ?? null : null);
  const phone = input.phone?.trim() || null;

  return {
    fullName: locked(fullName, "users.full_name"),
    email: locked(input.loginEmail, "auth.users.email"),
    phone: locked(phone, phone ? "auth.users.phone" : "unavailable"),
    address: locked(null, "unavailable"),
    role: mapAccountProfileRole(input.user?.role ?? context?.user_role ?? null),
    roleSource: input.user?.role ? "users.role" : "unavailable",
    avatarUrl: input.avatarUrl?.trim() || null,
    avatarSource: input.avatarUrl?.trim()
      ? "auth.user_metadata.avatar_url"
      : "unavailable",
    initials: companyProfileInitials(fullName || workspace),
    hasCompanyDetails,
    companyName,
    companyWebsite,
    companyPhone,
    companyAddress,
    relationship: {
      workspaceName: locked(workspace, "get_app_organization_context.workspace_name"),
      planName: locked(
        ready ? context?.plan_name ?? null : null,
        "get_app_organization_context.plan_name"
      ),
      license: mapAccountProfileLicense(ready ? context?.license_status ?? null : null),
      licenseSource: "get_app_organization_context.license_status",
      customerReference: locked(
        reference.value,
        "get_app_organization_context.customer_id"
      ),
      referenceHidden: reference.hidden,
      officialCustomerNumber: locked(
        input.officialCustomerNumber ?? null,
        input.officialCustomerNumber ? "customers.customer_number" : "unavailable",
      ),
      registeredAt: locked(input.user?.created_at ?? null, "users.created_at"),
      updatedAt: locked(input.updatedAt ?? null, "auth.users.updated_at"),
    },
    screenLock: { status: "not_activated" },
    links: {
      subscription: FOUNDATION_NAV_BINDINGS.accountSubscription,
      invoices: FOUNDATION_NAV_BINDINGS.accountInvoices,
      security: "/app/settings/two-factor",
      privacy: "/app/settings/security",
      license: "/app/license",
      notifications: FOUNDATION_NAV_BINDINGS.accountNotifications,
      companySettings: input.canOpenCompanySettings ? "/app/settings/company-profile" : null,
    },
  };
}

/** Explicit UI → data source mapping for QA and owner review. */
export function accountProfileDataMapping(): AccountProfileDataMappingRow[] {
  return [
    { uiField: "fullName", source: "users.full_name", editable: true },
    { uiField: "email", source: "auth.users.email", editable: false },
    { uiField: "phone", source: "auth.users.phone", editable: true },
    { uiField: "address", source: "unavailable", editable: false },
    { uiField: "role", source: "users.role", editable: false },
    { uiField: "avatar", source: "auth.user_metadata.avatar_url", editable: true },
    {
      uiField: "workspaceName",
      source: "get_app_organization_context.workspace_name",
      editable: false,
    },
    {
      uiField: "companyName",
      source: "get_app_organization_context.workspace_name",
      editable: false,
    },
    { uiField: "companyWebsite", source: "unavailable", editable: false },
    { uiField: "companyPhone", source: "unavailable", editable: false },
    { uiField: "companyAddress", source: "unavailable", editable: false },
    {
      uiField: "planName",
      source: "get_app_organization_context.plan_name",
      editable: false,
    },
    {
      uiField: "license",
      source: "get_app_organization_context.license_status",
      editable: false,
    },
    {
      uiField: "customerReference",
      source: "get_app_organization_context.customer_id",
      editable: false,
    },
    {
      uiField: "officialCustomerNumber",
      source: "customers.customer_number",
      editable: false,
    },
    { uiField: "registeredAt", source: "users.created_at", editable: false },
  ];
}
