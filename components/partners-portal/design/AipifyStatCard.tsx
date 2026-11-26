import type { ReactNode } from "react";
import { AipifyCard } from "./AipifyCard";

type AipifyStatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
};

export function AipifyStatCard({ label, value, hint, icon }: AipifyStatCardProps) {
  return (
    <AipifyCard padding="sm" className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1E293B] tabular-nums">{value}</p>
          {hint ? <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{hint}</p> : null}
        </div>
        {icon ? (
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EDFF] text-[#7C3AED]" aria-hidden>
            {icon}
          </span>
        ) : null}
      </div>
    </AipifyCard>
  );
}
