import { SystemNoticeProvider } from "@/components/providers/SystemNoticeProvider";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildSystemNoticeLabels } from "@/lib/system-notice/labels";
import type { ReactNode } from "react";

export async function SystemNoticeRootProvider({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common"]);
  const labels = buildSystemNoticeLabels(createTranslator(dict));
  return <SystemNoticeProvider labels={labels}>{children}</SystemNoticeProvider>;
}
