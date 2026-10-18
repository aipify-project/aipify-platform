import type { PortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import {
  assignedWebPlan,
  bedriftProductTone,
  webProductTone,
  type KompisProductAccessRead,
} from "@/lib/commercial-packages/portfolio-presentation";
import { WEBSITE_KOMPIS_PLAN_CATALOG } from "@/lib/website-kompis-plans/catalog";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { ArrowRight, Building2, Globe, MessagesSquare, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type KompisProductPortfolioProps = {
  labels: PortfolioLabels;
  access: KompisProductAccessRead;
  showCatalog?: boolean;
};

function toneClass(tone: "green" | "amber" | "violet" | "slate"): string {
  if (tone === "green") return "bg-[#E8F7F0] text-[var(--app-positive)] ring-[#B7E4CF]";
  if (tone === "amber") return "bg-[#FFF4E5] text-[var(--app-pending)] ring-[#F5D4A3]";
  if (tone === "violet") return "bg-[var(--app-primary-soft)] text-[var(--app-primary)] ring-[var(--app-border-accent)]";
  return "bg-[var(--app-soft-surface)] text-[var(--app-text-muted)] ring-[var(--app-border)]";
}

function StatusPill({ tone, children }: { tone: "green" | "amber" | "violet" | "slate"; children: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneClass(tone)}`}>
      {children}
    </span>
  );
}

function planLabel(labels: PortfolioLabels, plan: "free" | "standard" | "pro"): string {
  if (plan === "free") return labels.freeName;
  if (plan === "standard") return labels.standardName;
  return labels.proName;
}

export function KompisProductPortfolio({
  labels,
  access,
  showCatalog = false,
}: KompisProductPortfolioProps) {
  const webTone = webProductTone(access);
  const bedriftTone = bedriftProductTone(access);
  const webPlan = assignedWebPlan(access);

  const webStatus =
    webTone === "assigned" && webPlan
      ? planLabel(labels, webPlan)
      : webTone === "unassigned"
        ? labels.answerPlanUnassigned
        : webTone === "not_licensed"
          ? labels.notLicensed
          : labels.detailsUnavailable;

  const bedriftStatus =
    bedriftTone === "licensed"
      ? labels.active
      : bedriftTone === "not_licensed"
        ? labels.notLicensed
        : labels.detailsUnavailable;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="flex h-full flex-col overflow-hidden rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)]">
          <div className="relative aspect-[4/3] bg-[image:var(--app-primary-soft-fill)]">
            <Image
              src="/brand/kompis-web-product-visual.png"
              alt={labels.webImageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-4"
            />
          </div>
          <div className="flex flex-1 flex-col space-y-3 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Globe aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
              <MessagesSquare aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
              <h3 className="text-lg font-semibold text-[var(--app-text)]">{labels.kompisWeb}</h3>
            </div>
            <p className="text-sm font-medium text-[var(--app-text)]">{labels.webSummary}</p>
            <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.webBody}</p>
            {webTone === "unassigned" ? (
              <p className="text-sm text-[var(--app-text-muted)]">{labels.availableInWorkspace}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <StatusPill
                tone={webTone === "assigned" ? "green" : webTone === "unassigned" ? "slate" : webTone === "not_licensed" ? "slate" : "amber"}
              >
                {webStatus}
              </StatusPill>
              <StatusPill tone="violet">{labels.exploreReview}</StatusPill>
            </div>
            <Link
              href={FOUNDATION_NAV_BINDINGS.kompisWebDashboard}
              className={`mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--app-primary)] hover:underline motion-reduce:transition-none ${AppPremiumShell.focusRing}`}
            >
              {labels.seeWeb}
              <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </article>

        <article className="flex h-full flex-col overflow-hidden rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)]">
          <div className="relative aspect-[4/3] bg-[image:var(--app-primary-soft-fill)]">
            <Image
              src="/brand/kompis-bedrift-product-visual.png"
              alt={labels.bedriftImageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-4"
            />
          </div>
          <div className="flex flex-1 flex-col space-y-3 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Building2 aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
              <Users aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
              <h3 className="text-lg font-semibold text-[var(--app-text)]">{labels.kompisBedrift}</h3>
            </div>
            <p className="text-sm font-medium text-[var(--app-text)]">{labels.bedriftSummary}</p>
            <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.bedriftBody}</p>
            <StatusPill tone={bedriftTone === "licensed" ? "green" : bedriftTone === "not_licensed" ? "slate" : "amber"}>
              {bedriftStatus}
            </StatusPill>
            <Link
              href={FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard}
              className={`mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--app-primary)] hover:underline motion-reduce:transition-none ${AppPremiumShell.focusRing}`}
            >
              {labels.seeBedrift}
              <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </article>
      </div>

      {showCatalog ? (
        <section className="space-y-3" aria-labelledby="kompis-web-planned-catalog">
          <h3 id="kompis-web-planned-catalog" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.plannedPlansTitle}
          </h3>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.plannedCatalogNote}</p>
          <ul className="grid gap-3 md:grid-cols-3">
            {WEBSITE_KOMPIS_PLAN_CATALOG.map((plan) => (
              <li key={plan.id} className="flex h-full flex-col rounded-[var(--app-radius-lg)] border border-[var(--app-border-accent)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)]">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-semibold text-[var(--app-text)]">{planLabel(labels, plan.id)}</p>
                  <StatusPill tone="amber">{labels.planned}</StatusPill>
                </div>
                <p className="mt-4 text-2xl font-semibold tabular-nums text-[var(--app-text)]">
                  {plan.answerQuota.toLocaleString("nb-NO")}
                </p>
                <p className="text-sm text-[var(--app-text-muted)]">
                  {plan.quotaKind === "lifetime_total" ? labels.lifetimeAnswers : labels.answersPerMonth}
                </p>
                <div className="mt-auto pt-4 text-sm text-[var(--app-text-muted)]">
                  {plan.monthlyPrice ? (
                    <p>
                      {plan.monthlyPrice.amountDisplay} {labels.perMonth}
                    </p>
                  ) : (
                    <p>{labels.noCard}</p>
                  )}
                  {plan.annualPrice ? (
                    <p>
                      {plan.annualPrice.amountDisplay} {labels.perYear}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
