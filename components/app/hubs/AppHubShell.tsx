import Link from "next/link";
import type { ReactNode } from "react";
import { AppContentWidth, AppDecorativeOrb, AppPageHeader } from "@/components/app/design";
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
  purple: "bg-[var(--app-primary-soft)] text-[var(--app-primary)] ring-[var(--app-border-accent)]",
  blue: "bg-[#E8EEFC] text-[var(--app-primary-blue)] ring-[#C9D4F8]",
  lavender: "bg-[#F3EDFF] text-[#6B4FD8] ring-[var(--app-border-accent)]",
  slate: "bg-[var(--app-soft-surface)] text-[var(--app-text-muted)] ring-[var(--app-border)]",
  emerald: "bg-[#E8F7F0] text-[var(--app-positive)] ring-[#B7E4CF]",
  amber: "bg-[#FFF4E5] text-[var(--app-pending)] ring-[#F5D4A3]",
};

type AppHubShellProps = {
  breadcrumb: AppHubBreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  contextLabel?: string | null;
  status?: AppHubStatus | null;
  primaryAction?: { label: string; href: string } | null;
  /** Discrete decorative orb for dashboards/hub overviews — off on dense detail pages. */
  decorativeAccent?: boolean;
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
  decorativeAccent = false,
  children,
}: AppHubShellProps) {
  return (
    <AppContentWidth className="relative">
      {decorativeAccent ? <AppDecorativeOrb /> : null}

      <nav aria-label="Breadcrumb" className="relative z-[1] mb-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--app-text-muted)]">
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="rounded font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? "font-medium text-[var(--app-text)]" : undefined}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="relative z-[1]">
        <AppPageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          clearDecorativeOrb={decorativeAccent}
          actions={
            primaryAction ? (
              <Link
                href={primaryAction.href}
                className="inline-flex min-h-11 items-center rounded-[var(--app-radius-md)] bg-[image:var(--app-primary-gradient)] px-5 py-2.5 text-[0.9375rem] font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              >
                {primaryAction.label}
              </Link>
            ) : null
          }
          contextRow={
            contextLabel || status ? (
              <div className="flex flex-wrap items-center gap-3">
                {contextLabel ? (
                  <p className="text-sm text-[var(--app-text-muted)]">{contextLabel}</p>
                ) : null}
                {status ? (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_TONE[status.tone ?? "slate"]}`}
                  >
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        status.tone === "emerald"
                          ? "bg-[var(--app-positive)]"
                          : status.tone === "amber"
                            ? "bg-[var(--app-pending)]"
                            : status.tone === "slate" || !status.tone
                              ? "bg-[var(--app-neutral)]"
                              : "bg-[var(--app-primary)]"
                      }`}
                      aria-hidden="true"
                    />
                    {status.label}
                  </span>
                ) : null}
              </div>
            ) : null
          }
        />
      </div>

      {children ? <div className="relative z-[1] mt-2 space-y-7">{children}</div> : null}
    </AppContentWidth>
  );
}
