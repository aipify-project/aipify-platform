export const CUSTOMER_PROFILE_ROUTE = "/app/profile";

export const CUSTOMER_PROFILE_ROLES = [
  "owner",
  "admin",
  "support",
  "staff",
  "read_only",
  "member",
] as const;

export type CustomerProfileRole = (typeof CUSTOMER_PROFILE_ROLES)[number];

export const CUSTOMER_PROFILE_STATUSES = [
  "active",
  "paused",
  "grace",
  "trialing",
  "cancelled",
] as const;

export type CustomerProfileStatus = (typeof CUSTOMER_PROFILE_STATUSES)[number];

export type CustomerProfileView = {
  fullName: string | null;
  initials: string;
  role: CustomerProfileRole | null;
  email: string | null;
  /** Readable account phone. Null means this view has no phone, not that a number was invented. */
  phone: string | null;
  workspaceName: string | null;
  planName: string | null;
  status: CustomerProfileStatus | null;
  customerReference: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const ROLE_SET = new Set<string>(CUSTOMER_PROFILE_ROLES);
const STATUS_SET = new Set<string>(CUSTOMER_PROFILE_STATUSES);

function clean(value: string | null | undefined): string | null {
  const text = value?.trim() ?? "";
  return text.length > 0 ? text : null;
}

export function customerProfileInitials(name: string | null): string {
  const parts = (name ?? "")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
  const letters = parts.map((part) => part[0]?.toLocaleUpperCase() ?? "").join("");
  return letters || "A";
}

export function customerProfileRole(role: string | null | undefined): CustomerProfileRole | null {
  const value = role?.trim().toLowerCase().replace(/^organization_/, "") ?? "";
  if (!value) return null;
  if (value === "read-only") return "read_only";
  return ROLE_SET.has(value) ? (value as CustomerProfileRole) : null;
}

export function customerProfileStatus(status: string | null | undefined): CustomerProfileStatus | null {
  const value = status?.trim().toLowerCase() ?? "";
  if (!value) return null;
  if (value === "grace_period") return "grace";
  if (value === "trial") return "trialing";
  if (value === "canceled") return "cancelled";
  return STATUS_SET.has(value) ? (value as CustomerProfileStatus) : null;
}

export function buildCustomerProfileView(input: {
  fullName?: string | null;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  workspaceName?: string | null;
  planName?: string | null;
  licenseStatus?: string | null;
  customerReference?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}): CustomerProfileView {
  const fullName = clean(input.fullName);
  return {
    fullName,
    initials: customerProfileInitials(fullName),
    role: customerProfileRole(input.role),
    email: clean(input.email),
    phone: clean(input.phone),
    workspaceName: clean(input.workspaceName),
    planName: clean(input.planName),
    status: customerProfileStatus(input.licenseStatus),
    customerReference: clean(input.customerReference),
    createdAt: clean(input.createdAt),
    updatedAt: clean(input.updatedAt),
  };
}
