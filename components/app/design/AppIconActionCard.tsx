import Link from "next/link";
import type { ReactNode } from "react";
import { AppLayoutClasses } from "@/lib/design/app-layout";

export type AppIconActionCardTone = "purple" | "blue" | "lavender" | "slate" | "emerald" | "amber";

const TONE_CLASSES: Record<AppIconActionCardTone, string> = {
  purple: "bg-violet-100 text-violet-700 ring-violet-200",
  blue: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  lavender: "bg-purple-100 text-purple-700 ring-purple-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  emerald: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  amber: "bg-amber-100 text-amber-900 ring-amber-200",
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
      className={`${AppLayoutClasses.card} group flex h-full flex-col gap-4 transition hover:border-aipify-accent hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${TONE_CLASSES[tone]}`}
          aria-hidden="true"
        >
          <span className="[&_svg]:h-6 [&_svg]:w-6">{icon}</span>
        </span>
        {statusLabel ? (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${TONE_CLASSES[statusTone]}`}
          >
            {statusLabel}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 space-y-1.5">
        <h3 className="text-base font-semibold text-aipify-text group-hover:text-aipify-companion">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-aipify-text-secondary">{description}</p>
      </div>
    </Link>
  );
}
