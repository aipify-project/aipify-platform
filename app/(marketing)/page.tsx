import ApprovedPublicHome from "@/components/marketing/homepage/approved-home/ApprovedPublicHome";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseApprovedPublicHome } from "@/lib/marketing/parse-approved-public-home";

/**
 * Public marketing home — approved design V1 (Svein).
 * Existing MarketingNavbar / footer / language selector stay in layout.
 */
export default async function MarketingHomePage() {
  const { marketing } = await getMarketingContext();
  const labels = parseApprovedPublicHome(marketing);

  return <ApprovedPublicHome labels={labels} />;
}
