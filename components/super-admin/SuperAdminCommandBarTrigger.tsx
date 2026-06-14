"use client";

import { useOptionalCommandBar } from "@/components/command-bar";

type SuperAdminCommandBarTriggerProps = {
  placeholder: string;
  openLabel: string;
};

export default function SuperAdminCommandBarTrigger({
  placeholder,
  openLabel,
}: SuperAdminCommandBarTriggerProps) {
  const commandBar = useOptionalCommandBar();
  if (!commandBar) return null;

  return (
    <div className="relative hidden min-w-0 flex-1 max-w-md lg:block">
      <button
        type="button"
        onClick={commandBar.open}
        aria-label={openLabel}
        className="flex w-full items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-3 text-left text-sm text-zinc-400 transition hover:border-zinc-300 hover:bg-white focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200"
      >
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <span className="truncate">{placeholder}</span>
        <span className="ml-auto shrink-0 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
          ⌘K
        </span>
      </button>
    </div>
  );
}
