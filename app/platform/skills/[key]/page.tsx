import { PlatformSkillDetailPanel } from "@/components/platform/skills/PlatformSkillDetailPanel";
import { buildSkillsMarketplaceLabels } from "@/lib/skills-marketplace";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSkillDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformSkillDetailPanel
      skillKey={key}
      labels={buildSkillsMarketplaceLabels(t, "platform")}
    />
  );
}
