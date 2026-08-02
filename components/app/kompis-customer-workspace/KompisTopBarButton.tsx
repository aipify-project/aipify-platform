"use client";

import { useKompisGlobal } from "./KompisGlobalProvider";

export function KompisTopBarButton() {
  const { open, toggleKompis, labels } = useKompisGlobal();

  return (
    <button
      type="button"
      onClick={toggleKompis}
      title={labels.available}
      aria-label={open ? labels.ariaClose : labels.ariaOpen}
      aria-pressed={open}
      data-kompis-topbar="true"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-aipify-border bg-white px-2 text-violet-700 transition hover:border-violet-200 hover:bg-violet-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:bg-slate-900 dark:text-violet-200"
    >
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white"
        aria-hidden
      >
        K
      </span>
      <span className="hidden text-xs font-medium lg:inline">{labels.openButton}</span>
    </button>
  );
}
