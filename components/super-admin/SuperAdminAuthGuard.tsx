"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";
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
    const supabase = getBrowserSupabaseClient();
    let mounted = true;

    async function verifyAccess() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error || !user) {
        router.replace("/login?next=/super");
        return;
      }

      const profile = await getPlatformProfile(supabase);
      if (!mounted) return;

      if (!profile) {
        setDeniedMessage(supportRedirectLabel);
        setChecking(false);
        return;
      }

      if (profile.role !== "super_admin") {
        setDeniedMessage(supportRedirectLabel);
        setChecking(false);
        return;
      }

      setAuthorized(true);
      setChecking(false);
    }

    void verifyAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "SIGNED_OUT") {
        router.replace("/login?next=/super");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, deniedLabel, supportRedirectLabel]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-gray-600">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-700">{deniedMessage}</p>
        </div>
      </div>
    );
  }

  return children;
}
