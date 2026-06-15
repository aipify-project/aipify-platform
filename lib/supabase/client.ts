import { getBrowserSupabaseClient } from "./browser-client";

export function createClient() {
  return getBrowserSupabaseClient();
}
