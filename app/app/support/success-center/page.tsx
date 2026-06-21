import { existsSync } from "node:fs";
import path from "node:path";
import { SuccessCenterPanel } from "@/components/app/app-portal/SuccessCenterPanel";
import {
  SUCCESS_CENTER_METHODOLOGY_ARTICLE_SLUG,
  SUCCESS_CENTER_METHODOLOGY_HREF,
  buildSuccessCenterLabels,
} from "@/lib/app-portal/success-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

function resolveMethodologyHref(): string | null {
  const articlePath = path.join(
    process.cwd(),
    "content/knowledge/aipify/app-portal/faq",
    `${SUCCESS_CENTER_METHODOLOGY_ARTICLE_SLUG}.md`
  );
  return existsSync(articlePath) ? SUCCESS_CENTER_METHODOLOGY_HREF : null;
}

export default async function SuccessCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const methodologyHref = resolveMethodologyHref();

  return (
    <SuccessCenterPanel
      labels={buildSuccessCenterLabels(t)}
      locale={locale}
      methodologyHref={methodologyHref}
    />
  );
}
