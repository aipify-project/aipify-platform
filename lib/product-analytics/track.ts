import {
  isAnalyticsConsentAllowed,
  readAnalyticsConsentFromDocument,
  type AnalyticsConsentState,
} from "@/lib/product-analytics/consent";
import {
  CORE_VALIDATED_EVENTS,
  isProductAnalyticsEventName,
  sanitizeProductAnalyticsParams,
  type ProductAnalyticsEventName,
  type ProductAnalyticsParams,
} from "@/lib/product-analytics/events";
import { resolveGaMeasurementId, type Ga4Window } from "@/lib/product-analytics/ga4";

export type TrackProductEventOptions = {
  /** Required for commercial / activation events — must reflect Core-confirmed success. */
  coreValidated?: boolean;
  consent?: AnalyticsConsentState;
  windowLike?: Ga4Window;
};

/**
 * Consent-gated GA4 event. Never throws; analytics failures must not block product UX.
 * Does not send email, names, payment details, or other PII.
 */
export function trackProductEvent(
  name: ProductAnalyticsEventName | string,
  params: ProductAnalyticsParams = {},
  options: TrackProductEventOptions = {},
): boolean {
  try {
    if (!isProductAnalyticsEventName(name)) return false;

    if (CORE_VALIDATED_EVENTS.has(name) && options.coreValidated !== true) {
      return false;
    }

    const consent = options.consent ?? readAnalyticsConsentFromDocument();
    if (!isAnalyticsConsentAllowed(consent)) return false;

    const measurementId = resolveGaMeasurementId();
    if (!measurementId) return false;

    const windowLike =
      options.windowLike ??
      (typeof window !== "undefined" ? (window as unknown as Ga4Window) : null);
    if (!windowLike || typeof windowLike.gtag !== "function") return false;

    const safeParams = sanitizeProductAnalyticsParams(params);
    windowLike.gtag("event", name, safeParams);
    return true;
  } catch {
    return false;
  }
}

export function trackLogin(method: string = "password"): boolean {
  return trackProductEvent("login", { method: method.slice(0, 40) });
}

export function trackSignUp(method: string = "workspace"): boolean {
  return trackProductEvent("sign_up", { method: method.slice(0, 40) });
}

export function trackPartnerApplicationSubmit(country?: string): boolean {
  return trackProductEvent("partner_application_submit", {
    country: country?.toUpperCase().slice(0, 2),
  });
}

export function trackAcademyStarted(productKey?: string): boolean {
  return trackProductEvent("academy_started", {
    product_key: productKey,
  });
}

export function trackAcademyExamCompleted(passed?: boolean, productKey?: string): boolean {
  return trackProductEvent("academy_exam_completed", {
    exam_passed: passed === true,
    product_key: productKey,
  });
}

export function trackModuleView(moduleKey: string, surface?: string): boolean {
  return trackProductEvent("module_view", {
    module_key: moduleKey.slice(0, 80),
    surface: surface?.slice(0, 40),
  });
}

export function trackModuleActivate(moduleKey: string, coreValidated: boolean): boolean {
  return trackProductEvent(
    "module_activate",
    { module_key: moduleKey.slice(0, 80) },
    { coreValidated },
  );
}

export function trackPartnerReferralVisit(productKey?: string): boolean {
  return trackProductEvent("partner_referral_visit", {
    product_key: productKey?.slice(0, 80),
  });
}

export function trackTrialStart(planKey?: string, coreValidated = true): boolean {
  return trackProductEvent(
    "trial_start",
    { plan_key: planKey?.slice(0, 40) },
    { coreValidated },
  );
}

export function trackBeginCheckout(planKey?: string, coreValidated = true): boolean {
  return trackProductEvent(
    "begin_checkout",
    { plan_key: planKey?.slice(0, 40) },
    { coreValidated },
  );
}

export function trackPurchase(planKey?: string, currency?: string, value?: number, coreValidated = true): boolean {
  return trackProductEvent(
    "purchase",
    {
      plan_key: planKey?.slice(0, 40),
      currency: currency?.toUpperCase().slice(0, 3),
      value: typeof value === "number" && Number.isFinite(value) ? value : undefined,
    },
    { coreValidated },
  );
}

export function trackSubscriptionUpgrade(planKey?: string, coreValidated = true): boolean {
  return trackProductEvent(
    "subscription_upgrade",
    { plan_key: planKey?.slice(0, 40) },
    { coreValidated },
  );
}
