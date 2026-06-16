import { renderPartnersPortalFoundationPage } from "@/lib/partners-portal/render-pages";

export default function PartnersPortalPage() {
  return renderPartnersPortalFoundationPage(
    "partnersPortal.pages.trainingPrograms.title",
    "partnersPortal.pages.trainingPrograms.subtitle"
  );
}
