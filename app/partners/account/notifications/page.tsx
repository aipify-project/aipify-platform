import { CertifiedSalesPartnerNotificationsPanel } from "@/components/partners-portal/CertifiedSalesPartnerNotificationsPanel";
import { buildCspNotificationsLabels } from "@/lib/partners-portal/csp-section-labels";
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
