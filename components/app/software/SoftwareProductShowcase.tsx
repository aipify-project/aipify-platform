import {
  assignedWebPlan,
  bedriftProductTone,
  webProductTone,
  type KompisProductAccessRead,
} from "@/lib/commercial-packages/portfolio-presentation";
import type { PortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import type { buildSoftwareShowcaseLabels } from "@/lib/commercial-packages/modules-panel-labels";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { ArrowRight, Building2, Globe, MessagesSquare, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ShowcaseLabels = ReturnType<typeof buildSoftwareShowcaseLabels>;

function StatusPill({ tone, children }: { tone: "green" | "amber" | "slate"; children: string }) {
  const className =
    tone === "green"
      ? "bg-[#E8F7F0] text-[var(--app-positive)] ring-[#B7E4CF]"
      : tone === "amber"
        ? "bg-[#FFF4E5] text-[var(--app-pending)] ring-[#F5D4A3]"
        : "bg-[var(--app-soft-surface)] text-[var(--app-text-muted)] ring-[var(--app-border)]";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {children}
    </span>
  );
}

function planLabel(labels: PortfolioLabels, plan: "free" | "standard" | "pro"): string {
  if (plan === "free") return labels.freeName;
  if (plan === "standard") return labels.standardName;
  return labels.proName;
}

export function SoftwareProductShowcase({
  embedded = false,
  showcase,
  labels,
  access,
}: {
  embedded?: boolean;
  showcase: ShowcaseLabels;
  labels: PortfolioLabels;
  access: KompisProductAccessRead;
}) {
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
    <div className="grid items-stretch gap-5 lg:grid-cols-2" data-embedded={embedded ? "true" : "false"}>
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--app-border-accent)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)] motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-reduce:transform-none">
          <div className="relative h-40 overflow-hidden bg-[image:var(--app-primary-soft-fill)] sm:h-48">
            <Image
              src="/brand/kompis-web-product-visual.png"
              alt={labels.webImageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-4"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Globe aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
              <MessagesSquare aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
              <h3 className="text-lg font-semibold text-[var(--app-text)]">{labels.kompisWeb}</h3>
            </div>
            <p className="text-sm font-medium text-[var(--app-text)]">{showcase.webLead}</p>
            <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{showcase.webSupport}</p>
            {webTone === "unassigned" ? (
              <p className="text-sm text-[var(--app-text-muted)]">{labels.availableInWorkspace}</p>
            ) : null}
            <StatusPill tone={webTone === "assigned" ? "green" : webTone === "unknown" ? "amber" : "slate"}>
              {webStatus}
            </StatusPill>
            <Link
              href={FOUNDATION_NAV_BINDINGS.kompisWebDashboard}
              className={`mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--app-primary)] hover:underline ${AppPremiumShell.focusRing}`}
            >
              {labels.seeWeb}
              <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </article>
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--app-border-accent)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)] motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-reduce:transform-none">
          <div className="relative h-40 overflow-hidden bg-[image:var(--app-primary-soft-fill)] sm:h-48">
            <Image
              src="/brand/kompis-bedrift-product-visual.png"
              alt={labels.bedriftImageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-4"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Building2 aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
              <Users aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
              <h3 className="text-lg font-semibold text-[var(--app-text)]">{labels.kompisBedrift}</h3>
            </div>
            <p className="text-sm font-medium text-[var(--app-text)]">{showcase.bedriftLead}</p>
            <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{showcase.bedriftSupport}</p>
            <StatusPill tone={bedriftTone === "licensed" ? "green" : bedriftTone === "unknown" ? "amber" : "slate"}>
              {bedriftStatus}
            </StatusPill>
            <Link
              href={FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard}
              className={`mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--app-primary)] hover:underline ${AppPremiumShell.focusRing}`}
            >
              {labels.seeBedrift}
              <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </article>
    </div>
  );
}
