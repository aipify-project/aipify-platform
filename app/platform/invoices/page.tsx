import InvoicesPanel from "@/components/platform/InvoicesPanel";
import { invoiceStatusLabels } from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformInvoicesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <InvoicesPanel
      labels={{
        title: t("platform.invoices.title"),
        subtitle: t("platform.invoices.subtitle"),
        loading: t("platform.invoices.loading"),
        empty: t("platform.invoices.empty"),
        invoiceNumber: t("platform.invoices.invoiceNumber"),
        customer: t("platform.invoices.customer"),
        amount: t("platform.invoices.amount"),
        status: t("platform.invoices.status"),
        dueDate: t("platform.invoices.dueDate"),
        kid: t("platform.invoices.kid"),
        actions: t("platform.invoices.actions"),
        send: t("platform.invoices.send"),
        resend: t("platform.invoices.resend"),
        markPaid: t("platform.invoices.markPaid"),
        markOverdue: t("platform.invoices.markOverdue"),
        markFailed: t("platform.invoices.markFailed"),
        downloadPdf: t("platform.invoices.downloadPdf"),
        actionPending: t("platform.invoices.actionPending"),
        actionDone: t("platform.invoices.actionDone"),
        statusLabels: invoiceStatusLabels(t),
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}
