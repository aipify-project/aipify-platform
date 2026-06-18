import { CommunityNetworkCenterPanel } from "@/components/app/customer-community-network-center";
import { buildCommunityNetworkCenterLabels } from "@/lib/customer-community-network-center/labels";
import type { CommunityNetworkSection } from "@/lib/customer-community-network-center";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function CommunityNetworkSectionPage({
  activeSection,
}: {
  activeSection: CommunityNetworkSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "communityNetworkCenter");
  const t = createTranslator(dict);
  const labels = buildCommunityNetworkCenterLabels(t);

  return <CommunityNetworkCenterPanel labels={labels} activeSection={activeSection} />;
}
