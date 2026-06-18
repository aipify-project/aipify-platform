import { PrintOutputCenterPanel } from "@/components/app/settings/devices/PrintOutputCenterPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PrintersSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard", "navigation"]);
  const t = createTranslator(dict);

  return (
    <PrintOutputCenterPanel
      labels={{
        title: t("customerApp.printOutput.title"),
        subtitle: t("customerApp.printOutput.subtitle"),
        loading: t("customerApp.printOutput.loading"),
        printersTitle: t("customerApp.printOutput.printersTitle"),
        addPrinter: t("customerApp.printOutput.addPrinter"),
        noPrinters: t("customerApp.printOutput.noPrinters"),
        jobsTitle: t("customerApp.printOutput.jobsTitle"),
        noJobs: t("customerApp.printOutput.noJobs"),
        policyTitle: t("customerApp.printOutput.policyTitle"),
        printingEnabled: t("customerApp.printOutput.printingEnabled"),
        requireApproval: t("customerApp.printOutput.requireApproval"),
        savePolicy: t("customerApp.printOutput.savePolicy"),
        saved: t("customerApp.printOutput.saved"),
        auditTitle: t("customerApp.printOutput.auditTitle"),
        noAudit: t("customerApp.printOutput.noAudit"),
        status: {
          draft: t("customerApp.printOutput.status.draft"),
          waiting_for_confirmation: t("customerApp.printOutput.status.waiting_for_confirmation"),
          queued: t("customerApp.printOutput.status.queued"),
          printing: t("customerApp.printOutput.status.printing"),
          completed: t("customerApp.printOutput.status.completed"),
          failed: t("customerApp.printOutput.status.failed"),
          cancelled: t("customerApp.printOutput.status.cancelled"),
          online: t("customerApp.printOutput.status.online"),
          offline: t("customerApp.printOutput.status.offline"),
          unknown: t("customerApp.printOutput.status.unknown"),
        },
        connectionType: {
          local: t("customerApp.printOutput.connectionType.local"),
          network: t("customerApp.printOutput.connectionType.network"),
          shared: t("customerApp.printOutput.connectionType.shared"),
          cloud: t("customerApp.printOutput.connectionType.cloud"),
          department: t("customerApp.printOutput.connectionType.department"),
        },
        devicesHub: t("customerApp.printOutput.devicesHub"),
        printersNav: t("customerApp.printOutput.printersNav"),
        settings: t("customerApp.nav.settings"),
        historyLink: t("customerApp.printOutput.historyLink"),
        defaultBadge: t("customerApp.printOutput.defaultBadge"),
        location: t("customerApp.printOutput.location"),
        department: t("customerApp.printOutput.department"),
      }}
    />
  );
}
