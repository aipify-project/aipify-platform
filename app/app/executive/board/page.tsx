import { ExecutiveDigitalBoardCenterPanel } from "@/components/app/executive-digital-board-center";
import { buildExecutiveDigitalBoardCenterLabels } from "@/lib/executive-digital-board-center/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveDigitalBoardPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "executiveDigitalBoardCenter");
  const t = createTranslator(dict);
  const labels = buildExecutiveDigitalBoardCenterLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <ExecutiveDigitalBoardCenterPanel labels={labels} />
    </div>
  );
}
