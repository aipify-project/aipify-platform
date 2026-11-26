import type { ReactNode } from "react";

type AipifyPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  contextRow?: ReactNode;
};

/** Compact page header for seller-portal subpages — no mascot/hero. */
export function AipifyPageHeader({ eyebrow, title, description, actions, contextRow }: AipifyPageHeaderProps) {
  return (
    <header className="space-y-3 pb-1">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">{eyebrow}</p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-[#1E293B] sm:text-[1.75rem]">{title}</h1>
          {description ? <p className="max-w-3xl text-sm leading-relaxed text-[#64748B] sm:text-[0.9375rem]">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {contextRow ? <div className="flex flex-wrap items-center gap-3">{contextRow}</div> : null}
      <div aria-hidden className="h-px w-full bg-[#E8E4F2]" />
    </header>
  );
}
