"use client";

import Link from "next/link";
import { useEffect } from "react";

type ApprovalsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Localized Approval Center error boundary — never fall through to the English global-error page.
 * Copy is Norwegian-first enterprise language (task surface for Svein); English keys remain in i18n for other locales via page labels when available.
 */
export default function ApprovalsError({ error, reset }: ApprovalsErrorProps) {
  useEffect(() => {
    console.error("[approvals/error]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Godkjenningen kunne ikke åpnes</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Vi fant ikke godkjenningen, eller du har ikke tilgang til den.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Prøv igjen
        </button>
        <Link
          href="/app/approvals"
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tilbake til godkjenninger
        </Link>
        <Link
          href="/app/kompis"
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tilbake til Kompis
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
