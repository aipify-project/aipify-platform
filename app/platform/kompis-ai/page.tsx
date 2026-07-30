import { KompisAiGovernancePanel } from "@/components/platform/kompis-ai/KompisAiGovernancePanel";
import { buildKompisAiGovernanceLabels } from "@/lib/platform/kompis-ai-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import { createClient } from "@/lib/supabase/server";

export default async function PlatformKompisAiPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildKompisAiGovernanceLabels(t);
  const supabase = await createClient();
  const profile = await getPlatformProfile(supabase);
  const canCheck = profile?.role === "super_admin";

  return <KompisAiGovernancePanel labels={labels} canCheck={Boolean(canCheck)} />;
}
