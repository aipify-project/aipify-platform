"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { twoFactorRedirectPath, type TwoFactorStatus } from "@/lib/auth/two-factor";

type SuperAdminAccessGateProps = {
  loadingLabel: string;
  recoveryRequiredLabel: string;
  children: ReactNode;
};

export default function SuperAdminAccessGate({
  loadingLabel,
  recoveryRequiredLabel,
  children,
}: SuperAdminAccessGateProps) {
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

        if (!status.enabled || (status.recovery_codes_remaining ?? 0) < 1) {
          setBlockedReason(recoveryRequiredLabel);
          router.replace(
            `/app/settings/two-factor?required=1&next=${encodeURIComponent(pathname)}`
          );
          return;
        }

        setReady(true);
      })
      .catch(() => setReady(true));
  }, [pathname, recoveryRequiredLabel, router]);

  if (blockedReason) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <p className="text-sm font-medium text-zinc-400">{blockedReason}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
          <p className="text-sm font-medium text-zinc-400">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  return children;
}
