import { ProductHeroTile } from "@/components/app/settings/billing/ProductHeroTile";
import { ProductStatusBadge } from "@/components/app/settings/billing/ProductStatusBadge";
import type { PortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import {
  buildWorkspaceProductCards,
  type ProductCardPrimaryAction,
  type WorkspaceProductCardModel,
  type WorkspaceProductId,
} from "@/lib/commercial-packages/product-hero";
import type { KompisProductAccessRead } from "@/lib/commercial-packages/portfolio-presentation";
import { WEBSITE_KOMPIS_PLAN_CATALOG } from "@/lib/website-kompis-plans/catalog";
import { SUPPORT_CREATE_HREF } from "@/lib/app-portal/support-history/config";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type KompisProductPortfolioProps = {
  labels: PortfolioLabels;
  access: KompisProductAccessRead;
  showCatalog?: boolean;
  /** When true, only render “mine” cards (sidebar compact). */
  mineOnly?: boolean;
};

function planLabel(labels: PortfolioLabels, plan: "free" | "standard" | "pro"): string {
  if (plan === "free") return labels.freeName;
  if (plan === "standard") return labels.standardName;
  return labels.proName;
}

function productCopy(
  labels: PortfolioLabels,
  id: WorkspaceProductId
): { name: string; summary: string; body: string; alt: string } {
  if (id === "kompis_bedrift") {
    return {
      name: labels.kompisBedrift,
      summary: labels.bedriftSummary,
      body: labels.bedriftBody,
      alt: labels.bedriftImageAlt,
    };
  }
  if (id === "sales_partner") {
    return {
      name: labels.salesPartner,
      summary: labels.salesPartnerSummary,
      body: labels.salesPartnerBody,
      alt: labels.salesPartnerImageAlt,
    };
  }
  return {
    name: labels.kompisWeb,
    summary: labels.webSummary,
    body: labels.webBody,
    alt: labels.webImageAlt,
  };
}

function actionLabel(labels: PortfolioLabels, action: ProductCardPrimaryAction): string {
  switch (action) {
    case "open":
      return labels.openProduct;
    case "view":
      return labels.viewProduct;
    case "upgrade":
      return labels.upgrade;
    case "buy":
      return labels.buy;
    case "add_module":
      return labels.addModule;
    case "contact":
      return labels.contactAipify;
    default:
      return labels.viewProduct;
  }
}

function actionHref(card: WorkspaceProductCardModel): string | null {
  if (card.primaryAction === "contact") return SUPPORT_CREATE_HREF;
  if (card.primaryAction === "add_module") return "/app/settings/modules";
  return card.openHref;
}

function StatusPill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#FFF4E5] px-2.5 py-1 text-xs font-medium text-[var(--app-pending)] ring-1 ring-[#F5D4A3]">
      {children}
    </span>
  );
}

function PricePair({
  labels,
  monthly,
  annual,
}: {
  labels: PortfolioLabels;
  monthly: string | null;
  annual: string | null;
}) {
  return (
    <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
      <div className="rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-soft-surface)] px-3 py-2.5">
        <p className="text-[0.65rem] font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
          {labels.perMonth}
        </p>
        <p className="mt-1 text-base font-semibold tabular-nums text-[var(--app-text)]">
          {monthly ?? labels.noCard}
        </p>
      </div>
      <div className="rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-soft-surface)] px-3 py-2.5">
        <p className="text-[0.65rem] font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
          {labels.perYear}
        </p>
        <p className="mt-1 text-base font-semibold tabular-nums text-[var(--app-text)]">
          {annual ?? "—"}
        </p>
      </div>
    </div>
  );
}

function ProductCard({
  card,
  labels,
}: {
  card: WorkspaceProductCardModel;
  labels: PortfolioLabels;
}) {
  const copy = productCopy(labels, card.id);
  const href = actionHref(card);
  const active = card.status === "active";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[var(--app-radius-lg)] border bg-[var(--app-card)] shadow-[var(--app-shadow-card)] ${
        active ? "border-[#B7E4CF] ring-1 ring-[var(--app-positive)]" : "border-[var(--app-border)]"
      }`}
      data-product-id={card.id}
      data-product-status={card.status}
    >
      <ProductHeroTile hero={card.hero} title={copy.name} descriptor={copy.summary} alt={copy.alt} />
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{copy.body}</p>
        <div className="flex flex-wrap gap-2">
          <ProductStatusBadge
            status={card.status}
            labels={{
              active: labels.active,
              notActive: labels.notActive,
              notLicensed: labels.notLicensed,
              underReview: labels.underReview,
              planned: labels.planned,
              available: labels.available,
              unknown: labels.unknown,
            }}
          />
          {card.planChip ? (
            <span className="inline-flex items-center rounded-full bg-[var(--app-primary-soft)] px-2.5 py-1 text-xs font-medium text-[var(--app-primary)] ring-1 ring-[var(--app-border-accent)]">
              {planLabel(labels, card.planChip)}
            </span>
          ) : null}
        </div>
        {href && card.primaryAction !== "none" ? (
          <Link
            href={href}
            className={`mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--app-primary)] hover:underline motion-reduce:transition-none ${AppPremiumShell.focusRing}`}
          >
            {actionLabel(labels, card.primaryAction)}
            <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
          </Link>
        ) : (
          <p className="mt-auto text-sm text-[var(--app-text-muted)]">{labels.contactForAccess}</p>
        )}
      </div>
    </article>
  );
}

export function KompisProductPortfolio({
  labels,
  access,
  showCatalog = false,
  mineOnly = false,
}: KompisProductPortfolioProps) {
  const cards = buildWorkspaceProductCards(access);
  const mine = cards.filter((c) => c.inMyProducts);
  const available = cards.filter((c) => !c.inMyProducts);

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="workspace-my-products">
        <div>
          <h3 id="workspace-my-products" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.myProducts}
          </h3>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.noChange}</p>
        </div>
        {mine.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {mine.map((card) => (
              <ProductCard key={card.id} card={card} labels={labels} />
            ))}
          </div>
        ) : (
          <p className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-soft-surface)] px-5 py-6 text-sm text-[var(--app-text-muted)]">
            {labels.detailsUnavailable}
          </p>
        )}
      </section>

      {!mineOnly && available.length > 0 ? (
        <section className="space-y-4" aria-labelledby="workspace-available-products">
          <div>
            <h3 id="workspace-available-products" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.availableProducts}
            </h3>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.exploreProducts}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {available.map((card) => (
              <ProductCard key={card.id} card={card} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {showCatalog ? (
        <section className="space-y-3" aria-labelledby="kompis-web-planned-catalog">
          <div>
            <h3 id="kompis-web-planned-catalog" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.plannedPlansTitle}
            </h3>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.plannedCatalogNote}</p>
          </div>
          <ul className="grid gap-3 md:grid-cols-3">
            {WEBSITE_KOMPIS_PLAN_CATALOG.map((plan) => (
              <li
                key={plan.id}
                className="flex h-full flex-col rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-semibold text-[var(--app-text)]">
                    {planLabel(labels, plan.id)}
                  </p>
                  <StatusPill>{labels.planned}</StatusPill>
                </div>
                <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-[var(--app-text)]">
                  {plan.answerQuota.toLocaleString("nb-NO")}
                </p>
                <p className="text-sm text-[var(--app-text-muted)]">
                  {plan.quotaKind === "lifetime_total" ? labels.lifetimeAnswers : labels.answersPerMonth}
                </p>
                <PricePair
                  labels={labels}
                  monthly={
                    plan.monthlyPrice
                      ? `${plan.monthlyPrice.amountDisplay} ${plan.monthlyPrice.currency}`
                      : null
                  }
                  annual={
                    plan.annualPrice
                      ? `${plan.annualPrice.amountDisplay} ${plan.annualPrice.currency}`
                      : null
                  }
                />
                <p className="mt-3 text-center text-xs text-[var(--app-text-muted)]">
                  {labels.contactForAccess}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
