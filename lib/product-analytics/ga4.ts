import type { AnalyticsConsentState } from "@/lib/product-analytics/consent";

export type GtagCommand = "js" | "config" | "consent";
export type GtagFn = (...args: unknown[]) => void;

export type Ga4Window = {
  dataLayer?: unknown[];
  gtag?: GtagFn;
  [key: string]: unknown;
};

export type Ga4SyncResult = {
  action: "noop" | "blocked" | "disable" | "mount-script" | "configure" | "re-enable";
  shouldMountScript: boolean;
};

type Ga4RuntimeState = {
  measurementId: string | null;
  scriptLoaded: boolean;
  configCalled: boolean;
  consentDefaultSet: boolean;
};

let runtime: Ga4RuntimeState = {
  measurementId: null,
  scriptLoaded: false,
  configCalled: false,
  consentDefaultSet: false,
};

export function resetGa4RuntimeState(): void {
  runtime = {
    measurementId: null,
    scriptLoaded: false,
    configCalled: false,
    consentDefaultSet: false,
  };
}

export function resolveGaMeasurementId(
  envValue: string | undefined = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
): string | null {
  const trimmed = envValue?.trim();
  return trimmed ? trimmed : null;
}

export function buildGa4ScriptSrc(measurementId: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
}

export function gaDisableFlagKey(measurementId: string): string {
  return `ga-disable-${measurementId}`;
}

export function shouldMountGa4Script(
  consent: AnalyticsConsentState,
  measurementId: string | null,
  hydrated: boolean
): boolean {
  if (!hydrated || !measurementId || consent !== "granted") return false;
  if (runtime.scriptLoaded) return false;
  return true;
}

export function ensureGa4DataLayer(windowLike: Ga4Window): void {
  windowLike.dataLayer = windowLike.dataLayer ?? [];
  if (typeof windowLike.gtag !== "function") {
    windowLike.gtag = (...args: unknown[]) => {
      windowLike.dataLayer!.push(args);
    };
  }
}

function ensureGa4ConsentDefault(windowLike: Ga4Window): void {
  ensureGa4DataLayer(windowLike);
  if (runtime.consentDefaultSet) return;
  windowLike.gtag!("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  runtime.consentDefaultSet = true;
}

export function disableGa4Tracking(measurementId: string, windowLike: Ga4Window): void {
  windowLike[gaDisableFlagKey(measurementId)] = true;
  if (typeof windowLike.gtag === "function") {
    windowLike.gtag("consent", "update", { analytics_storage: "denied" });
  }
}

export function reEnableGa4Tracking(measurementId: string, windowLike: Ga4Window): void {
  windowLike[gaDisableFlagKey(measurementId)] = false;
  if (typeof windowLike.gtag === "function") {
    windowLike.gtag("consent", "update", { analytics_storage: "granted" });
  }
}

export function configureGa4Once(
  measurementId: string,
  windowLike: Ga4Window,
  now: Date = new Date()
): boolean {
  if (runtime.configCalled && runtime.measurementId === measurementId) {
    return false;
  }

  ensureGa4DataLayer(windowLike);
  windowLike[gaDisableFlagKey(measurementId)] = false;
  windowLike.gtag!("consent", "update", { analytics_storage: "granted" });
  windowLike.gtag!("js", now);
  windowLike.gtag!("config", measurementId, { send_page_view: true });
  runtime.configCalled = true;
  runtime.measurementId = measurementId;
  return true;
}

export function markGa4ScriptLoaded(measurementId: string): void {
  runtime.scriptLoaded = true;
  runtime.measurementId = measurementId;
}

export function syncGa4WithConsent(
  consent: AnalyticsConsentState,
  measurementId: string | null,
  windowLike: Ga4Window,
  hydrated: boolean
): Ga4SyncResult {
  if (!measurementId || !hydrated) {
    return { action: "noop", shouldMountScript: false };
  }

  if (consent !== "granted") {
    if (consent === "denied") {
      disableGa4Tracking(measurementId, windowLike);
    }
    return {
      action: consent === "unknown" ? "blocked" : "disable",
      shouldMountScript: false,
    };
  }

  if (runtime.scriptLoaded && runtime.configCalled && runtime.measurementId === measurementId) {
    if (windowLike[gaDisableFlagKey(measurementId)] === true) {
      reEnableGa4Tracking(measurementId, windowLike);
      return { action: "re-enable", shouldMountScript: false };
    }
    return { action: "noop", shouldMountScript: false };
  }

  ensureGa4DataLayer(windowLike);
  ensureGa4ConsentDefault(windowLike);
  windowLike[gaDisableFlagKey(measurementId)] = false;

  if (runtime.scriptLoaded) {
    const configured = configureGa4Once(measurementId, windowLike);
    return {
      action: configured ? "configure" : "re-enable",
      shouldMountScript: false,
    };
  }

  return { action: "mount-script", shouldMountScript: true };
}

export function handleGa4ScriptLoad(
  measurementId: string,
  windowLike: Ga4Window,
  now: Date = new Date()
): boolean {
  markGa4ScriptLoaded(measurementId);
  return configureGa4Once(measurementId, windowLike, now);
}

export function getGa4RuntimeStateForTests(): Readonly<Ga4RuntimeState> {
  return { ...runtime };
}
