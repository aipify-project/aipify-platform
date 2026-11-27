import Link from "next/link";
import { Wallet } from "lucide-react";
import { CertifiedSalesPartnerSettlementsPanel } from "@/components/partners-portal/CertifiedSalesPartnerPortalPanels";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { CommissionExplainerCard, CommissionStatusTimeline, SalesExperienceHero } from "@/components/partners-portal/sales-experience";
import { buildCspSettlementsLabels, buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { buildSettlementStatementLabels } from "@/lib/certified-sales-partner/settlement-statement-labels";
import { buildCommissionExperience } from "@/lib/partners-portal/sales-experience-content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Commission & payouts overview — sales/commission history only.
 * Bank editing lives solely under Min profil → Utbetaling (no duplicate form).
 */
export default async function PartnersSettlementPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal", "partnerSettlements"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.settlement.title",
    "partnersPortal.certifiedSalesPartner.pages.settlement.subtitle",
  );
  const p = "partnersPortal.certifiedSalesPartner.settlementLinks";
  const commission = buildCommissionExperience(t);
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <div className="space-y-6">
        <SalesExperienceHero hero={commission.hero} />
        <CommissionStatusTimeline title={commission.timelineTitle} steps={commission.steps} />
        <div className="grid gap-3 md:grid-cols-2">
          {commission.rules.map((card) => (
            <CommissionExplainerCard key={card.id} card={card} />
          ))}
        </div>
        {commission.notes.map((note) => (
          <p key={note} className="text-sm text-[#64748B]">
            {note}
          </p>
        ))}
        <aside className="flex flex-col gap-3 rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EDFF] text-[#7C3AED]">
              <Wallet className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">
                {t(`${p}.payoutTitle`)}
              </p>
              <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{t(`${p}.payoutBody`)}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/partners/account/profile?tab=payout"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9]"
            >
              {t(`${p}.editPayoutCta`)}
            </Link>
            <Link
              href="/partners/account/help/commission"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[color:var(--aipify-border-strong)] px-4 py-2 text-sm font-semibold text-[#7C3AED]"
            >
              {t(`${p}.howCommissionCta`)}
            </Link>
          </div>
        </aside>
        <CertifiedSalesPartnerSettlementsPanel
          labels={buildCspSettlementsLabels(t)}
          statementLabels={buildSettlementStatementLabels(t)}
          locale={locale}
        />
      </div>
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
