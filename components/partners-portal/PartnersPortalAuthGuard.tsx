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

/** Throttle silent access rechecks after the layout already authorized the session. */
const SILENT_ACCESS_MIN_MS = 90_000;

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
    let lastSilentAt = 0;

    async function verifyAccess(opts?: { silent?: boolean; force?: boolean }) {
      const silent = opts?.silent === true;
      const force = opts?.force === true;
      if (silent && !force && Date.now() - lastSilentAt < SILENT_ACCESS_MIN_MS) return;
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

      if (silent) lastSilentAt = Date.now();

      if (!data?.has_access) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      setAuthorized(true);
      setChecking(false);
    }

    // Server already gated — show shell immediately; skip mount recheck until idle/focus.
    if (serverAuthorized) {
      lastSilentAt = Date.now();
    } else {
      void verifyAccess({ silent: false });
    }

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void verifyAccess({ silent: true });
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      // Token refresh must not flash a full-screen loader during menu navigation.
      if (event === "INITIAL_SESSION") return;
      if (event === "TOKEN_REFRESHED") {
        void verifyAccess({ silent: true });
        return;
      }
      lastSilentAt = 0;
      void verifyAccess({ silent: false, force: true });
    });

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", onVisible);
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
