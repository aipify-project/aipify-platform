import InvoicesPanel from "@/components/platform/InvoicesPanel";
import { invoiceStatusLabels } from "@/lib/platform/labels";
import { resolveAuthoritativeTimeZone } from "@/lib/platform-presentation-quality/bcp47";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function safeCustomerReturn(value: string | undefined): string | null {
  if (!value || !value.startsWith("/platform/customers/")) return null;
  if (value.startsWith("//") || value.includes("://") || value.includes("\\")) return null;
  return value;
}

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlatformBillingInvoicesPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const query = (await searchParams) ?? {};
  const rawCustomer = typeof query.customerId === "string" ? query.customerId : undefined;
  const rawBucket = typeof query.bucket === "string" ? query.bucket : undefined;
  const rawReturn = typeof query.returnTo === "string" ? query.returnTo : undefined;
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <InvoicesPanel
      locale={locale}
      labels={{
        title: t("platform.billingCommerceCenter.modules.invoices"),
        subtitle: t("platform.billingCommerceCenter.moduleDescriptions.invoices"),
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
        unavailable: t("platform.economyDisplay.unavailable"),
        mustVerify: t("platform.economyDisplay.mustVerify"),
        notRegistered: t("platform.economyDisplay.notRegistered"),
        backToCustomer: t("platform.invoices.backToCustomer"),
        filteredEmpty: t("platform.invoices.filteredEmpty"),
      }}
      timeZone={resolveAuthoritativeTimeZone()}
      customerId={rawCustomer && UUID_REGEX.test(rawCustomer) ? rawCustomer : null}
      bucket={rawBucket === "overdue" || rawBucket === "paid" ? rawBucket : null}
      returnTo={safeCustomerReturn(rawReturn)}
    />
  );
}
