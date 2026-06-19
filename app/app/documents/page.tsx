import { DocumentManagementPanel } from "@/components/app/document-knowledge";
import { buildDocumentManagementLabels } from "@/lib/document-knowledge/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DocumentsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildDocumentManagementLabels(t);

  return <DocumentManagementPanel labels={labels} />;
}
