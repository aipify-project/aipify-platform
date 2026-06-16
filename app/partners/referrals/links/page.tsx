import { renderPartnersPortalFoundationPage } from "@/lib/partners-portal/render-pages";

export default function PartnersPortalPage() {
  return renderPartnersPortalFoundationPage(
    "partnersPortal.pages.referralLinks.title",
    "partnersPortal.pages.referralLinks.subtitle"
  );
}
