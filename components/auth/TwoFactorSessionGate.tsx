"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { twoFactorRedirectPath, type TwoFactorStatus } from "@/lib/auth/two-factor";
import { createClient } from "@/lib/supabase/client";

export function useTwoFactorSessionGate() {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

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
        setReady(true);
      })
      .catch(() => setReady(true));
  }, [pathname, router]);

  return ready;
}

type TwoFactorSessionGateProps = {
  loadingLabel: string;
  children: ReactNode;
};

export default function TwoFactorSessionGate({
  loadingLabel,
  children,
}: TwoFactorSessionGateProps) {
  const ready = useTwoFactorSessionGate();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          <p className="text-sm font-medium text-gray-500">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  return children;
}
