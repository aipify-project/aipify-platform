import Link from "next/link";
import type { PlatformControlPlaneLabels } from "@/lib/platform-control-plane";
import { PLATFORM_CONTROL_PLANE_IA } from "@/lib/platform-control-plane";
import type { PlatformNavGroupConfig } from "@/lib/platform/build-nav";

type Props = {
  labels: PlatformControlPlaneLabels;
  navGroups: PlatformNavGroupConfig[];
};

const readinessTone: Record<string, string> = {
  production: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  engine: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
  hub: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200",
  planned: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  stub: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

function labelForNavId(navGroups: PlatformNavGroupConfig[], navId: string, href: string) {
  for (const group of navGroups) {
    const match = group.items.find((item) => item.id === navId || item.href === href);
    if (match) return match.label;
  }
  return href;
}

export function PlatformControlPlaneSectionNav({ labels, navGroups }: Props) {
  return (
    <section className="space-y-4" aria-label={labels.title}>
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{labels.title}</h2>
        <p className="mt-1 max-w-4xl text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
        <p className="mt-2 max-w-4xl text-sm text-slate-500 dark:text-slate-400">{labels.principle}</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {PLATFORM_CONTROL_PLANE_IA.map((section) => {
          const sectionLabel = labels.sections.find((item) => item.id === section.id);
          return (
            <article
              key={section.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
              data-control-plane-section={section.id}
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {sectionLabel?.label ?? section.id}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {sectionLabel?.description}
              </p>
              <ul className="mt-3 space-y-2">
                {section.surfaces.map((surface) => (
                  <li key={`${section.id}-${surface.navId}`}>
                    <Link
                      href={surface.href}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm transition hover:border-violet-300 hover:bg-violet-50/60 dark:border-slate-700 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
                    >
                      <span className="min-w-0 truncate font-medium text-slate-800 dark:text-slate-100">
                        {labelForNavId(navGroups, surface.navId, surface.href)}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${readinessTone[surface.readiness]}`}
                      >
                        <span className="sr-only">{labels.openSurface}: </span>
                        {labels.readiness[surface.readiness]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
