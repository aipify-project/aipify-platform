import type { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchMemberVerificationCenter,
  type MemberVerificationProviderRpcClient,
  type MemberVerificationReadBundle,
} from "@/lib/integration-intelligence/providers/member-verification/member-verification-read-provider-adapter";
import type { VerificationProviderReader } from "./verification-read-orchestrator";

function toRpcClient(supabase: SupabaseClient): MemberVerificationProviderRpcClient {
  return {
    rpc: async (fn, params) => {
      const result = await supabase.rpc(fn, params ?? {});
      return { data: result.data, error: result.error };
    },
  };
}

export function createVerificationReadProviderBridge(supabase: SupabaseClient) {
  const client = toRpcClient(supabase);

  return {
    fetchQueue: (): Promise<MemberVerificationReadBundle> =>
      fetchMemberVerificationCenter(client, { section: "queue" }),
    fetchCase: (caseId: string): Promise<MemberVerificationReadBundle> =>
      fetchMemberVerificationCenter(client, { section: "case", case_id: caseId }),
    buildProviderReader: (bundle: MemberVerificationReadBundle): VerificationProviderReader => ({
      provider_key: "member_verification_center",
      active: bundle.source_exact,
      read_queue: async () => ({
        queue: bundle.queue,
        cases: bundle.cases,
        limitations: bundle.limitations,
      }),
      read_case: async (caseId) => {
        const caseBundle = await fetchMemberVerificationCenter(client, {
          section: "case",
          case_id: caseId,
        });
        return {
          case_summary: caseBundle.cases[0] ?? null,
          limitations: caseBundle.limitations,
        };
      },
    }),
  };
}
