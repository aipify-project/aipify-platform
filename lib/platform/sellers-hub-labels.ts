import type { Translator } from "@/lib/i18n/translate";
import type { PlatformSellersHubShellLabels } from "@/components/platform/sellers/PlatformSellersHubShell";

export function buildPlatformSellersHubLabels(t: Translator): PlatformSellersHubShellLabels {
  return {
    ariaLabel: t("platform.sellersHub.tabsLabel"),
    tabs: {
      overview: t("platform.nav.sellersOverview"),
      partners: t("platform.nav.sellersPartners"),
      products: t("platform.nav.sellersProducts"),
      commissionRates: t("platform.nav.sellersCommissionRates"),
      attribution: t("platform.nav.sellersAttribution"),
      academy: t("platform.nav.sellersAcademy"),
      materials: t("platform.nav.sellersMaterials"),
      leadsSales: t("platform.nav.sellersLeadsSales"),
      commissions: t("platform.nav.commissions"),
      settlements: t("platform.nav.sellersSettlements"),
      messages: t("platform.nav.sellersMessages"),
      audit: t("platform.nav.sellersAudit"),
      settings: t("platform.nav.sellersSettings"),
    },
  };
}
