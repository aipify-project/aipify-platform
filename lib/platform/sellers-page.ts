import { createClient } from "@/lib/supabase/server";
import {
  CSP_BACKEND_PROBE_RPC,
  buildCertifiedSalesPartnerLabels,
  isCertifiedSalesPartnerBackendReady,
} from "@/lib/certified-sales-partner";
import type { Translator } from "@/lib/i18n/translate";

export async function loadCertifiedSellersPageModel(t: Translator) {
  const labels = buildCertifiedSalesPartnerLabels(t);
  const backendReady = await isCertifiedSalesPartnerBackendReady({
    probe: async (rpcName) => {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc(rpcName);
      if (error) {
        if (/does not exist|PGRST202|42883/i.test(String(error.message))) return null;
        return { found: false, error: error.message };
      }
      return data;
    },
  });
  return {
    labels,
    backendReady,
    probeRpc: CSP_BACKEND_PROBE_RPC,
  };
}
