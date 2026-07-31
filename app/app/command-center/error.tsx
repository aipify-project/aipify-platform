"use client";

import Link from "next/link";
import { useEffect } from "react";

type CommandCenterErrorProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
};

/**
 * ECC segment error boundary — never fall through to English global-error.
 */
export default function CommandCenterError({
  error,
  reset,
  unstable_retry,
}: CommandCenterErrorProps) {
  useEffect(() => {
    console.error("[command-center/error]", error.digest ?? error.message);
  }, [error]);

  const retry = () => {
    if (typeof unstable_retry === "function") unstable_retry();
    else if (typeof reset === "function") reset();
  };

  return (
    <div className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Command Center kunne ikke åpnes</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Aipify fant ikke innholdet, eller det kunne ikke lastes akkurat nå.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={retry}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Prøv igjen
        </button>
        <Link
          href="/app/command-center"
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tilbake til oversikten
        </Link>
        <Link
          href="/app/approvals"
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tilbake til godkjenninger
        </Link>
      </div>
      {error.digest ? (
        <details className="mt-8 w-full text-left text-xs text-slate-400">
          <summary className="cursor-pointer select-none">Teknisk referanse</summary>
          <p className="mt-2 break-all font-mono">ref:{error.digest}</p>
        </details>
      ) : null}
    </div>
  );
}
