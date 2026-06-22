export const COMPANION_BOOKING_READ_ONLY = true as const;
export const COMPANION_BOOKING_CORE = "provider_agnostic" as const;
export const COMPANION_BOOKING_PII_DEFAULT = "masked" as const;
export const COMPANION_BOOKING_AUDIT = "required" as const;
export const COMPANION_BOOKING_AUTO_CREATE = "forbidden" as const;
export const COMPANION_BOOKING_CONFIRMATION = "required" as const;
export const COMPANION_BOOKING_WRITE_REQUIRES_RPC = true as const;

export function companionBookingPolicyMetadata() {
  return {
    read_only_default: COMPANION_BOOKING_READ_ONLY,
    core: COMPANION_BOOKING_CORE,
    pii_default: COMPANION_BOOKING_PII_DEFAULT,
    audit: COMPANION_BOOKING_AUDIT,
    auto_create: COMPANION_BOOKING_AUTO_CREATE,
    confirmation: COMPANION_BOOKING_CONFIRMATION,
    write_requires_rpc: COMPANION_BOOKING_WRITE_REQUIRES_RPC,
  } as const;
}
