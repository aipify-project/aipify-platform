import { ActionHubDetailPanel } from "@/components/app/action-hub";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type ActionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActionDetailPage({ params }: ActionDetailPageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <ActionHubDetailPanel
      actionId={id}
      locale={locale}
      labels={{
        loading: t("customerApp.actionHub.loading"),
        notFound: t("customerApp.actionHub.notFound"),
        back: t("customerApp.actionHub.back"),
        why: t("customerApp.actionHub.why"),
        goToSource: t("customerApp.actionHub.goToSource"),
        start: t("customerApp.actionHub.start"),
        complete: t("customerApp.actionHub.complete"),
        dismiss: t("customerApp.actionHub.dismiss"),
        decisions: t("customerApp.actionHub.decisions"),
        noDecisions: t("customerApp.actionHub.noDecisions"),
        helpful: t("customerApp.actionHub.helpful"),
        notHelpful: t("customerApp.actionHub.notHelpful"),
      }}
    />
  );
}
