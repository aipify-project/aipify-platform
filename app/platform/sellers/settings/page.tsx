import { renderPlatformSellersOpsPage } from "@/lib/platform/sellers-ops-page";

export default function PlatformSellersSettingsPage() {
  return renderPlatformSellersOpsPage({
    titleKey: "platform.sellers.settings.title",
    subtitleKey: "platform.sellers.settings.subtitle",
    section: "settings",
  });
}
