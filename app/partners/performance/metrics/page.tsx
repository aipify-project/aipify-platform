import { renderPartnersPortalFoundationPage } from "@/lib/partners-portal/render-pages";

export default function PartnersPortalPage() {
  return renderPartnersPortalFoundationPage(
    "partnersPortal.pages.partnerMetrics.title",
    "partnersPortal.pages.partnerMetrics.subtitle"
  );
}
