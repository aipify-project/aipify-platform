import { renderPlatformSellersActionPage } from "@/lib/platform/sellers-action-page";

/**
 * Seller commissions & settlements — lives under SELGERE, never under customer billing layout.
 * Feature owner: PLATFORM ADMIN (Certified Sales Partner finance).
 */
export default function PlatformSellersCommissionsPage() {
  return renderPlatformSellersActionPage({
    titleKey: "platform.sellers.commissions.title",
    subtitleKey: "platform.sellers.commissions.subtitle",
    section: "commissions",
  });
}
