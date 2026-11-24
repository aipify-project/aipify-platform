import { renderPlatformSellersActionPage } from "@/lib/platform/sellers-action-page";

export default function PlatformSellersCommissionRatesPage() {
  return renderPlatformSellersActionPage({
    titleKey: "platform.sellers.commissionRates.title",
    subtitleKey: "platform.sellers.commissionRates.subtitle",
    section: "products",
  });
}
