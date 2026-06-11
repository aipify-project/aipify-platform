import { WatcherDetailPanel } from "@/components/app/aoc";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function WatcherDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.operationsCenter";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <WatcherDetailPanel
        findingId={id}
        labels={{
          loading: t(`${p}.loading`),
          notFound: t(`${p}.notFound`),
          back: t(`${p}.back`),
          recommendation: t(`${p}.recommendation`),
          linkedRecommendation: t(`${p}.linkedRecommendation`),
          expectedBenefit: t(`${p}.expectedBenefit`),
          humanOversight: t(`${p}.humanOversight`),
        }}
      />
    </div>
  );
}
