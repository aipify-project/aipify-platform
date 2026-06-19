import { GovernanceCenterPanel } from "@/components/app/governance/GovernanceCenterPanel";
import { GOVERNANCE_RISK_LEVELS, PERMISSION_LEVELS } from "@/lib/aipify/governance";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GovernanceTaccPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);

  const riskLevels = Object.fromEntries(
    GOVERNANCE_RISK_LEVELS.map((r) => [r, t(`customerApp.governance.risk.${r}`)])
  );
  const permissionLevels = Object.fromEntries(
    PERMISSION_LEVELS.map((p) => [p, t(`customerApp.governance.permission.${p}`)])
  );

  return (
    <GovernanceCenterPanel
      labels={{
        title: t("customerApp.governance.center.title"),
        subtitle: t("customerApp.governance.center.subtitle"),
        loading: t("customerApp.governance.center.loading"),
        back: t("customerApp.governance.center.back"),
        privacy: t("customerApp.governance.center.privacy"),
        upgradeTitle: t("customerApp.governance.center.upgrade.title"),
        upgradeBody: t("customerApp.governance.center.upgrade.body"),
        upgradeCta: t("customerApp.governance.center.upgrade.cta"),
        metrics: {
          pending: t("customerApp.governance.metrics.pending"),
          blocked: t("customerApp.governance.metrics.blocked"),
          trust: t("customerApp.governance.metrics.trust"),
          audit: t("customerApp.governance.metrics.audit"),
        },
        sections: {
          approvals: t("customerApp.governance.sections.approvals"),
          audit: t("customerApp.governance.sections.audit"),
          trust: t("customerApp.governance.sections.trust"),
          permissions: t("customerApp.governance.sections.permissions"),
        },
        emergency: {
          active: t("customerApp.governance.emergency.active"),
          stop: t("customerApp.governance.emergency.stop"),
          resume: t("customerApp.governance.emergency.resume"),
          reason: t("customerApp.governance.emergency.reason"),
        },
        approval: {
          approve: t("customerApp.governance.approval.approve"),
          reject: t("customerApp.governance.approval.reject"),
          approveAlways: t("customerApp.governance.approval.approveAlways"),
          pauseCategory: t("customerApp.governance.approval.pauseCategory"),
        },
        riskLevels,
        permissionLevels,
        emptyApprovals: t("customerApp.governance.approvals.empty"),
        emptyAudit: t("customerApp.governance.audit.empty"),
        emptyTrust: t("customerApp.governance.trust.empty"),
        links: {
          audit: t("customerApp.governance.links.audit"),
          trust: t("customerApp.governance.links.trust"),
          settings: t("customerApp.governance.links.settings"),
          approvalProfiles: t("customerApp.governance.approvalProfilesLink"),
          approvalCenter: t("customerApp.governance.approvalCenterLink"),
          permissionsAccess: t("customerApp.governance.permissionsAccessLink"),
          trustTransparency: t("customerApp.governance.trustTransparencyLink"),
          financialGuardrails: t("customerApp.governance.financialGuardrailsLink"),
        },
      }}
    />
  );
}
