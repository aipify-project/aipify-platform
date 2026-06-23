import type { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchCommunityMemberDirectoryCenter,
  type CommunityMemberDirectoryProviderRpcClient,
  type CommunityMemberDirectoryReadBundle,
} from "@/lib/integration-intelligence/providers/community-member-directory/community-member-directory-read-provider-adapter";

function toRpcClient(supabase: SupabaseClient): CommunityMemberDirectoryProviderRpcClient {
  return {
    rpc: async (fn, params) => {
      const result = await supabase.rpc(fn, params ?? {});
      return { data: result.data, error: result.error };
    },
  };
}

export function createCommunityMemberDirectoryReadProviderBridge(supabase: SupabaseClient) {
  const client = toRpcClient(supabase);

  return {
    fetchDirectory: (input?: {
      search_term?: string | null;
      search_field?: string | null;
    }): Promise<CommunityMemberDirectoryReadBundle> =>
      fetchCommunityMemberDirectoryCenter(client, input),
    buildSearchBundle: (bundle: CommunityMemberDirectoryReadBundle): CommunityMemberDirectoryReadBundle =>
      bundle,
  };
}
