import BusinessPackNotFoundContent from "@/components/marketing/business-packs/BusinessPackNotFoundContent";
import { parseBusinessPackDetailSharedLabels } from "@/lib/marketing/business-packs/parse-detail-page";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";

export default async function BusinessPackNotFound() {
  const { marketing } = await getMarketingContext();
  const labels = parseBusinessPackDetailSharedLabels(marketing);

  return <BusinessPackNotFoundContent labels={labels} />;
}
