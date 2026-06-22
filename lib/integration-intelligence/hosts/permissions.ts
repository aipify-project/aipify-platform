export type HostsPermissionContext = {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  app_suspended: boolean;
  provider_active: boolean;
  can_read_portfolio: boolean;
  can_read_guests: boolean;
  can_read_finance: boolean;
  can_draft_guest_response: boolean;
  can_create_tasks: boolean;
  rate_limit_ok: boolean;
};

export type HostsReadBlockReason =
  | "permission_denied"
  | "provider_missing"
  | "activation_pending";

export function assertHostsTenantScope(input: {
  queryOrganizationId: string;
  sessionOrganizationId: string;
}): boolean {
  return input.queryOrganizationId === input.sessionOrganizationId;
}

export function assertHostsReadAllowed(ctx: HostsPermissionContext): HostsReadBlockReason | null {
  if (ctx.app_suspended) return "activation_pending";
  if (!ctx.provider_active) return "provider_missing";
  if (!ctx.rate_limit_ok) return "permission_denied";
  return null;
}

export function canReadHostsPortfolio(ctx: HostsPermissionContext): boolean {
  return ctx.can_read_portfolio && assertHostsReadAllowed(ctx) === null;
}

export function canReadHostsFinance(ctx: HostsPermissionContext): boolean {
  return ctx.can_read_finance && assertHostsReadAllowed(ctx) === null;
}

export function canProposeHostsWrite(ctx: HostsPermissionContext): boolean {
  return (
    (ctx.can_draft_guest_response || ctx.can_create_tasks) &&
    assertHostsReadAllowed(ctx) === null
  );
}
