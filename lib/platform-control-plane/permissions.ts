/** Capability areas for Platform control-plane access (server-enforced). */

export const PLATFORM_CONTROL_PLANE_CAPABILITIES = [
  "customer_read",
  "customer_write",
  "finance_read",
  "finance_write",
  "partner_read",
  "partner_write",
  "commission_approve",
  "invoice_approve",
  "operations_read",
  "incident_manage",
  "product_publish",
  "security_read",
  "security_manage",
  "audit_read",
  "platform_admin_manage",
] as const;

export type PlatformControlPlaneCapability =
  (typeof PLATFORM_CONTROL_PLANE_CAPABILITIES)[number];

/** Default role → capability map. Does not replace Core RPC auth checks. */
export const PLATFORM_ROLE_CAPABILITIES: Record<
  "super_admin" | "platform_support" | "platform_admin",
  readonly PlatformControlPlaneCapability[]
> = {
  super_admin: PLATFORM_CONTROL_PLANE_CAPABILITIES,
  platform_admin: [
    "customer_read",
    "customer_write",
    "finance_read",
    "partner_read",
    "operations_read",
    "incident_manage",
    "product_publish",
    "security_read",
    "audit_read",
    "platform_admin_manage",
  ],
  platform_support: [
    "customer_read",
    "finance_read",
    "partner_read",
    "operations_read",
    "security_read",
    "audit_read",
  ],
};

export function roleHasCapability(
  role: string | null | undefined,
  capability: PlatformControlPlaneCapability,
): boolean {
  if (!role) return false;
  const capabilities =
    PLATFORM_ROLE_CAPABILITIES[role as keyof typeof PLATFORM_ROLE_CAPABILITIES];
  if (!capabilities) return false;
  return capabilities.includes(capability);
}
