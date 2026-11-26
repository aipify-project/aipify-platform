import { PartnersMessagesCenterPanel } from "@/components/partners-portal/PartnersMessagesCenterPanel";
import { renderCspSectionPage } from "@/lib/partners-portal/csp-section-page";
import { buildPartnersPortalMessagesLabels } from "@/lib/partners-portal/shell-labels";

/**
 * Partner ↔ Platform messaging. Fail-closed UI until Core messaging SQL is applied —
 * never invents an inbox. Uses CSP workspace shell (not Growth Partner stubs).
 */
export default function PartnersMessagesPage() {
  return renderCspSectionPage({
    titleKey: "partnersPortal.certifiedSalesPartner.messages.title",
    subtitleKey: "partnersPortal.certifiedSalesPartner.messages.subtitle",
    children: ({ locale, t }) => (
      <PartnersMessagesCenterPanel locale={locale} labels={buildPartnersPortalMessagesLabels(t)} />
    ),
  });
}
