import type { ReactNode } from "react";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

type Props = {
  title: string;
  subtitle?: string;
  principle?: string;
  actions?: ReactNode;
  compact?: boolean;
};

/** Consistent page header across APP, Platform, and portals. */
export function AipifyPageHeader({ title, subtitle, principle, actions, compact = false }: Props) {
  return (
    <header className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className={AipifyShellClasses.pageTitle}>{title}</h1>
          {subtitle ? <p className={AipifyShellClasses.pageSubtitle}>{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      {principle ? (
        <p className="rounded-2xl border border-aipify-accent-muted bg-aipify-accent-soft/40 px-4 py-3 text-sm text-aipify-text">
          {principle}
        </p>
      ) : null}
    </header>
  );
}
