import { PlatformPlaybookDesignerPanel } from "@/components/platform/platform-playbook-center/PlatformPlaybookDesignerPanel";
import { buildPlatformPlaybookCenterLabels } from "@/lib/platform-playbook-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type DesignerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlatformPlaybookDesignerPage({ params }: DesignerPageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformPlaybookDesignerPanel
      playbookId={id}
      surface="platform"
      backHref={`/platform/operations/playbooks/${id}`}
      labels={buildPlatformPlaybookCenterLabels(t)}
    />
  );
}
