import { renderPlatformSellersOpsPage } from "@/lib/platform/sellers-ops-page";

export default function PlatformSellersAttributionPage() {
  return renderPlatformSellersOpsPage({
    titleKey: "platform.sellers.attribution.title",
    subtitleKey: "platform.sellers.attribution.subtitle",
    section: "attribution",
  });
}
