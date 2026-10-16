/** Session fields this read needs. The server loader fills them from Core. */
export type WebsiteKompisSessionContext = {
  authenticated: boolean;
  state: string;
  customer_id: string | null;
};

/** Existing Core reads. This adapter does not add SQL, grants, or writers. */
export const WEBSITE_KOMPIS_LICENSE_QUOTA_READ_RPCS = [
  "get_app_organization_context",
  "is_tenant_module_enabled",
  "get_website_kompis_license_plan",
  "get_website_kompis_answer_quota",
] as const;

export const WEBSITE_KOMPIS_MODULE_KEY = "website_kompis";

const KNOWN_PLANS = ["free", "standard", "pro"] as const;

export type WebsiteKompisKnownPlanId = (typeof KNOWN_PLANS)[number];

export type WebsiteKompisRpcResult<T> = { ok: true; data: T } | { ok: false };

export type WebsiteKompisLicenseQuotaRead =
  | { kind: "unauthenticated" }
  | { kind: "no_module" }
  | { kind: "unknown_plan" }
  | { kind: "unavailable" }
  | {
      kind: "known_plan";
      plan: WebsiteKompisKnownPlanId;
      allowance: number;
      finalized: number;
      reserved: number;
      remaining: number;
      periodKey: string;
      acceptsNewAnswers: boolean;
    };

export type WebsiteKompisLicenseQuotaPorts = {
  readOrganizationContext: () => Promise<WebsiteKompisSessionContext>;
  isTenantModuleEnabled: (customerId: string) => Promise<WebsiteKompisRpcResult<boolean>>;
  getLicensePlan: (customerId: string) => Promise<WebsiteKompisRpcResult<unknown>>;
  getAnswerQuota: (customerId: string) => Promise<WebsiteKompisRpcResult<unknown>>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonNegativeInt(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return null;
  return value;
}

function knownPlan(value: unknown): WebsiteKompisKnownPlanId | null {
  if (typeof value !== "string") return null;
  return (KNOWN_PLANS as readonly string[]).includes(value)
    ? (value as WebsiteKompisKnownPlanId)
    : null;
}

/**
 * Maps already-fetched Core payloads. Numbers come only from the quota object.
 * A missing or unknown plan never becomes the free allowance.
 */
export function mapWebsiteKompisLicenseQuotaRead(input: {
  moduleResult: WebsiteKompisRpcResult<boolean>;
  licenseResult: WebsiteKompisRpcResult<unknown>;
  quotaResult: WebsiteKompisRpcResult<unknown>;
}): WebsiteKompisLicenseQuotaRead {
  if (!input.moduleResult.ok || !input.licenseResult.ok || !input.quotaResult.ok) {
    return { kind: "unavailable" };
  }
  if (input.moduleResult.data !== true) {
    return { kind: "no_module" };
  }

  if (!isRecord(input.licenseResult.data)) {
    return { kind: "unavailable" };
  }
  const plan = knownPlan(input.licenseResult.data.plan);
  if (!plan) {
    return { kind: "unknown_plan" };
  }

  if (!isRecord(input.quotaResult.data)) {
    return { kind: "unavailable" };
  }
  const quota = input.quotaResult.data;
  if (quota.plan !== plan) {
    return { kind: "unavailable" };
  }
  const allowance = nonNegativeInt(quota.allowance);
  const finalized = nonNegativeInt(quota.finalized);
  const reserved = nonNegativeInt(quota.reserved);
  const remaining = nonNegativeInt(quota.remaining);
  const periodKey = typeof quota.period_key === "string" ? quota.period_key : "";
  const periodZone = quota.period_zone;
  const periodOk =
    periodKey === "lifetime" || /^\d{4}-\d{2}$/.test(periodKey);
  const zoneOk = periodZone === undefined || periodZone === "utc";
  if (
    allowance === null ||
    finalized === null ||
    reserved === null ||
    remaining === null ||
    !periodOk ||
    !zoneOk ||
    typeof quota.accepts_new_answers !== "boolean"
  ) {
    return { kind: "unavailable" };
  }

  return {
    kind: "known_plan",
    plan,
    allowance,
    finalized,
    reserved,
    remaining,
    periodKey,
    acceptsNewAnswers: quota.accepts_new_answers,
  };
}

/** Session customer id only. Unauthenticated callers never receive quota fields. */
export async function readWebsiteKompisLicenseQuota(
  ports: WebsiteKompisLicenseQuotaPorts,
): Promise<WebsiteKompisLicenseQuotaRead> {
  let context: WebsiteKompisSessionContext;
  try {
    context = await ports.readOrganizationContext();
  } catch {
    return { kind: "unavailable" };
  }

  if (!context.authenticated || context.state === "unauthenticated") {
    return { kind: "unauthenticated" };
  }
  if (context.state !== "ready" || !context.customer_id) {
    return { kind: "unavailable" };
  }

  const customerId = context.customer_id;
  try {
    const [moduleResult, licenseResult, quotaResult] = await Promise.all([
      ports.isTenantModuleEnabled(customerId),
      ports.getLicensePlan(customerId),
      ports.getAnswerQuota(customerId),
    ]);
    return mapWebsiteKompisLicenseQuotaRead({ moduleResult, licenseResult, quotaResult });
  } catch {
    return { kind: "unavailable" };
  }
}
