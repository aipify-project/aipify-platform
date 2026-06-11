"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OrganizationSummary } from "@/lib/aipify/multi-tenant-architecture";

type OrganizationSwitcherProps = {
  label: string;
  fallbackName: string;
  switchingLabel: string;
};

export function OrganizationSwitcher({
  label,
  fallbackName,
  switchingLabel,
}: OrganizationSwitcherProps) {
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizations");
    if (res.ok) {
      const data = (await res.json()) as {
        organizations: OrganizationSummary[];
        current: OrganizationSummary | null;
      };
      setOrganizations(data.organizations ?? []);
      setCurrentId(data.current?.id ?? data.organizations[0]?.id ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = organizations.find((o) => o.id === currentId);
  const displayName = current?.name ?? fallbackName;
  const showSwitcher = organizations.length > 1;

  async function handleSwitch(orgId: string) {
    if (orgId === currentId) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    const res = await fetch("/api/organizations/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organization_id: orgId }),
    });
    if (res.ok) {
      setCurrentId(orgId);
      setOpen(false);
      window.location.reload();
    }
    setSwitching(false);
  }

  if (loading) {
    return (
      <span className="hidden max-w-[10rem] truncate text-sm text-gray-500 md:inline">
        {fallbackName}
      </span>
    );
  }

  if (!showSwitcher) {
    return (
      <span className="hidden max-w-[10rem] truncate text-sm font-medium text-gray-700 md:inline">
        {displayName}
      </span>
    );
  }

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={switching}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60"
        aria-label={label}
        aria-expanded={open}
      >
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
          />
        </svg>
        <span className="max-w-[8rem] truncate">{switching ? switchingLabel : displayName}</span>
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open ? (
        <ul
          className="absolute right-0 z-30 mt-2 min-w-[12rem] rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {organizations.map((org) => (
            <li key={org.id}>
              <button
                type="button"
                role="option"
                aria-selected={org.id === currentId}
                onClick={() => void handleSwitch(org.id)}
                className={`flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  org.id === currentId ? "bg-violet-50 text-violet-900" : "text-gray-700"
                }`}
              >
                <span className="font-medium">{org.name}</span>
                <span className="text-xs capitalize text-gray-500">
                  {org.role.replace(/_/g, " ")} · {org.subscription_plan}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
