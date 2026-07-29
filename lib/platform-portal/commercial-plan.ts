import type {
  PlatformPortalCommercialPlan,
  PlatformPortalCommercialPlansPayload,
  PlatformPortalCustomerCommercialPlanResult,
  SetPlatformPortalCustomerCommercialPlanInput,
} from "./types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type PlatformPortalCommercialPlanErrorCode =
  | "invalid_customer"
  | "invalid_plan"
  | "invalid_mode"
  | "invalid_start_mode"
  | "invalid_internal_reason"
  | "invalid_idempotency_key"
  | "trial_not_supported"
  | "customer_not_found"
  | "plan_not_found"
  | "plan_lifetime_unsupported"
  | "plan_recurring_unsupported"
  | "active_plan_conflict"
  | "idempotency_conflict"
  | "unauthorized"
  | "forbidden"
  | "unknown";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
}

function asNullableTrimmedString(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asRequiredId(value: unknown): string | null {
  const id = asNullableTrimmedString(value);
  if (!id || !UUID_REGEX.test(id)) return null;
  return id;
}

function asStrictBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asNullableNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function formatCommercialAmount(
  amountMinor: number | null,
  currency: string | null,
  locale: string,
): string | null {
  if (amountMinor == null || amountMinor <= 0 || !currency) return null;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountMinor / 100);
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${currency}`;
  }
}

export function parsePlatformPortalCommercialPlan(
  value: unknown,
): PlatformPortalCommercialPlan | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const key = asNullableTrimmedString(row.key ?? row.plan_key);
  const name = asNullableTrimmedString(row.name);
  const planType = asNullableTrimmedString(row.plan_type ?? row.planType ?? key);
  if (!id || !key || !name || !planType) return null;

  return {
    id,
    key,
    name,
    description: asNullableTrimmedString(row.description),
    planType,
    billingCycle: asNullableTrimmedString(row.billing_cycle ?? row.billingCycle),
    amountMinor: asNullableNumber(row.amount_minor ?? row.amountMinor),
    currency: asNullableTrimmedString(row.currency),
    trialDays: asNullableNumber(row.trial_days ?? row.trialDays),
    active: asStrictBoolean(row.active, true),
    supportsLifetime: asStrictBoolean(row.supports_lifetime ?? row.supportsLifetime),
    supportsRecurring: asStrictBoolean(row.supports_recurring ?? row.supportsRecurring),
    supportsTrial: asStrictBoolean(row.supports_trial ?? row.supportsTrial),
  };
}

export function parsePlatformPortalCommercialPlansPayload(
  value: unknown,
): PlatformPortalCommercialPlansPayload {
  const row = asRecord(value);
  const list = Array.isArray(row?.plans) ? row.plans : Array.isArray(value) ? value : [];
  const plans = list
    .map((item) => parsePlatformPortalCommercialPlan(item))
    .filter((item): item is PlatformPortalCommercialPlan => item != null);

  return {
    plans,
    generatedAt: asNullableTrimmedString(row?.generated_at ?? row?.generatedAt),
  };
}

export function parseSetCommercialPlanInput(
  customerId: string,
  body: unknown,
):
  | { ok: true; value: SetPlatformPortalCustomerCommercialPlanInput }
  | { ok: false; code: PlatformPortalCommercialPlanErrorCode } {
  if (!asRequiredId(customerId)) {
    return { ok: false, code: "invalid_customer" };
  }
  const row = asRecord(body);
  if (!row) return { ok: false, code: "unknown" };

  const allowed = new Set([
    "planId",
    "mode",
    "startMode",
    "trialDays",
    "internalReason",
    "idempotencyKey",
  ]);
  for (const key of Object.keys(row)) {
    if (!allowed.has(key)) return { ok: false, code: "unknown" };
  }

  const planId = asRequiredId(row.planId);
  if (!planId) return { ok: false, code: "invalid_plan" };

  const mode = asNullableTrimmedString(row.mode)?.toLowerCase();
  if (mode !== "lifetime" && mode !== "recurring") {
    return { ok: false, code: "invalid_mode" };
  }

  const startMode = asNullableTrimmedString(row.startMode)?.toLowerCase() ?? "now";
  if (startMode !== "now" && startMode !== "trial") {
    return { ok: false, code: "invalid_start_mode" };
  }
  if (startMode === "trial") {
    return { ok: false, code: "trial_not_supported" };
  }

  if (row.trialDays != null) {
    return { ok: false, code: "trial_not_supported" };
  }

  const internalReason = asNullableTrimmedString(row.internalReason);
  if (!internalReason || internalReason.length < 3 || internalReason.length > 500) {
    return { ok: false, code: "invalid_internal_reason" };
  }

  const idempotencyKey = asNullableTrimmedString(row.idempotencyKey);
  if (!idempotencyKey || idempotencyKey.length < 8 || idempotencyKey.length > 128) {
    return { ok: false, code: "invalid_idempotency_key" };
  }

  return {
    ok: true,
    value: {
      customerId,
      planId,
      mode,
      startMode,
      trialDays: null,
      internalReason,
      idempotencyKey,
    },
  };
}

export function parsePlatformPortalCustomerCommercialPlanResult(
  value: unknown,
): PlatformPortalCustomerCommercialPlanResult | null {
  const row = asRecord(value);
  if (!row) return null;
  const customerId = asRequiredId(row.customer_id ?? row.customerId);
  const subscription = asRecord(row.subscription);
  if (!customerId || !subscription) return null;

  const id = asRequiredId(subscription.id);
  const status = asNullableTrimmedString(subscription.status);
  const modeRaw = asNullableTrimmedString(subscription.mode)?.toLowerCase();
  if (!id || !status || (modeRaw !== "lifetime" && modeRaw !== "recurring")) return null;

  return {
    customerId,
    subscription: {
      id,
      planId: asRequiredId(subscription.plan_id ?? subscription.planId),
      planKey: asNullableTrimmedString(subscription.plan_key ?? subscription.planKey),
      planName: asNullableTrimmedString(subscription.plan_name ?? subscription.planName),
      mode: modeRaw,
      status,
      trialStartsAt: asNullableTrimmedString(
        subscription.trial_starts_at ?? subscription.trialStartsAt,
      ),
      trialEndsAt: asNullableTrimmedString(subscription.trial_ends_at ?? subscription.trialEndsAt),
      currentPeriodStartsAt: asNullableTrimmedString(
        subscription.current_period_starts_at ?? subscription.currentPeriodStartsAt,
      ),
      currentPeriodEndsAt: asNullableTrimmedString(
        subscription.current_period_ends_at ?? subscription.currentPeriodEndsAt,
      ),
      createdAt: asNullableTrimmedString(subscription.created_at ?? subscription.createdAt),
      updatedAt: asNullableTrimmedString(subscription.updated_at ?? subscription.updatedAt),
    },
    created: asStrictBoolean(row.created),
    replacedSubscriptionId: asRequiredId(
      row.replaced_subscription_id ?? row.replacedSubscriptionId,
    ),
    idempotentReplay: asStrictBoolean(row.idempotent_replay ?? row.idempotentReplay),
  };
}

export function mapCommercialPlanRpcError(
  message: string | null | undefined,
): { status: number; code: PlatformPortalCommercialPlanErrorCode } {
  const text = (message ?? "").toUpperCase();
  if (text.includes("PLATFORM PORTAL ACCESS DENIED") || text.includes("ACCESS DENIED")) {
    return { status: 403, code: "forbidden" };
  }
  if (text.includes("CUSTOMER_NOT_FOUND")) return { status: 404, code: "customer_not_found" };
  if (text.includes("PLAN_NOT_FOUND")) return { status: 404, code: "plan_not_found" };
  if (text.includes("ACTIVE_PLAN_CONFLICT")) return { status: 409, code: "active_plan_conflict" };
  if (text.includes("IDEMPOTENCY_CONFLICT")) return { status: 409, code: "idempotency_conflict" };
  if (text.includes("PLAN_LIFETIME_UNSUPPORTED")) {
    return { status: 422, code: "plan_lifetime_unsupported" };
  }
  if (text.includes("PLAN_RECURRING_UNSUPPORTED")) {
    return { status: 422, code: "plan_recurring_unsupported" };
  }
  if (text.includes("TRIAL_NOT_SUPPORTED")) return { status: 422, code: "trial_not_supported" };
  if (text.includes("INVALID_INTERNAL_REASON")) {
    return { status: 400, code: "invalid_internal_reason" };
  }
  if (text.includes("INVALID_IDEMPOTENCY_KEY")) {
    return { status: 400, code: "invalid_idempotency_key" };
  }
  if (text.includes("INVALID_MODE")) return { status: 400, code: "invalid_mode" };
  if (text.includes("INVALID_CUSTOMER")) return { status: 400, code: "invalid_customer" };
  if (text.includes("INVALID_PLAN")) return { status: 400, code: "invalid_plan" };
  return { status: 500, code: "unknown" };
}

export function createCommercialPlanIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `commercial-plan-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
