"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";

type PlatformAuthGuardProps = {
  loadingLabel: string;
  deniedLabel: string;
  children: ReactNode;
};

export default function PlatformAuthGuard({
  loadingLabel,
  deniedLabel,
  children,
}: PlatformAuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    getPlatformProfile(supabase).then((profile) => {
      if (!profile) {
        router.replace("/app");
      } else {
        setAuthorized(true);
      }
      setChecking(false);
    });
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          <p className="text-sm font-medium text-slate-600">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="text-sm font-medium text-slate-600">{deniedLabel}</p>
      </div>
    );
  }

  return children;
}
