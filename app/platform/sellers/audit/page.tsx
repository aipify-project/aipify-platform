import { renderPlatformSellersOpsPage } from "@/lib/platform/sellers-ops-page";

export default function PlatformSellersAuditPage() {
  return renderPlatformSellersOpsPage({
    titleKey: "platform.sellers.audit.title",
    subtitleKey: "platform.sellers.audit.subtitle",
    section: "audit",
  });
}
