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

function locked(
  value: string | null,
  source: AccountProfileField["source"]
): AccountProfileField {
  const text = value?.trim() || null;
  return { value: text, source, editable: false };
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
  avatarUrl: string | null;
  context: AppOrganizationContext | null;
  canOpenCompanySettings: boolean;
}): AccountProfileView {
  const context = input.context;
  const ready = context?.state === "ready";
  const fullName = input.user?.full_name?.trim() || null;
  const workspace =
    (ready ? context?.workspace_name ?? context?.licensed_to : null)?.trim() || null;
  const hasCompanyContext = Boolean(workspace);

  return {
    fullName: locked(fullName, "users.full_name"),
    email: locked(input.loginEmail, "auth.users.email"),
    phone: locked(null, "unavailable"),
    address: locked(null, "unavailable"),
    role: mapAccountProfileRole(input.user?.role ?? context?.user_role ?? null),
    roleSource: input.user?.role ? "users.role" : "unavailable",
    avatarUrl: input.avatarUrl?.trim() || null,
    avatarSource: input.avatarUrl?.trim()
      ? "auth.user_metadata.avatar_url"
      : "unavailable",
    initials: companyProfileInitials(fullName || workspace),
    hasCompanyContext,
    companyName: locked(workspace, "get_app_organization_context.workspace_name"),
    companyWebsite: locked(null, "unavailable"),
    companyPhone: locked(null, "unavailable"),
    companyAddress: locked(null, "unavailable"),
    relationship: {
      planName: locked(
        ready ? context?.plan_name ?? null : null,
        "get_app_organization_context.plan_name"
      ),
      license: mapAccountProfileLicense(ready ? context?.license_status ?? null : null),
      licenseSource: "get_app_organization_context.license_status",
      customerReference: locked(
        ready ? context?.customer_id ?? null : null,
        "get_app_organization_context.customer_id"
      ),
      registeredAt: locked(
        input.user?.created_at ?? null,
        "users.created_at"
      ),
    },
    screenLock: { status: "not_activated" },
    links: {
      subscription: FOUNDATION_NAV_BINDINGS.accountSubscription,
      invoices: FOUNDATION_NAV_BINDINGS.accountInvoices,
      security: "/app/settings/two-factor",
      notifications: FOUNDATION_NAV_BINDINGS.accountNotifications,
      companySettings: input.canOpenCompanySettings ? "/app/settings/company-profile" : null,
    },
  };
}

/** Explicit UI → data source mapping for QA and owner review. */
export function accountProfileDataMapping(): AccountProfileDataMappingRow[] {
  return [
    { uiField: "fullName", source: "users.full_name", editable: false },
    { uiField: "email", source: "auth.users.email", editable: false },
    { uiField: "phone", source: "unavailable", editable: false },
    { uiField: "address", source: "unavailable", editable: false },
    { uiField: "role", source: "users.role", editable: false },
    { uiField: "avatar", source: "auth.user_metadata.avatar_url", editable: false },
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
    { uiField: "registeredAt", source: "users.created_at", editable: false },
  ];
}
