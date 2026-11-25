import { CertifiedSellersActionPanel } from "@/components/platform/sellers/CertifiedSellersActionPanel";
import { CertifiedSellersSectionPanel } from "@/components/platform/sellers/CertifiedSellersSectionPanel";
import { CSP_BACKEND_PROBE_RPC, isCertifiedSalesPartnerBackendReady } from "@/lib/certified-sales-partner";
import { buildSellersActionLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Section = "partners" | "settlements" | "products";

export async function renderPlatformSellersActionPage(input: {
  titleKey: string;
  subtitleKey: string;
  section: Section;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const backendReady = await isCertifiedSalesPartnerBackendReady({
    probe: async (rpcName) => {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc(rpcName || CSP_BACKEND_PROBE_RPC);
      if (error) {
        if (/does not exist|PGRST202|42883/i.test(String(error.message))) return null;
        return { found: false, error: error.message };
      }
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <CertifiedSellersSectionPanel
        title={t(input.titleKey)}
        subtitle={t(input.subtitleKey)}
        backendReady={backendReady}
        notReadyTitle={t("platform.sellers.backend.notReadyTitle")}
        notReadyBody={t("platform.sellers.backend.notReadyBody")}
      />
      <div className="px-6 lg:px-8">
        <CertifiedSellersActionPanel section={input.section} labels={buildSellersActionLabels(t)} />
      </div>
    </div>
  );
}
