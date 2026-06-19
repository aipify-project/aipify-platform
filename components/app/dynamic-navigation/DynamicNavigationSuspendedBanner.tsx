"use client";

import Link from "next/link";

export function DynamicNavigationSuspendedBanner({
  notice,
  billingHref = "/app/settings/billing",
  supportHref = "/app/support",
  renewLabel = "Renew subscription",
  billingLabel = "Billing",
  supportLabel = "Support",
}: {
  notice: string;
  billingHref?: string;
  supportHref?: string;
  renewLabel?: string;
  billingLabel?: string;
  supportLabel?: string;
}) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">⚠️ {notice}</p>
      <p className="mt-2 flex flex-wrap gap-4">
        <Link href={billingHref} className="font-medium text-amber-900 underline">{renewLabel}</Link>
        <Link href={billingHref} className="text-amber-800 underline">{billingLabel}</Link>
        <Link href={supportHref} className="text-amber-800 underline">{supportLabel}</Link>
      </p>
    </div>
  );
}
