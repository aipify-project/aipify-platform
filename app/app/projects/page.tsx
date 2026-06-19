import { ProjectExecutionPanel } from "@/components/app/project-execution";
import { buildProjectExecutionLabels } from "@/lib/project-execution/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ProjectsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildProjectExecutionLabels(t);

  return <ProjectExecutionPanel labels={labels} />;
}
