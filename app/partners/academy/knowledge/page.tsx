import { renderPartnersPortalFoundationPage } from "@/lib/partners-portal/render-pages";

export default function PartnersPortalPage() {
  return renderPartnersPortalFoundationPage(
    "partnersPortal.pages.knowledgeMaterials.title",
    "partnersPortal.pages.knowledgeMaterials.subtitle"
  );
}
