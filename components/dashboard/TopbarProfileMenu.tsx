"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AipifyWebAppInstallAction } from "@/components/pwa/AipifyWebAppInstallAction";
import { createClient } from "@/lib/supabase/client";
import { clearAllPollingState } from "@/lib/polling";
import { invalidateTwoFactorStatusCache } from "@/lib/auth/two-factor";
import { resolveProfileHeaderDisplay } from "@/lib/app/profile-display";
import { RoleBadge } from "@/components/ui/RoleBadge";
import type { PwaInstallLabels } from "@/lib/pwa/types";

type TopbarProfileMenuProps = {
  profileName: string;
  companyName: string;
  profileRole: string;
  profileRoleKey: string;
  profileLoading?: boolean;
  signOutLabel: string;
  pwaLabels?: PwaInstallLabels;
};

export default function TopbarProfileMenu({
  profileName,
  companyName,
  profileRole,
  profileRoleKey,
  profileLoading = false,
  signOutLabel,
  pwaLabels,
}: TopbarProfileMenuProps) {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const profileInitial = profileName.charAt(0).toUpperCase() || "?";

  useEffect(() => {
    void fetch("/api/organizations")
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as {
          current?: { name?: string } | null;
          organizations?: Array<{ name?: string }>;
        };
        setWorkspaceName(data.current?.name ?? data.organizations?.[0]?.name ?? null);
      })
      .catch(() => undefined);
  }, []);

  const display = resolveProfileHeaderDisplay(
    profileLoading ? "…" : profileName,
    profileLoading ? "…" : companyName,
    profileRoleKey,
    profileLoading ? "…" : profileRole,
    profileLoading ? null : workspaceName
  );

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      clearAllPollingState();
      invalidateTwoFactorStatusCache();
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.assign("/login");
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 pr-2.5 transition hover:border-gray-300 hover:bg-gray-50 sm:pr-3"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white ring-2 ring-violet-100 sm:h-9 sm:w-9">
          {profileLoading ? (
            <span className="h-3 w-3 animate-pulse rounded-full bg-white/70" />
          ) : (
            profileInitial
          )}
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-left text-sm font-semibold text-gray-900">
            {display.primary}
          </p>
          {display.secondary ? (
            <p className="truncate text-left text-xs text-gray-500">{display.secondary}</p>
          ) : null}
          <div className="mt-0.5">
            <RoleBadge roleKey={display.roleKey} label={profileRole} />
          </div>
        </div>
        <svg
          className={`hidden h-4 w-4 shrink-0 text-gray-400 transition sm:block ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          <div className="border-b border-gray-100 px-4 py-3 sm:hidden">
            <p className="truncate text-sm font-semibold text-gray-900">{display.primary}</p>
            {display.secondary ? (
              <p className="truncate text-xs text-gray-500">{display.secondary}</p>
            ) : null}
            <div className="mt-1">
              <RoleBadge roleKey={display.roleKey} label={profileRole} />
            </div>
          </div>
          {pwaLabels ? (
            <div className="border-b border-gray-100 py-1">
              <AipifyWebAppInstallAction labels={pwaLabels} variant="menu" showGuideLink={false} />
            </div>
          ) : null}
          <button
            type="button"
            role="menuitem"
            disabled={signingOut}
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
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
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            {signingOut ? "…" : signOutLabel}
          </button>
        </div>
      )}
    </div>
  );
}
