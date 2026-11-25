import { renderPlatformSellersActionPage } from "@/lib/platform/sellers-action-page";

export default function PlatformSellersPartnersPage() {
  return renderPlatformSellersActionPage({
    titleKey: "platform.sellers.partners.title",
    subtitleKey: "platform.sellers.partners.subtitle",
    section: "partners",
  });
}
