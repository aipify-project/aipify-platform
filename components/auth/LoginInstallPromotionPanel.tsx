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
      className="rounded-xl border border-gray-200/90 bg-white/90 p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 ring-1 ring-violet-100"
            aria-hidden="true"
          >
            <Plug className="h-5 w-5" />
          </div>

          <div className="min-w-0 text-left">
            <h2 className="text-sm font-semibold tracking-tight text-gray-900 sm:text-[0.9375rem]">
              {labels.heading}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{labels.description}</p>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end lg:flex-nowrap">
          <Link
            href={installStartHref}
            aria-label={labels.primaryA11yLabel}
            className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 sm:w-auto"
          >
            <span>{labels.primaryAction}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>

          <Link
            href={installHelpHref}
            aria-label={labels.secondaryA11yLabel}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-violet-200 hover:bg-violet-50/40 hover:text-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 sm:w-auto"
          >
            {labels.secondaryAction}
          </Link>
        </div>
      </div>
    </aside>
  );
}
