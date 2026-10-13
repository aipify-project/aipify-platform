import Link from "next/link";
import {
  PLATFORM_EXCEPTION_DEFINITIONS,
  type PlatformControlPlaneLabels,
} from "@/lib/platform-control-plane";

type Props = {
  labels: PlatformControlPlaneLabels;
};

const severityTone = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
  attention: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
  critical: "bg-rose-100 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200",
} as const;

export function PlatformExceptionQueuePanel({ labels }: Props) {
  return (
    <section className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {labels.exceptions.title}
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          {labels.exceptions.subtitle}
        </p>
      </header>

      <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900/60">
        {PLATFORM_EXCEPTION_DEFINITIONS.map((item) => {
          const copy = labels.exceptions.items[item.id];
          return (
            <li key={item.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {copy?.label ?? item.id}
                  </h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityTone[item.severity]}`}
                  >
                    {labels.exceptions.severity[item.severity]}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {copy?.nextAction}
                </p>
              </div>
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                {labels.exceptions.open}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
