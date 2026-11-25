import { renderPlatformSellersLivePage } from "@/lib/platform/sellers-action-page";

export default function PlatformSellersPage() {
  return renderPlatformSellersLivePage({
    titleKey: "platform.sellers.overview.title",
    subtitleKey: "platform.sellers.overview.subtitle",
    section: "overview",
  });
}
