import type { ReactNode } from "react";
import { ExecutiveCommandCenterLayoutShell } from "@/components/app/executive-command-center/ExecutiveCommandCenterLayoutShell";
import { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveCommandCenterLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "executiveCommandCenter");
  const t = createTranslator(dict);
  const labels = buildExecutiveCommandCenterLabels(t);

  return <ExecutiveCommandCenterLayoutShell labels={labels}>{children}</ExecutiveCommandCenterLayoutShell>;
}
