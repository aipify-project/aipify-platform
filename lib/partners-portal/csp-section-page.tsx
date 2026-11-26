import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import type { ReactNode } from "react";

/** Shared CSP workspace page shell — never routes through Growth Partner renderers. */
export async function renderCspSectionPage(input: {
  titleKey: string;
  subtitleKey: string;
  children: (ctx: { locale: string; t: (key: string) => string }) => ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(t, input.titleKey, input.subtitleKey);
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      {input.children({ locale, t })}
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
