import { PwaInstallExperience } from "@/components/pwa/PwaInstallExperience";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPwaInstallLabels } from "@/lib/pwa/labels";

export async function PwaInstallShell({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["pwa"]);
  const t = createTranslator(dict);
  const labels = buildPwaInstallLabels(t);

  return <PwaInstallExperience labels={labels}>{children}</PwaInstallExperience>;
}
