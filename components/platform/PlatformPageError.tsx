"use client";

import Link from "next/link";

export type PlatformPageErrorProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  backHref?: string;
  backLabel?: string;
  diagnosticsHref?: string;
  diagnosticsLabel?: string;
};

export function PlatformPageError({
  title,
  message,
  onRetry,
  retryLabel = "Retry",
  backHref = "/platform",
  backLabel = "Back to Platform",
  diagnosticsHref = "/platform/system",
  diagnosticsLabel = "View diagnostics",
}: PlatformPageErrorProps) {
  return (
    <div className="mx-auto flex min-h-[320px] max-w-2xl flex-col items-center justify-center px-6 py-12 text-center">
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 px-6 py-8 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{message}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              {retryLabel}
            </button>
          ) : null}
          {backHref ? (
            <Link
              href={backHref}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              {backLabel}
            </Link>
          ) : null}
          {diagnosticsHref ? (
            <Link
              href={diagnosticsHref}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              {diagnosticsLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
