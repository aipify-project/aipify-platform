import type { SupabaseClient } from "@supabase/supabase-js";

/** Minimal Supabase surface for Core RPC helpers — compatible with PostgrestFilterBuilder await. */
export type RpcClient = Pick<SupabaseClient, "rpc">;
