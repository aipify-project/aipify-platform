import { renderPlatformSellersActionPage } from "@/lib/platform/sellers-action-page";

export default function PlatformSellersSettlementsPage() {
  return renderPlatformSellersActionPage({
    titleKey: "platform.sellers.settlements.title",
    subtitleKey: "platform.sellers.settlements.subtitle",
    section: "settlements",
  });
}
