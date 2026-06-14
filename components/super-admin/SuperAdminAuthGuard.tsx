"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";

type SuperAdminAuthGuardProps = {
  loadingLabel: string;
  deniedLabel: string;
  supportRedirectLabel: string;
  children: ReactNode;
};

export default function SuperAdminAuthGuard({
  loadingLabel,
  deniedLabel,
  supportRedirectLabel,
  children,
}: SuperAdminAuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState(deniedLabel);

  useEffect(() => {
    const supabase = createClient();

    getPlatformProfile(supabase).then((profile) => {
      if (!profile) {
        router.replace("/login?next=/super");
        return;
      }

      if (profile.role !== "super_admin") {
        setDeniedMessage(supportRedirectLabel);
        setChecking(false);
        return;
      }

      setAuthorized(true);
      setChecking(false);
    });
  }, [router, deniedLabel, supportRedirectLabel]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
          <p className="text-sm font-medium text-zinc-400">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-sm font-medium text-zinc-300">{deniedMessage}</p>
        </div>
      </div>
    );
  }

  return children;
}
