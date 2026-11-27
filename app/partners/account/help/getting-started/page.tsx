import { CertifiedSalesPartnerGettingStartedPanel } from "@/components/partners-portal/CertifiedSalesPartnerGettingStartedPanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

const STEP_IDS = ["identity", "payout", "academy", "link", "materials", "share", "follow"] as const;

export default async function PartnersGettingStartedPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const p = "partnersPortal.certifiedSalesPartner.guides.gettingStarted";
  const labels = buildCspWorkspaceLabels(t, `${p}.title`, `${p}.subtitle`);

  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerGettingStartedPanel
        labels={{
          title: t(`${p}.title`),
          intro: t(`${p}.intro`),
          dailyGoalNote: t(`${p}.dailyGoalNote`),
          stepLabel: t(`${p}.stepLabel`),
          openStep: t(`${p}.openStep`),
          motivation: t(`${p}.motivation`),
          done: t(`${p}.done`),
          pending: t(`${p}.pending`),
          steps: Object.fromEntries(
            STEP_IDS.map((id) => [
              id,
              {
                title: t(`${p}.steps.${id}.title`),
                body: t(`${p}.steps.${id}.body`),
              },
            ]),
          ) as Record<(typeof STEP_IDS)[number], { title: string; body: string }>,
        }}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
