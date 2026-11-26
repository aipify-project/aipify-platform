import { renderPlatformSellersOpsPage } from "@/lib/platform/sellers-ops-page";

export default function PlatformSellersCommissionRatesPage() {
  return renderPlatformSellersOpsPage({
    titleKey: "platform.sellers.commissionRates.title",
    subtitleKey: "platform.sellers.commissionRates.subtitle",
    section: "commissionRates",
  });
}
