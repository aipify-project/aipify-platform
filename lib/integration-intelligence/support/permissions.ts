export type SupportPermissionContext = {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  app_suspended: boolean;
  provider_active: boolean;
  can_read_queue: boolean;
  can_read_cases: boolean;
  can_read_sla: boolean;
  can_draft_response: boolean;
  can_assign_case: boolean;
  can_escalate_case: boolean;
  rate_limit_ok: boolean;
};

export type SupportReadBlockReason =
  | "permission_denied"
  | "provider_missing"
  | "activation_pending";

export function assertSupportTenantScope(input: {
  queryOrganizationId: string;
  sessionOrganizationId: string;
}): boolean {
  return input.queryOrganizationId === input.sessionOrganizationId;
}

export function assertSupportReadAllowed(
  ctx: SupportPermissionContext,
): SupportReadBlockReason | null {
  if (ctx.app_suspended) return "activation_pending";
  if (!ctx.provider_active) return "provider_missing";
  if (!ctx.rate_limit_ok) return "permission_denied";
  return null;
}

export function canReadSupportQueue(ctx: SupportPermissionContext): boolean {
  return ctx.can_read_queue && assertSupportReadAllowed(ctx) === null;
}

export function canReadSupportCase(ctx: SupportPermissionContext): boolean {
  return ctx.can_read_cases && assertSupportReadAllowed(ctx) === null;
}

export function canProposeSupportWrite(ctx: SupportPermissionContext): boolean {
  return (
    (ctx.can_draft_response || ctx.can_assign_case || ctx.can_escalate_case) &&
    assertSupportReadAllowed(ctx) === null
  );
}
