import { renderPartnersPortalFoundationPage } from "@/lib/partners-portal/render-pages";

export default function PartnersPortalPage() {
  return renderPartnersPortalFoundationPage(
    "partnersPortal.pages.referralRewards.title",
    "partnersPortal.pages.referralRewards.subtitle"
  );
}
