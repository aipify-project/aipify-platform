import Link from "next/link";
import type { TrustDomain } from "@/lib/platform/trust-center/config";
import { TrustDomainIcon } from "./TrustDomainIcon";

type Props = {
  domain: TrustDomain;
  title: string;
  description: string;
  statLabel: string;
  statValue: string;
  statusLabel: string;
  statusTone: "active" | "attention";
  openLabel: string;
};

export function TrustDomainCard({
  domain,
  title,
  description,
  statLabel,
  statValue,
  statusLabel,
  statusTone,
  openLabel,
}: Props) {
  const statusClass =
    statusTone === "attention"
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : "bg-emerald-50 text-emerald-800 ring-emerald-200";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <TrustDomainIcon icon={domain.icon} />
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClass}`}>
          {statusLabel}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{description}</p>
      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{statLabel}</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{statValue}</p>
      </div>
      <Link
        href={domain.href}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        {openLabel}
      </Link>
    </article>
  );
}
