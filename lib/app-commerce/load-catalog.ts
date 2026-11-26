import type { SupabaseClient } from "@supabase/supabase-js";
import { buildAppCommerceCatalog } from "./published-catalog";
import type { AppCommerceCatalog } from "./types";

/**
 * Prefer dedicated Core RPC when present; fall back to billing payload offers.
 * Missing Core contract → empty published list + honest blockers (never invent prices).
 */
export async function loadAppCommerceCatalog(input: {
  supabase: SupabaseClient;
  billing?: unknown;
  env?: NodeJS.ProcessEnv;
}): Promise<AppCommerceCatalog> {
  let coreCatalog: unknown = null;
  try {
    const { data, error } = await input.supabase.rpc("get_app_commerce_published_catalog");
    if (!error && data) coreCatalog = data;
  } catch {
    coreCatalog = null;
  }

  return buildAppCommerceCatalog({
    billing: input.billing,
    coreCatalog,
    env: input.env,
  });
}
