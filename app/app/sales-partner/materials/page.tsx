import { renderSalesPartnerMarketingHost } from "@/lib/sales-partner-app-migration/render-marketing-host";

/** Distinct materials route — avoids relying on ?section=library nav alone. */
export default async function SalesPartnerMaterialsPage() {
  return renderSalesPartnerMarketingHost("library");
}
