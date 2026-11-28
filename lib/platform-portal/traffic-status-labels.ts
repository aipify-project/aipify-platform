export type PlatformTrafficStatusLabels = {
  region: string;
  operational: string;
  operationalShort: string;
  operationalHint: string;
  newAppCustomers: string;
  newAppCustomersShort: string;
  newAppCustomersHint: string;
  newSellers: string;
  newSellersShort: string;
  newSellersHint: string;
  appCustomersOnline: string;
  appCustomersOnlineShort: string;
  sellersOnline: string;
  sellersOnlineShort: string;
  signedInUsers: string;
  signedInUsersShort: string;
  visitors: string;
  visitorsShort: string;
  visitorsHint: string;
  notMeasured: string;
  notMeasuredHint: string;
  unavailable: string;
  dayScope: string;
  lastChecked: string;
  source: string;
  stale: string;
  expand: string;
  collapse: string;
};

type Translator = (key: string) => string;

/** Shared i18n builder for the Platform Admin global status bar. */
export function buildPlatformTrafficStatusLabels(t: Translator): PlatformTrafficStatusLabels {
  return {
    region: t("platform.trafficStatus.region"),
    operational: t("platform.trafficStatus.operational"),
    operationalShort: t("platform.trafficStatus.operationalShort"),
    operationalHint: t("platform.trafficStatus.operationalHint"),
    newAppCustomers: t("platform.trafficStatus.newAppCustomers"),
    newAppCustomersShort: t("platform.trafficStatus.newAppCustomersShort"),
    newAppCustomersHint: t("platform.trafficStatus.newAppCustomersHint"),
    newSellers: t("platform.trafficStatus.newSellers"),
    newSellersShort: t("platform.trafficStatus.newSellersShort"),
    newSellersHint: t("platform.trafficStatus.newSellersHint"),
    appCustomersOnline: t("platform.trafficStatus.appCustomersOnline"),
    appCustomersOnlineShort: t("platform.trafficStatus.appCustomersOnlineShort"),
    sellersOnline: t("platform.trafficStatus.sellersOnline"),
    sellersOnlineShort: t("platform.trafficStatus.sellersOnlineShort"),
    signedInUsers: t("platform.trafficStatus.signedInUsers"),
    signedInUsersShort: t("platform.trafficStatus.signedInUsersShort"),
    visitors: t("platform.trafficStatus.visitors"),
    visitorsShort: t("platform.trafficStatus.visitorsShort"),
    visitorsHint: t("platform.trafficStatus.visitorsHint"),
    notMeasured: t("platform.trafficStatus.notMeasured"),
    notMeasuredHint: t("platform.trafficStatus.notMeasuredHint"),
    unavailable: t("platform.trafficStatus.unavailable"),
    dayScope: t("platform.trafficStatus.dayScope"),
    lastChecked: t("platform.trafficStatus.lastChecked"),
    source: t("platform.trafficStatus.source"),
    stale: t("platform.trafficStatus.stale"),
    expand: t("platform.trafficStatus.expand"),
    collapse: t("platform.trafficStatus.collapse"),
  };
}
