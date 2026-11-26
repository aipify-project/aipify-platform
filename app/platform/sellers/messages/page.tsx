import { renderPlatformSellersOpsPage } from "@/lib/platform/sellers-ops-page";

export default function PlatformSellersMessagesPage() {
  return renderPlatformSellersOpsPage({
    titleKey: "platform.sellers.messages.title",
    subtitleKey: "platform.sellers.messages.subtitle",
    section: "messages",
  });
}
