import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

export type CompanyProfileRole = "owner" | "admin" | "member";
export type CompanyProfileLicense = "active" | "paused" | "grace" | "trialing" | "cancelled";

export type CompanyProfileView = {
  displayName: string | null;
  initials: string;
  loginEmail: string | null;
  role: CompanyProfileRole | null;
  planName: string | null;
  license: CompanyProfileLicense | null;
};

const LICENSES = new Set<CompanyProfileLicense>([
  "active",
  "paused",
  "grace",
  "trialing",
  "cancelled",
]);

export function companyProfileInitials(name: string | null): string {
  const parts = (name ?? "")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
  const letters = parts.map((part) => part[0]?.toLocaleUpperCase() ?? "").join("");
  return letters || "A";
}

export function companyProfileRole(role: string | null): CompanyProfileRole | null {
  const value = role?.trim().toLowerCase() ?? "";
  if (!value) return null;
  if (value.includes("owner")) return "owner";
  if (value.includes("admin")) return "admin";
  return "member";
}

export function companyProfileLicense(status: string | null): CompanyProfileLicense | null {
  const value = status?.trim().toLowerCase() ?? "";
  return LICENSES.has(value as CompanyProfileLicense) ? (value as CompanyProfileLicense) : null;
}

export function buildCompanyProfileView(
  context: Pick<AppOrganizationContext, "workspace_name" | "user_role" | "plan_name" | "license_status">,
  loginEmail: string | null,
): CompanyProfileView {
  const displayName = context.workspace_name?.trim() || null;
  return {
    displayName,
    initials: companyProfileInitials(displayName),
    loginEmail: loginEmail?.trim() || null,
    role: companyProfileRole(context.user_role),
    planName: context.plan_name?.trim() || null,
    license: companyProfileLicense(context.license_status),
  };
}
