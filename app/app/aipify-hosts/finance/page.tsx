import { AipifyHostsFinanceCenterDashboardPanel } from "@/components/app/aipify-hosts-finance-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsFinancePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsFinanceCenter";

  const revStatusKeys = ["pending", "confirmed", "paid", "cancelled"] as const;
  const payStatusKeys = ["scheduled", "processing", "completed", "delayed"] as const;
  const expCatKeys = ["cleaning", "maintenance", "supplies", "utilities", "insurance", "other"] as const;
  const exportKeys = ["pdf", "excel", "csv"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${p}.retry`),
    backToHosts: t(`${p}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    allProperties: t(`${p}.allProperties`),
    allRevenueStatuses: t(`${p}.allRevenueStatuses`),
    allExpenseCategories: t(`${p}.allExpenseCategories`),
    revenueThisMonth: t(`${p}.revenueThisMonth`),
    revenueYtd: t(`${p}.revenueYtd`),
    upcomingPayouts: t(`${p}.upcomingPayouts`),
    outstandingExpenses: t(`${p}.outstandingExpenses`),
    netPerformance: t(`${p}.netPerformance`),
    property: t(`${p}.property`),
    reservationRef: t(`${p}.reservationRef`),
    checkIn: t(`${p}.checkIn`),
    checkOut: t(`${p}.checkOut`),
    amount: t(`${p}.amount`),
    status: t(`${p}.status`),
    emptyRevenueTitle: t(`${p}.emptyRevenueTitle`),
    emptyRevenueMessage: t(`${p}.emptyRevenueMessage`),
    expectedDate: t(`${p}.expectedDate`),
    source: t(`${p}.source`),
    emptyPayoutsTitle: t(`${p}.emptyPayoutsTitle`),
    emptyPayoutsMessage: t(`${p}.emptyPayoutsMessage`),
    recordExpense: t(`${p}.recordExpense`),
    amountPlaceholder: t(`${p}.amountPlaceholder`),
    saveExpense: t(`${p}.saveExpense`),
    category: t(`${p}.category`),
    date: t(`${p}.date`),
    notes: t(`${p}.notes`),
    emptyExpensesTitle: t(`${p}.emptyExpensesTitle`),
    emptyExpensesMessage: t(`${p}.emptyExpensesMessage`),
    expectedRevenue: t(`${p}.expectedRevenue`),
    expectedExpenses: t(`${p}.expectedExpenses`),
    estimatedNet: t(`${p}.estimatedNet`),
    actionRecorded: t(`${p}.actionRecorded`),
    actionFailed: t(`${p}.actionFailed`),
  };

  for (const key of revStatusKeys) labels[`revstatus_${key}`] = t(`${p}.revenueStatuses.${key}`);
  for (const key of payStatusKeys) labels[`paystatus_${key}`] = t(`${p}.payoutStatuses.${key}`);
  for (const key of expCatKeys) labels[`expcat_${key}`] = t(`${p}.expenseCategories.${key}`);
  for (const key of exportKeys) labels[`export_${key}`] = t(`${p}.exportFormats.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsFinanceCenterDashboardPanel labels={labels} />
    </div>
  );
}
