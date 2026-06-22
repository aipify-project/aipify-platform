import type { VerificationPermissionScope } from "./types";

export type VerificationPermissionContext = {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  app_suspended: boolean;
  provider_active: boolean;
  can_view_queue: boolean;
  can_view_case: boolean;
  rate_limit_ok: boolean;
};

export function assertVerificationTenantScope(input: {
  queryOrganizationId: string;
  sessionOrganizationId: string;
}): boolean {
  return input.queryOrganizationId === input.sessionOrganizationId;
}

export function assertVerificationReadAllowed(
  ctx: VerificationPermissionContext,
): VerificationReadBlockReason | null {
  if (ctx.app_suspended) return "activation_pending";
  if (!ctx.provider_active) return "provider_missing";
  if (!ctx.rate_limit_ok) return "permission_denied";
  return null;
}

export type VerificationReadBlockReason =
  | "permission_denied"
  | "provider_missing"
  | "activation_pending";

export function canReadVerificationQueue(ctx: VerificationPermissionContext): boolean {
  return ctx.can_view_queue && assertVerificationReadAllowed(ctx) === null;
}

export function canReadVerificationCase(ctx: VerificationPermissionContext): boolean {
  return ctx.can_view_case && assertVerificationReadAllowed(ctx) === null;
}

export function resolveVerificationPermissionScope(
  input: "queue" | "case" | "full",
): VerificationPermissionScope {
  if (input === "full") return "sensitive";
  if (input === "case") return "case";
  return "queue";
}
