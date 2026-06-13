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
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <TrustDomainIcon icon={domain.icon} />
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClass}`}>
          {statusLabel}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{description}</p>
      <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50/60 px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-sky-700/80">{statLabel}</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{statValue}</p>
      </div>
      <Link
        href={domain.href}
        className="mt-4 inline-flex items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-100"
      >
        {openLabel}
      </Link>
    </article>
  );
}
