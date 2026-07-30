import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { mapWebsiteStagingRunSnapshot, type WebsiteStagingRpcResult } from "./runs";
import type { WebsiteStagingRunSummary } from "./types";

/**
 * Re-verifies the live runtime for a run's website using the same shared
 * verifier (`_website_cms_verify_runtime`) real customer publishes use.
 */
export async function verifyWebsiteStagingRuntime(
  supabase: SupabaseClient,
  runId: string,
): Promise<WebsiteStagingRpcResult<WebsiteStagingRunSummary>> {
  const { data, error } = await supabase.rpc("verify_website_staging_runtime", { p_run_id: runId });
  if (error) {
    return { ok: false, errorCode: "verify_runtime_failed", rawMessage: error.message };
  }
  return { ok: true, value: mapWebsiteStagingRunSnapshot(data) };
}
