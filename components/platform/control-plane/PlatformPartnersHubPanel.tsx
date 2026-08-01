import Link from "next/link";
import type { PlatformControlPlaneLabels } from "@/lib/platform-control-plane";

type Props = {
  labels: PlatformControlPlaneLabels;
};

const LINKS = [
  {
    href: "/platform/billing/growth-partner-attribution",
    key: "attribution" as const,
  },
  {
    href: "/platform/billing/commissions",
    key: "commissions" as const,
  },
  {
    href: "/platform/partners/settlement",
    key: "settlement" as const,
  },
];

export function PlatformPartnersHubPanel({ labels }: Props) {
  return (
    <section className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {labels.partnersHub.title}
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          {labels.partnersHub.subtitle}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-violet-700"
          >
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {labels.partnersHub[link.key]}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {labels.openSurface}
            </p>
          </Link>
        ))}
      </div>

      <aside
        className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
        role="note"
      >
        <p>{labels.partnersHub.settlementNote}</p>
        <p className="mt-1 font-medium">{labels.partnersHub.noPayoutHere}</p>
      </aside>
    </section>
  );
}
