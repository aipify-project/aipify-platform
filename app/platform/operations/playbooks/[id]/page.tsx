import { PlatformPlaybookDetailPanel } from "@/components/platform/platform-playbook-center/PlatformPlaybookDetailPanel";
import { buildPlatformPlaybookCenterLabels } from "@/lib/platform-playbook-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PlaybookDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlatformPlaybookDetailPage({ params }: PlaybookDetailPageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformPlaybookDetailPanel
      playbookId={id}
      backHref="/platform/operations/playbooks"
      labels={buildPlatformPlaybookCenterLabels(t)}
    />
  );
}
