import Link from "next/link";
import type { ReactNode } from "react";
import { AppContentWidth, AppWorkspaceHero } from "@/components/app/design";
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
  /** Pages that render a dedicated editor header can skip the shared workspace hero. */
  suppressPageHeader?: boolean;
  children?: ReactNode;
};

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
      <nav aria-label={breadcrumbLabel} className="relative z-[1] mb-5">
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
          <AppWorkspaceHero
            eyebrow={eyebrow}
            title={title}
            description={description}
            contextLabel={contextLabel}
            status={status}
            primaryAction={primaryAction}
            note={note}
          />
        </div>
      )}

      {children ? <div className="relative z-[1] mt-2 space-y-7">{children}</div> : null}
    </AppContentWidth>
  );
}
