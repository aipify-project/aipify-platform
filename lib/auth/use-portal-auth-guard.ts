"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import {
  clearPortalSessionMarks,
  hasPortalSessionActive,
  markPortalSessionActive,
} from "@/lib/auth/portal-session-bridge";
import { resolvePortalSessionResolution } from "@/lib/auth/session-diagnostics";
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
 * Client portal auth guard — redirects only after refresh is attempted or on explicit sign-out.
 * Avoids spurious /login redirects while Supabase access tokens expire and middleware refreshes.
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

    async function verifySession() {
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      let refreshUser = null;
      let refreshErrorMessage: string | null = null;

      if (!user) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        refreshUser = refreshData.user ?? refreshData.session?.user ?? null;
        refreshErrorMessage = refreshError?.message ?? null;
      }

      if (!mounted) return;

      const resolution = resolvePortalSessionResolution({
        user,
        refreshUser,
        getUserErrorMessage: getUserError?.message ?? null,
        refreshErrorMessage,
      });

      if (resolution.status === "authenticated") {
        markPortalSessionActive();
        setAuthenticated(true);
        setChecking(false);
        return;
      }

      if (resolution.status === "transient") {
        setChecking(false);
        return;
      }

      clearPortalSessionMarks();
      clearCompanionUiSession();
      setAuthenticated(false);
      setChecking(false);
      redirectToLogin();
    }

    void verifySession();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void supabase.auth.refreshSession();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;

      if (SIGN_OUT_EVENTS.has(event)) {
        clearPortalSessionMarks();
        clearCompanionUiSession();
        setAuthenticated(false);
        redirectToLogin();
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
