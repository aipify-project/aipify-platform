import Link from "next/link";
import type { ReactNode } from "react";
import { KompisWorkspaceMascot } from "@/components/app/design/KompisWorkspaceMascot";
import type { AppIconActionCardTone } from "@/components/app/design/AppIconActionCard";

const STATUS_TONE: Record<AppIconActionCardTone, string> = {
  purple: "bg-[#F3EDFF] text-[#5538D3] ring-[#D3C7FF]",
  blue: "bg-[#E8EEFC] text-[#3E5ED6] ring-[#C9D4F8]",
  lavender: "bg-[#F3EDFF] text-[#6B4FD8] ring-[#D3C7FF]",
  slate: "bg-[#F4F6FB] text-[#5F6788] ring-[#E6E9F5]",
  emerald: "bg-[#E9F8F0] text-[#146C43] ring-[#B7E4CF]",
  amber: "bg-[#FFF4E5] text-[#945A15] ring-[#EEC58C]",
};

export type AppWorkspaceHeroStatus = {
  label: string;
  tone?: AppIconActionCardTone;
};

export type AppWorkspaceHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  contextLabel?: string | null;
  status?: AppWorkspaceHeroStatus | null;
  primaryAction?: { label: string; href: string } | null;
  note?: string | null;
  children?: ReactNode;
};

/** Shared Customer APP workspace hero. Feature owner: CUSTOMER APP. */
export function AppWorkspaceHero({
  eyebrow,
  title,
  description,
  contextLabel,
  status,
  primaryAction,
  note,
  children,
}: AppWorkspaceHeroProps) {
  return (
    <section className="aipify-workspace-hero relative overflow-hidden rounded-3xl border border-[#E4E6F2] bg-white shadow-[0_16px_40px_rgba(65,54,132,0.07)]">
      <div className="aipify-workspace-hero__glow" aria-hidden="true" />
      <div className="relative grid gap-6 p-6 sm:p-8 lg:min-h-[280px] lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center lg:gap-8 lg:p-10">
        <div className="relative z-10 min-w-0">
          <p className="text-sm font-semibold tracking-wide text-[#7055EE]">{eyebrow}</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-tight text-[#20243E] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#5C657C]">{description}</p>
          {contextLabel || status ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {contextLabel ? <p className="text-sm text-[#5C657C]">{contextLabel}</p> : null}
              {status ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 ${STATUS_TONE[status.tone ?? "slate"]}`}
                >
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                  {status.label}
                </span>
              ) : null}
            </div>
          ) : null}
          {note ? <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#5C657C]">{note}</p> : null}
          {primaryAction ? (
            <Link
              href={primaryAction.href}
              className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[image:var(--app-primary-gradient)] px-5 text-[0.9375rem] font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
            >
              {primaryAction.label}
            </Link>
          ) : null}
          {children}
        </div>
        <div className="relative z-10 flex justify-center lg:justify-end">
          <KompisWorkspaceMascot />
        </div>
      </div>
    </section>
  );
}
