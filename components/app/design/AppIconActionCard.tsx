import Link from "next/link";
import type { ReactNode } from "react";
import { AppVisualClasses } from "@/lib/design/app-visual-system";

export type AppIconActionCardTone = "purple" | "blue" | "lavender" | "slate" | "emerald" | "amber";

const TONE_CLASSES: Record<AppIconActionCardTone, string> = {
  purple: "bg-[var(--app-primary-soft)] text-[var(--app-primary)] ring-[var(--app-border-accent)]",
  blue: "bg-[#E8EEFC] text-[var(--app-primary-blue)] ring-[#C9D4F8]",
  lavender: "bg-[#F3EDFF] text-[#6B4FD8] ring-[var(--app-border-accent)]",
  slate: "bg-[var(--app-soft-surface)] text-[var(--app-text-muted)] ring-[var(--app-border)]",
  emerald: "bg-[#E8F7F0] text-[var(--app-positive)] ring-[#B7E4CF]",
  amber: "bg-[#FFF4E5] text-[var(--app-pending)] ring-[#F5D4A3]",
};

type AppIconActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  tone?: AppIconActionCardTone;
  statusLabel?: string;
  statusTone?: AppIconActionCardTone;
};

export function AppIconActionCard({
  href,
  title,
  description,
  icon,
  tone = "purple",
  statusLabel,
  statusTone = "slate",
}: AppIconActionCardProps) {
  return (
    <Link
      href={href}
      className={`${AppVisualClasses.cardInteractive} group relative z-[1] flex h-full flex-col gap-5 !p-6 sm:!p-7`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ${TONE_CLASSES[tone]}`}
          aria-hidden="true"
        >
          <span className="[&_svg]:h-6 [&_svg]:w-6 [&_svg]:stroke-[1.75]">{icon}</span>
        </span>
        {statusLabel ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium ring-1 ${TONE_CLASSES[statusTone]}`}
          >
            <StatusDot tone={statusTone} />
            {statusLabel}
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <h3 className="text-[1.125rem] font-semibold tracking-tight text-[var(--app-text)] group-hover:text-[var(--app-primary)] sm:text-[1.1875rem]">
            {title}
          </h3>
          <p className="text-[0.9375rem] leading-relaxed text-[var(--app-text-muted)] sm:text-base">{description}</p>
        </div>
        <span
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary-soft)] text-[var(--app-primary)] ring-1 ring-[var(--app-border-accent)] transition motion-reduce:transition-none group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 group-hover:bg-[image:var(--app-primary-soft-fill)]"
          aria-hidden="true"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function StatusDot({ tone }: { tone: AppIconActionCardTone }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
        tone === "emerald"
          ? "bg-[var(--app-positive)]"
          : tone === "amber"
            ? "bg-[var(--app-pending)]"
            : tone === "slate"
              ? "bg-[var(--app-neutral)]"
              : "bg-[var(--app-primary)]"
      }`}
      aria-hidden="true"
    />
  );
}
