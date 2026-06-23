"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import {
  clearPortalSessionMarks,
  hasPortalSessionActive,
  markPortalSessionActive,
} from "@/lib/auth/portal-session-bridge";
import { probePortalSession } from "@/lib/auth/portal-session-probe";
import { clearCompanionUiSession } from "@/lib/app/companion/session-state";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";

type UsePortalAuthGuardOptions = {
  loginPath?: string;
  nextPath?: string;
};

type UsePortalAuthGuardResult = {
  checking: boolean;
  authenticated: boolean;
};

const SIGN_OUT_EVENTS = new Set<string>(["SIGNED_OUT"]);

/**
 * Client portal auth guard — redirects only after a server session probe fails or on explicit sign-out.
 * Never calls client refreshSession; middleware/proxy owns token refresh to avoid rotation races.
 */
export function usePortalAuthGuard(
  options: UsePortalAuthGuardOptions = {}
): UsePortalAuthGuardResult {
  const router = useRouter();
  const loginPath = options.loginPath ?? "/login";
  const nextPath = options.nextPath ?? "/app/command-center";
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    let mounted = true;

    if (hasPortalSessionActive()) {
      setAuthenticated(true);
      setChecking(false);
    }

    const redirectToLogin = () => {
      const params = new URLSearchParams();
      if (nextPath.startsWith("/")) {
        params.set("next", nextPath);
      }
      const query = params.toString();
      router.replace(query ? `${loginPath}?${query}` : loginPath);
    };

    const applyProbe = (probe: Awaited<ReturnType<typeof probePortalSession>>) => {
      if (probe.status === "authenticated") {
        markPortalSessionActive();
        setAuthenticated(true);
        setChecking(false);
        return;
      }

      if (probe.status === "transient") {
        setChecking(false);
        return;
      }

      clearPortalSessionMarks();
      clearCompanionUiSession();
      setAuthenticated(false);
      setChecking(false);
      redirectToLogin();
    };

    async function verifySession() {
      const probe = await probePortalSession();
      if (!mounted) return;
      applyProbe(probe);
    }

    void verifySession();

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      void probePortalSession().then((probe) => {
        if (!mounted) return;
        if (probe.status === "authenticated") {
          markPortalSessionActive();
          setAuthenticated(true);
          setChecking(false);
        }
      });
    };
    document.addEventListener("visibilitychange", onVisible);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;

      if (SIGN_OUT_EVENTS.has(event)) {
        void probePortalSession().then((probe) => {
          if (!mounted) return;
          if (probe.status === "authenticated") {
            markPortalSessionActive();
            setAuthenticated(true);
            setChecking(false);
            return;
          }
          if (probe.status === "transient") return;
          clearPortalSessionMarks();
          clearCompanionUiSession();
          setAuthenticated(false);
          redirectToLogin();
        });
        return;
      }

      if (
        session &&
        (event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "INITIAL_SESSION" ||
          event === "USER_UPDATED")
      ) {
        markPortalSessionActive();
        setAuthenticated(true);
        setChecking(false);
      }
    });

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", onVisible);
      subscription.unsubscribe();
    };
  }, [loginPath, nextPath, router]);

  return { checking, authenticated };
}
