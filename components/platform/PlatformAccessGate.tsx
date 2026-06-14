"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { twoFactorRedirectPath, type TwoFactorStatus } from "@/lib/auth/two-factor";

const PLATFORM_SESSION_AUDIT_KEY = "aipify-platform-admin-session-audit";

type PlatformAccessGateProps = {
  loadingLabel: string;
  twoFactorRequiredLabel: string;
  children: ReactNode;
};

export default function PlatformAccessGate({
  loadingLabel,
  twoFactorRequiredLabel,
  children,
}: PlatformAccessGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/verify-2fa") || pathname.startsWith("/app/settings/two-factor")) {
      setReady(true);
      return;
    }

    fetch("/api/auth/2fa/status")
      .then(async (res) => {
        if (!res.ok) {
          setReady(true);
          return;
        }

        const status = (await res.json()) as TwoFactorStatus;
        const gate = twoFactorRedirectPath(status, pathname);
        if (gate) {
          router.replace(gate);
          return;
        }

        if (!status.enabled) {
          setBlockedReason(twoFactorRequiredLabel);
          router.replace(
            `/app/settings/two-factor?required=1&next=${encodeURIComponent(pathname)}`
          );
          return;
        }

        if (sessionStorage.getItem(PLATFORM_SESSION_AUDIT_KEY) !== "1") {
          sessionStorage.setItem(PLATFORM_SESSION_AUDIT_KEY, "1");
          void fetch("/api/platform-admin/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action_type: "platform_admin_session_entered" }),
          });
        }

        setReady(true);
      })
      .catch(() => setReady(true));
  }, [pathname, router, twoFactorRequiredLabel]);

  if (blockedReason) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="text-sm font-medium text-slate-600">{blockedReason}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          <p className="text-sm font-medium text-slate-600">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  return children;
}
