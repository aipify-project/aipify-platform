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

type AppHubShellProps = {
  breadcrumbLabel: string;
  breadcrumb: AppHubBreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  contextLabel?: string | null;
  status?: AppHubStatus | null;
  primaryAction?: { label: string; href: string } | null;
  note?: string | null;
  /** Pages that render a dedicated editor header can skip the shared page header. */
  suppressPageHeader?: boolean;
  children?: ReactNode;
};

const STATUS_TONE: Record<AppIconActionCardTone, string> = {
  purple: "bg-[#F3EDFF] text-[#5538D3] ring-[#D3C7FF]",
  blue: "bg-[#E8EEFC] text-[#3E5ED6] ring-[#C9D4F8]",
  lavender: "bg-[#F3EDFF] text-[#6B4FD8] ring-[#D3C7FF]",
  slate: "bg-[#F4F6FB] text-[#5F6788] ring-[#E6E9F5]",
  emerald: "bg-[#E9F8F0] text-[#146C43] ring-[#B7E4CF]",
  amber: "bg-[#FFF4E5] text-[#945A15] ring-[#EEC58C]",
};

/**
 * Shared Customer APP page shell.
 * Compact header by default — full workspace hero/mascot stays on Dashboard only.
 */
export function AppHubShell({
  breadcrumbLabel,
  breadcrumb,
  eyebrow,
  title,
  description,
  contextLabel,
  status,
  primaryAction,
  note,
  suppressPageHeader = false,
  children,
}: AppHubShellProps) {
  return (
    <AppContentWidth className="relative">
      <nav aria-label={breadcrumbLabel} className="relative z-[1] mb-4">
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

      {suppressPageHeader ? null : (
        <div className="relative z-[1]">
          <AppPageHeader
            eyebrow={eyebrow}
            title={title}
            description={[description, note].filter(Boolean).join(" ")}
            actions={
              primaryAction ? (
                <Link
                  href={primaryAction.href}
                  className="inline-flex min-h-11 items-center rounded-xl bg-[image:var(--app-primary-gradient)] px-5 text-[0.9375rem] font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                >
                  {primaryAction.label}
                </Link>
              ) : null
            }
            contextRow={
              contextLabel || status ? (
                <div className="flex flex-wrap items-center gap-3">
                  {contextLabel ? <p className="text-sm text-[var(--app-text-muted)]">{contextLabel}</p> : null}
                  {status ? (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 ${STATUS_TONE[status.tone ?? "slate"]}`}
                    >
                      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                      {status.label}
                    </span>
                  ) : null}
                </div>
              ) : null
            }
          />
        </div>
      )}

      {children ? <div className="relative z-[1] mt-1 space-y-6">{children}</div> : null}
    </AppContentWidth>
  );
}
