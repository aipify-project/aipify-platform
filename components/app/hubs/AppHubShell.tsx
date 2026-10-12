import Link from "next/link";
import type { ReactNode } from "react";
import { AppContentWidth, AppPageHeader } from "@/components/app/design";
import type { AppIconActionCardTone } from "@/components/app/design";

export type AppHubBreadcrumbItem = {
  label: string;
  href?: string;
};

export type AppHubStatus = {
  label: string;
  tone?: AppIconActionCardTone;
};

const STATUS_TONE: Record<AppIconActionCardTone, string> = {
  purple: "bg-violet-100 text-violet-800 ring-violet-200",
  blue: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  lavender: "bg-purple-100 text-purple-800 ring-purple-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  emerald: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  amber: "bg-amber-100 text-amber-900 ring-amber-200",
};

type AppHubShellProps = {
  breadcrumb: AppHubBreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  contextLabel?: string | null;
  status?: AppHubStatus | null;
  primaryAction?: { label: string; href: string } | null;
  children?: ReactNode;
};

export function AppHubShell({
  breadcrumb,
  eyebrow,
  title,
  description,
  contextLabel,
  status,
  primaryAction,
  children,
}: AppHubShellProps) {
  return (
    <AppContentWidth>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-aipify-text-secondary">
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="font-medium text-aipify-accent hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus rounded"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-medium text-aipify-text" : undefined} aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <AppPageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          primaryAction ? (
            <Link
              href={primaryAction.href}
              className="inline-flex rounded-lg bg-aipify-companion px-4 py-2.5 text-sm font-medium text-white transition hover:bg-aipify-companion-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
            >
              {primaryAction.label}
            </Link>
          ) : null
        }
        contextRow={
          contextLabel || status ? (
            <div className="flex flex-wrap items-center gap-3">
              {contextLabel ? (
                <p className="text-sm text-aipify-text-secondary">{contextLabel}</p>
              ) : null}
              {status ? (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_TONE[status.tone ?? "slate"]}`}
                >
                  {status.label}
                </span>
              ) : null}
            </div>
          ) : null
        }
      />

      {children ? <div className="space-y-6">{children}</div> : null}
    </AppContentWidth>
  );
}
