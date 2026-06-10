import PlatformSupportPanel from "@/components/platform/PlatformSupportPanel";
import {
  supportCaseStatusLabels,
  supportCategoryLabels,
  supportPriorityLabels,
} from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSupportPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformSupportPanel
      locale={locale}
      labels={{
        title: t("platform.support.title"),
        subtitle: t("platform.support.subtitle"),
        loading: t("platform.support.loading"),
        empty: t("platform.support.empty"),
        customer: t("platform.support.customer"),
        category: t("platform.support.category"),
        priority: t("platform.support.priority"),
        assignee: t("platform.support.assignee"),
        lastUpdated: t("platform.support.lastUpdated"),
        subject: t("platform.support.subject"),
        aiEscalation: t("platform.support.aiEscalation"),
        aiCouldNotResolve: t("platform.support.aiCouldNotResolve"),
        requiresHumanReview: t("platform.support.requiresHumanReview"),
        unassigned: t("platform.support.unassigned"),
        viewCustomer: t("platform.support.viewCustomer"),
        pulseLabel: t("branding.pulseLabel"),
        statusLabels: supportCaseStatusLabels(t),
        categoryLabels: supportCategoryLabels(t),
        priorityLabels: supportPriorityLabels(t),
      }}
    />
  );
}
