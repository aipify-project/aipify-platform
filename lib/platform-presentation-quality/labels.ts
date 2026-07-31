import {
  PLATFORM_STATUS_CODES,
  PLATFORM_STATUS_LOCALE_KEYS,
  type PlatformStatusCode,
} from "./status-contract";

type Translator = (key: string) => string;

export type PlatformPresentationQualityLabels = {
  unknownStatus: string;
  emptyDate: string;
  invalidDate: string;
  notConfigured: string;
  notLinked: string;
  statuses: Record<string, string>;
  /** Short scope notes so cards do not appear to contradict without context. */
  scopes: {
    delivery: string;
    activation: string;
    runtime: string;
    customer: string;
    entitlements: string;
  };
  terms: {
    provisioning: string;
    entitlement: string;
    acknowledgement: string;
    websiteConnection: string;
    installationStatus: string;
    deliveryStatus: string;
  };
};

export function buildPlatformPresentationQualityLabels(
  t: Translator,
): PlatformPresentationQualityLabels {
  const root = "platform.presentationQuality";
  const statuses: Record<string, string> = {};

  for (const code of PLATFORM_STATUS_CODES) {
    const localeKey = PLATFORM_STATUS_LOCALE_KEYS[code as PlatformStatusCode];
    statuses[code] = t(`${root}.statuses.${localeKey}`);
  }

  return {
    unknownStatus: t(`${root}.unknownStatus`),
    emptyDate: t(`${root}.emptyDate`),
    invalidDate: t(`${root}.invalidDate`),
    notConfigured: t(`${root}.notConfigured`),
    notLinked: t(`${root}.notLinked`),
    statuses,
    scopes: {
      delivery: t(`${root}.scopes.delivery`),
      activation: t(`${root}.scopes.activation`),
      runtime: t(`${root}.scopes.runtime`),
      customer: t(`${root}.scopes.customer`),
      entitlements: t(`${root}.scopes.entitlements`),
    },
    terms: {
      provisioning: t(`${root}.terms.provisioning`),
      entitlement: t(`${root}.terms.entitlement`),
      acknowledgement: t(`${root}.terms.acknowledgement`),
      websiteConnection: t(`${root}.terms.websiteConnection`),
      installationStatus: t(`${root}.terms.installationStatus`),
      deliveryStatus: t(`${root}.terms.deliveryStatus`),
    },
  };
}
