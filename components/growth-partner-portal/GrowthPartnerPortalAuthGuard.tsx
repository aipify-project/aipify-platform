"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";

type Props = {
  loadingLabel: string;
  deniedLabel: string;
  children: ReactNode;
};

export default function GrowthPartnerPortalAuthGuard({ loadingLabel, deniedLabel, children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    let mounted = true;

    async function verifyAccess() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!mounted) return;

      if (error || !user) {
        router.replace("/login?next=/growth-partner/dashboard");
        return;
      }

      const res = await fetch("/api/growth-partner-portal/card");
      const data = (await res.json()) as { has_access?: boolean };
      if (!mounted) return;

      if (!data.has_access) {
        setChecking(false);
        return;
      }

      setAuthorized(true);
      setChecking(false);
    }

    void verifyAccess();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void verifyAccess();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">{loadingLabel}</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">{deniedLabel}</h1>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
