import Link from "next/link";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

const TOPICS = ["registration", "monthly", "yearly", "oneTime", "trial", "renewals", "basis", "refunds", "payout"] as const;

export default async function PartnersCommissionGuidePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const p = "partnersPortal.certifiedSalesPartner.guides.commission";
  const labels = buildCspWorkspaceLabels(t, `${p}.title`, `${p}.subtitle`);

  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <article className="space-y-6">
        <header className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">Aipify</p>
          <h1 className="mt-2 text-2xl font-semibold text-[color:var(--aipify-text-primary)]">{t(`${p}.title`)}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
            {t(`${p}.intro`)}
          </p>
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {t(`${p}.percentNotLive`)}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {TOPICS.map((id) => (
            <section
              key={id}
              className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-5 shadow-sm"
            >
              <h2 className="text-base font-semibold text-[color:var(--aipify-text-primary)]">
                {t(`${p}.topics.${id}.title`)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
                {t(`${p}.topics.${id}.body`)}
              </p>
            </section>
          ))}
        </div>

        <p className="text-sm text-[color:var(--aipify-text-secondary)]">{t(`${p}.illustrationNote`)}</p>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/partners/settlement"
            className="inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white"
          >
            {t(`${p}.toSettlement`)}
          </Link>
          <Link
            href="/partners/account/profile?tab=payout"
            className="inline-flex min-h-11 items-center rounded-xl border border-[color:var(--aipify-border-strong)] px-4 text-sm font-semibold text-[#7C3AED]"
          >
            {t(`${p}.toPayout`)}
          </Link>
          <Link
            href="/partners/customers/pipeline"
            className="inline-flex min-h-11 items-center rounded-xl border border-[color:var(--aipify-border-strong)] px-4 text-sm font-semibold text-[#7C3AED]"
          >
            {t(`${p}.toSales`)}
          </Link>
        </div>
      </article>
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
