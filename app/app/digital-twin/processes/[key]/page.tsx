import { ProcessDetailPanel } from "@/components/app/digital-twin/ProcessDetailPanel";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ key: string }> };

export default async function ProcessDetailPage({ params }: PageProps) {
  const { key } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "digitalTwin");
  const t = createTranslator(dict);
  const p = "customerApp.digitalTwin";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <ProcessDetailPanel
        processKey={key}
        labels={{
          loading: t(`${p}.loading`),
          notFound: t(`${p}.notFound`),
          back: t(`${p}.back`),
          steps: t(`${p}.steps`),
          escalationPath: t(`${p}.escalationPath`),
        }}
      />
    </div>
  );
}
