"use client";

import Link from "next/link";

export function BusinessPackActivationInProgressBanner({
  title,
  message,
  supportHref = "/app/support",
  supportLabel = "Support",
}: {
  title: string;
  message: string;
  supportHref?: string;
  supportLabel?: string;
}) {
  return (
    <div className="border-b border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-950">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-violet-900">{message}</p>
      <p className="mt-2">
        <Link href={supportHref} className="font-medium text-violet-900 underline">
          {supportLabel}
        </Link>
      </p>
    </div>
  );
}
