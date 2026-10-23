import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { loadAccessControlPlaneSnapshot } from "./load-snapshot";

/** One snapshot per request. Layout and home share it so the module lookup is not repeated. */
export const loadRequestAccessControlPlaneSnapshot = cache(async () => {
  const supabase = await createClient();
  return loadAccessControlPlaneSnapshot(supabase);
});
