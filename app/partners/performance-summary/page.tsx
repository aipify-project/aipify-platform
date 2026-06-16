import { renderPartnersPortalFoundationPage } from "@/lib/partners-portal/render-pages";

export default function PartnersPortalPage() {
  return renderPartnersPortalFoundationPage(
    "partnersPortal.pages.performanceSummary.title",
    "partnersPortal.pages.performanceSummary.subtitle"
  );
}
