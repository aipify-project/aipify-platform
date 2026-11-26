import { renderPlatformSellersOpsPage } from "@/lib/platform/sellers-ops-page";

export default function PlatformSellersMaterialsPage() {
  return renderPlatformSellersOpsPage({
    titleKey: "platform.sellers.materials.title",
    subtitleKey: "platform.sellers.materials.subtitle",
    section: "materials",
  });
}
