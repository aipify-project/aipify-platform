import { CertifiedSellersSectionPanel } from "@/components/platform/sellers/CertifiedSellersSectionPanel";
import { isCertifiedSalesPartnerBackendReady, CSP_BACKEND_PROBE_RPC } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSellersPage() {
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
    <CertifiedSellersSectionPanel
      title={t("platform.sellers.partners.title")}
      subtitle={t("platform.sellers.partners.subtitle")}
      backendReady={backendReady}
      notReadyTitle={t("platform.sellers.backend.notReadyTitle")}
      notReadyBody={t("platform.sellers.backend.notReadyBody")}
      
    />
  );
}
