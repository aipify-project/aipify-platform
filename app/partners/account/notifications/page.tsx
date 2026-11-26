import {
  CertifiedSalesPartnerNotificationsPanel,
  buildCspNotificationsLabels,
} from "@/components/partners-portal/CertifiedSalesPartnerNotificationsPanel";
import { renderCspSectionPage } from "@/lib/partners-portal/csp-section-page";

export default function PartnersNotificationsPage() {
  return renderCspSectionPage({
    titleKey: "partnersPortal.certifiedSalesPartner.notifications.title",
    subtitleKey: "partnersPortal.certifiedSalesPartner.notifications.intro",
    children: ({ t }) => (
      <CertifiedSalesPartnerNotificationsPanel labels={buildCspNotificationsLabels(t)} />
    ),
  });
}
