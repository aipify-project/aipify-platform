export const SUPER_ADMIN_DANGEROUS_ACTIONS = new Set([
  "emergency_stop",
  "tenant_suspension",
  "tenant_recovery",
  "feature_flag_change",
  "marketplace_approval",
  "billing_modification",
  "growth_partner_decision",
]);

export function isSuperAdminDangerousAction(actionType: string): boolean {
  return SUPER_ADMIN_DANGEROUS_ACTIONS.has(actionType);
}

export function confirmSuperAdminDangerousAction(
  actionLabel: string,
  impactSummary: string
): boolean {
  if (typeof window === "undefined") return false;
  return window.confirm(
    `Confirm Super Admin action: ${actionLabel}\n\n${impactSummary}\n\nThis may affect multiple organizations.`
  );
}
