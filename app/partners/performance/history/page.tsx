import { renderPartnersPortalFoundationPage } from "@/lib/partners-portal/render-pages";

export default function PartnersPortalPage() {
  return renderPartnersPortalFoundationPage(
    "partnersPortal.pages.historicalPerformance.title",
    "partnersPortal.pages.historicalPerformance.subtitle"
  );
}
