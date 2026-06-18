import { AipifySystemNotice } from "@/components/ui/aipify-system-notice";
import { buildSystemNoticeLabels } from "@/lib/system-notice/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function NotFoundPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common"]);
  const t = createTranslator(dict);
  const labels = buildSystemNoticeLabels(t);

  return (
    <AipifySystemNotice
      status="not_found"
      labels={labels}
      tertiaryLabel={labels.contactSupport}
      tertiaryHref="/contact"
    />
  );
}
