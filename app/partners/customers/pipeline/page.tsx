import { renderPartnersPortalFoundationPage } from "@/lib/partners-portal/render-pages";

export default function PartnersPortalPage() {
  return renderPartnersPortalFoundationPage(
    "partnersPortal.pages.pipeline.title",
    "partnersPortal.pages.pipeline.subtitle"
  );
}
