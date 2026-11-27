"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useCspPortal } from "@/components/partners-portal/CspPortalSessionProvider";
import { CSP_LINK_ELIGIBLE_PARTNER_STATUSES } from "@/lib/certified-sales-partner/partner-overview";

const STEPS = [
  { id: "identity", href: "/partners/account/profile?tab=person" },
  { id: "payout", href: "/partners/account/profile?tab=payout" },
  { id: "academy", href: "/partners/academy/training" },
  { id: "link", href: "/partners/referrals/links" },
  { id: "materials", href: "/partners/marketing/assets" },
  { id: "share", href: "/partners/customers/leads" },
  { id: "follow", href: "/partners/settlement" },
] as const;

export type CspGettingStartedLabels = {
  title: string;
  intro: string;
  dailyGoalNote: string;
  stepLabel: string;
  openStep: string;
  motivation: string;
  done: string;
  pending: string;
  steps: Record<(typeof STEPS)[number]["id"], { title: string; body: string }>;
};

/**
 * Onboarding checklist driven by Core portal overview — never invents completion.
 * Payout/materials/share/follow stay informational until separate Core signals exist.
 */
export function CertifiedSalesPartnerGettingStartedPanel({ labels }: { labels: CspGettingStartedLabels }) {
  const portal = useCspPortal();

  const done = useMemo(() => {
    const overview = portal?.overview;
    const status = overview?.partnerStatus ?? null;
    const approved =
      typeof status === "string" &&
      (CSP_LINK_ELIGIBLE_PARTNER_STATUSES as readonly string[]).includes(status);
    const hasName = Boolean(overview?.displayName?.trim());
    const certPassed =
      (overview?.certifications ?? []).some((c) => c.status === "passed") ||
      (overview?.products ?? []).some((p) => p.certificationStatus === "passed");
    const hasLink = (portal?.links ?? []).some((l) => l.active && Boolean(l.code));
    const hasPayout = portal?.hasBankProfile === true;
    const hasSalesOrLeads = (portal?.salesTotal ?? 0) > 0;

    return {
      identity: hasName && approved,
      payout: hasPayout,
      academy: certPassed,
      link: hasLink && certPassed && approved,
      // Materials/share stay open actions — Core does not yet expose “materials used” / “shared” flags.
      materials: false,
      share: hasSalesOrLeads,
      follow: hasSalesOrLeads || hasPayout,
    } as Record<(typeof STEPS)[number]["id"], boolean>;
  }, [portal]);

  return (
    <article className="space-y-6">
      <header className="rounded-2xl border border-[color:var(--aipify-border)] bg-[linear-gradient(135deg,rgba(124,58,237,0.08),rgba(255,255,255,0.95))] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">Aipify</p>
        <h1 className="mt-2 text-2xl font-semibold text-[color:var(--aipify-text-primary)]">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
          {labels.intro}
        </p>
        <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">{labels.dailyGoalNote}</p>
      </header>

      <ol className="space-y-3">
        {STEPS.map((step, index) => {
          const complete = done[step.id];
          return (
            <li
              key={step.id}
              className="flex flex-col gap-3 rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <span className={complete ? "mt-0.5 text-teal-600" : "mt-0.5 text-[#7C3AED]"}>
                  {complete ? (
                    <CheckCircle2 className="h-5 w-5" aria-hidden />
                  ) : (
                    <Circle className="h-5 w-5" aria-hidden />
                  )}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                    {labels.stepLabel.replace("{n}", String(index + 1))}
                    {" · "}
                    {complete ? labels.done : labels.pending}
                  </p>
                  <h2 className="text-base font-semibold text-[color:var(--aipify-text-primary)]">
                    {labels.steps[step.id].title}
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
                    {labels.steps[step.id].body}
                  </p>
                </div>
              </div>
              <Link
                href={step.href}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[color:var(--aipify-border-strong)] px-4 text-sm font-semibold text-[#7C3AED]"
              >
                {labels.openStep}
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {labels.motivation}
      </p>
    </article>
  );
}
