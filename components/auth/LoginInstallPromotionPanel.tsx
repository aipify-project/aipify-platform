import { ArrowRight, Plug } from "lucide-react";
import Link from "next/link";
import {
  getLoginInstallHelpHref,
  getLoginInstallStartHref,
} from "@/lib/auth/login-install-promotion";

export type LoginInstallPromotionLabels = {
  heading: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  primaryA11yLabel: string;
  secondaryA11yLabel: string;
  panelA11yLabel: string;
};

type LoginInstallPromotionPanelProps = {
  labels: LoginInstallPromotionLabels;
};

export function LoginInstallPromotionPanel({ labels }: LoginInstallPromotionPanelProps) {
  const installStartHref = getLoginInstallStartHref();
  const installHelpHref = getLoginInstallHelpHref();

  return (
    <aside
      aria-label={labels.panelA11yLabel}
      className="rounded-[22px] border border-[rgba(96,82,176,.15)] bg-white/95 p-4 shadow-[0_12px_30px_rgba(38,33,87,.06)] sm:p-5"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#eeeafe,#e8eefc)] text-[#6042d4] ring-1 ring-[rgba(96,82,176,.15)]"
            aria-hidden="true"
          >
            <Plug className="h-5 w-5" />
          </div>

          <div className="min-w-0 text-left">
            <h2 className="text-sm font-semibold tracking-tight text-[#1f2235] sm:text-[0.9375rem]">
              {labels.heading}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#687086]">{labels.description}</p>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end lg:flex-nowrap">
          <Link
            href={installStartHref}
            aria-label={labels.primaryA11yLabel}
            className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#7357e8,#5577f2)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(96,66,212,.22)] transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5577f2]/45 focus-visible:ring-offset-2 sm:w-auto"
          >
            <span>{labels.primaryAction}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>

          <Link
            href={installHelpHref}
            aria-label={labels.secondaryA11yLabel}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[rgba(96,82,176,.15)] bg-white px-4 py-2.5 text-sm font-medium text-[#1f2235] transition hover:border-[#7357e8]/40 hover:bg-[#eeeafe]/50 hover:text-[#6042d4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5577f2]/45 focus-visible:ring-offset-2 sm:w-auto"
          >
            {labels.secondaryAction}
          </Link>
        </div>
      </div>
    </aside>
  );
}
