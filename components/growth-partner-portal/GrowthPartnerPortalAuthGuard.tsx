"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AipifySystemNotice } from "@/components/ui/aipify-system-notice";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";

type Props = {
  loadingLabel: string;
  children: ReactNode;
};

export default function GrowthPartnerPortalAuthGuard({ loadingLabel, children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-aipify-canvas">
        <AipifyLoader centered />
        <span className="sr-only">{loadingLabel}</span>
      </div>
    );
  }

  if (!authorized) {
    return <AipifySystemNotice status="growth_partner_required" />;
  }

  return <>{children}</>;
}
