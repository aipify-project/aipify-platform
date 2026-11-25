import { renderPlatformSellersLivePage } from "@/lib/platform/sellers-action-page";

export default function PlatformSellersAcademyPage() {
  return renderPlatformSellersLivePage({
    titleKey: "platform.sellers.academy.title",
    subtitleKey: "platform.sellers.academy.subtitle",
    section: "academy",
  });
}
