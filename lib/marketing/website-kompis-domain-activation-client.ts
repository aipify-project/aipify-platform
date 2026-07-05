import type { SupabaseClient } from "@supabase/supabase-js";
import {
  WEBSITE_KOMPIS_ACTIVATE_DOMAIN_RPC,
  WEBSITE_KOMPIS_DEACTIVATE_DOMAIN_RPC,
  parseWebsiteKompisDomainActivationRpc,
  type WebsiteKompisDomainActivation,
} from "@/lib/marketing/website-kompis-domain-activation";

type RpcClient = Pick<SupabaseClient, "rpc">;

export async function activateWebsiteKompisForDomain(
  supabase: RpcClient,
  domainId: string,
): Promise<WebsiteKompisDomainActivation | null> {
  const { data, error } = await supabase.rpc(WEBSITE_KOMPIS_ACTIVATE_DOMAIN_RPC, {
    p_domain_id: domainId,
  });
  if (error) {
    throw new Error(error.message);
  }
  return parseWebsiteKompisDomainActivationRpc(data);
}

export async function deactivateWebsiteKompisForDomain(
  supabase: RpcClient,
  domainId: string,
): Promise<WebsiteKompisDomainActivation | null> {
  const { data, error } = await supabase.rpc(WEBSITE_KOMPIS_DEACTIVATE_DOMAIN_RPC, {
    p_domain_id: domainId,
  });
  if (error) {
    throw new Error(error.message);
  }
  return parseWebsiteKompisDomainActivationRpc(data);
}
