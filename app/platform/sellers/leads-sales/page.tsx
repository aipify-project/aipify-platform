import { renderPlatformSellersOpsPage } from "@/lib/platform/sellers-ops-page";

export default function PlatformSellersLeadsSalesPage() {
  return renderPlatformSellersOpsPage({
    titleKey: "platform.sellers.leadsSales.title",
    subtitleKey: "platform.sellers.leadsSales.subtitle",
    section: "leadsSales",
  });
}
