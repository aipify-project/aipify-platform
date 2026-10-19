import { createClient } from "@/lib/supabase/server";
import { getCustomerModulesCenter } from "@/lib/commercial-packages/client";
import { parseModulesCenter } from "@/lib/commercial-packages/parse";
import type { ModulesCenter } from "@/lib/commercial-packages/types";

export async function loadCustomerModulesCenterSafe(): Promise<
  { ok: true; center: ModulesCenter } | { ok: false; center: null }
> {
  try {
    const supabase = await createClient();
    const data = await getCustomerModulesCenter(supabase);
    return { ok: true, center: parseModulesCenter(data) };
  } catch {
    return { ok: false, center: null };
  }
}
