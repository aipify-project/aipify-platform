import { createClient } from "@/lib/supabase/server";
import { PLATFORM_LIVE_PRESENCE_SNAPSHOT_RPC } from "./constants";
import {
  parsePlatformLivePresenceSnapshot,
  type PlatformLivePresenceSnapshot,
} from "./parse-snapshot";

/**
 * Platform Admin presence snapshot via Core RPC.
 * Fail closed when RPC missing, unauthorized, or incomplete — never invent zeros.
 * Does not use service role.
 */
export async function loadPlatformLivePresenceSnapshot(): Promise<PlatformLivePresenceSnapshot | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc(PLATFORM_LIVE_PRESENCE_SNAPSHOT_RPC);
    if (error) return null;
    return parsePlatformLivePresenceSnapshot(data);
  } catch {
    return null;
  }
}
