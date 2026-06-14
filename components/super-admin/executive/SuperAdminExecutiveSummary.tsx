"use client";

import Link from "next/link";
import type { ExecutiveSummaryLine } from "@/lib/super-admin/executive-summary";

type SuperAdminExecutiveSummaryProps = {
  lines: ExecutiveSummaryLine[];
  title: string;
  openActionLabel: string;
};

export default function SuperAdminExecutiveSummary({
  lines,
  title,
  openActionLabel,
}: SuperAdminExecutiveSummaryProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{title}</h2>
      <ul className="mt-5 space-y-3">
        {lines.map((line) => (
          <li key={line.id}>
            {line.href ? (
              <Link
                href={line.href}
                className={`group flex items-center justify-between gap-4 rounded-lg px-1 py-0.5 transition hover:bg-zinc-50 ${
                  line.emphasis ? "font-semibold text-zinc-900" : "text-zinc-700"
                }`}
              >
                <span className="text-base leading-relaxed">{line.text}</span>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 opacity-0 transition group-hover:opacity-100">
                  {openActionLabel}
                </span>
              </Link>
            ) : (
              <p
                className={`text-base leading-relaxed ${
                  line.emphasis ? "font-semibold text-zinc-900" : "text-zinc-700"
                }`}
              >
                {line.text}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
