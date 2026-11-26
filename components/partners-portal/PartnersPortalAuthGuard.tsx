"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AipifySystemNotice } from "@/components/ui/aipify-system-notice";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";

type PartnersPortalAuthGuardProps = {
  loadingLabel: string;
  /**
   * When the partners layout already resolved access server-side, skip the
   * full-screen blocking loader and render immediately. Background recheck
   * still enforces suspension / logout without delaying menu navigation.
   */
  serverAuthorized?: boolean;
  children: ReactNode;
};

export function PartnersPortalAuthGuard({
  loadingLabel,
  serverAuthorized = false,
  children,
}: PartnersPortalAuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(!serverAuthorized);
  const [authorized, setAuthorized] = useState(serverAuthorized);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    let mounted = true;

    async function verifyAccess(opts?: { silent?: boolean }) {
      const silent = opts?.silent === true;
      if (!silent && !serverAuthorized) setChecking(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!mounted) return;

      if (error || !user) {
        router.replace("/login?portal=partner&next=/partners");
        return;
      }

      const res = await fetch("/api/partners-portal/access", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as { has_access?: boolean } | null;
      if (!mounted) return;

      if (!data?.has_access) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      setAuthorized(true);
      setChecking(false);
    }

    // Server already gated — show shell immediately; recheck without blocking UI.
    void verifyAccess({ silent: serverAuthorized });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      // Token refresh must not flash a full-screen loader during menu navigation.
      if (event === "INITIAL_SESSION") return;
      if (event === "TOKEN_REFRESHED") {
        void verifyAccess({ silent: true });
        return;
      }
      void verifyAccess({ silent: false });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router, serverAuthorized]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-aipify-canvas">
        <AipifyLoader centered />
        <span className="sr-only">{loadingLabel}</span>
      </div>
    );
  }

  if (!authorized) {
    // Certified Sales Partner portal — never push Growth Partner signup CTAs here.
    return <AipifySystemNotice status="csp_partner_required" />;
  }

  return <>{children}</>;
}
