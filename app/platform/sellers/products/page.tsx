import { renderPlatformSellersActionPage } from "@/lib/platform/sellers-action-page";

export default function PlatformSellersProductsPage() {
  return renderPlatformSellersActionPage({
    titleKey: "platform.sellers.products.title",
    subtitleKey: "platform.sellers.products.subtitle",
    section: "products",
  });
}
