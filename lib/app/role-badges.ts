export type RoleBadgeVariant =
  | "owner"
  | "super_admin"
  | "platform_support"
  | "admin"
  | "manager"
  | "growth_partner"
  | "support"
  | "moderator"
  | "member"
  | "staff"
  | "read_only"
  | "default";

const ROLE_VARIANT_MAP: Record<string, RoleBadgeVariant> = {
  owner: "owner",
  super_admin: "super_admin",
  platform_support: "platform_support",
  admin: "admin",
  administrator: "admin",
  manager: "manager",
  growth_partner: "growth_partner",
  support: "support",
  moderator: "moderator",
  member: "member",
  staff: "staff",
  read_only: "read_only",
};

export function normalizeRoleBadgeVariant(roleKey: string): RoleBadgeVariant {
  const key = roleKey.trim().toLowerCase().replace(/\s+/g, "_");
  return ROLE_VARIANT_MAP[key] ?? "default";
}

export const ROLE_BADGE_CLASSES: Record<RoleBadgeVariant, string> = {
  owner: "bg-violet-100 text-violet-800 ring-violet-200",
  super_admin: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  platform_support: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  admin: "bg-blue-100 text-blue-800 ring-blue-200",
  manager: "bg-sky-100 text-sky-800 ring-sky-200",
  growth_partner: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  support: "bg-gray-100 text-gray-700 ring-gray-200",
  moderator: "bg-amber-100 text-amber-800 ring-amber-200",
  member: "bg-slate-100 text-slate-700 ring-slate-200",
  staff: "bg-slate-100 text-slate-700 ring-slate-200",
  read_only: "bg-gray-100 text-gray-600 ring-gray-200",
  default: "bg-gray-100 text-gray-700 ring-gray-200",
};
