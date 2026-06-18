import type { ReactNode } from "react";
import { CommunityNetworkNav } from "@/components/app/customer-community-network-center";
import { buildCommunityNetworkCenterLabels } from "@/lib/customer-community-network-center/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommunityNetworkLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "communityNetworkCenter");
  const t = createTranslator(dict);
  const labels = buildCommunityNetworkCenterLabels(t);
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CommunityNetworkNav labels={labels.sections} />
      {children}
    </div>
  );
}
