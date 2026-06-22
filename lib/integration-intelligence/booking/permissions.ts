export type BookingPermissionContext = {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  app_suspended: boolean;
  provider_active: boolean;
  can_read_services: boolean;
  can_read_bookings: boolean;
  can_read_availability: boolean;
  can_write_booking: boolean;
  rate_limit_ok: boolean;
};

export type BookingReadBlockReason =
  | "permission_denied"
  | "provider_missing"
  | "activation_pending";

export function assertBookingTenantScope(input: {
  queryOrganizationId: string;
  sessionOrganizationId: string;
}): boolean {
  return input.queryOrganizationId === input.sessionOrganizationId;
}

export function assertBookingReadAllowed(
  ctx: BookingPermissionContext,
): BookingReadBlockReason | null {
  if (ctx.app_suspended) return "activation_pending";
  if (!ctx.provider_active) return "provider_missing";
  if (!ctx.rate_limit_ok) return "permission_denied";
  return null;
}

export function canReadBookingServices(ctx: BookingPermissionContext): boolean {
  return ctx.can_read_services && assertBookingReadAllowed(ctx) === null;
}

export function canReadBookingAvailability(ctx: BookingPermissionContext): boolean {
  return ctx.can_read_availability && assertBookingReadAllowed(ctx) === null;
}

export function canReadBookings(ctx: BookingPermissionContext): boolean {
  return ctx.can_read_bookings && assertBookingReadAllowed(ctx) === null;
}

export function canProposeBookingWrite(ctx: BookingPermissionContext): boolean {
  return ctx.can_write_booking && assertBookingReadAllowed(ctx) === null;
}
