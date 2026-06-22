import { renderAppPortalFoundationPage } from "@/lib/app-portal/render-pages";

export const dynamic = "force-dynamic";

export default function OperationsInsightsPage() {
  return renderAppPortalFoundationPage("insights");
}
