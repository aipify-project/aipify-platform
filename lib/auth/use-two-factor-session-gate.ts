"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  fetchTwoFactorStatusCached,
  invalidateTwoFactorStatusCache,
  twoFactorRedirectPath,
  type TwoFactorStatus,
} from "@/lib/auth/two-factor";
import {
  clearPortalSessionMarks,
  hasTwoFactorPassed,
  markTwoFactorPassed,
} from "@/lib/auth/portal-session-bridge";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";

export type TwoFactorGateOptions = {
  /** Redirect to 2FA settings when 2FA is not enabled (platform/super). */
  requireEnabled?: boolean;
  onRequireEnabled?: (pathname: string) => void;
  /** Extra validation after session gate passes. */
  validateStatus?: (status: TwoFactorStatus) => boolean;
  onBlocked?: (reason: "require_enabled" | "validation_failed") => void;
};

function isTwoFactorExemptPath(pathname: string): boolean {
  return (
    pathname.startsWith("/verify-2fa") ||
    pathname.startsWith("/app/settings/two-factor")
  );
}

/**
 * Runs 2FA gate once per layout mount — not on every client-side navigation.
 * Re-checks after sign-in, sign-out, or token refresh.
 */
export function useTwoFactorSessionGate(options: TwoFactorGateOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const passedRef = useRef(false);
  const optionsRef = useRef(options);
  const [ready, setReady] = useState(() => hasTwoFactorPassed());
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  pathnameRef.current = pathname;
  optionsRef.current = options;

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    let cancelled = false;

    async function evaluate() {
      const currentPath = pathnameRef.current;
      const opts = optionsRef.current;

      if (isTwoFactorExemptPath(currentPath)) {
        passedRef.current = true;
        markTwoFactorPassed();
        setReady(true);
        return;
      }

      if (passedRef.current || hasTwoFactorPassed()) {
        passedRef.current = true;
        setReady(true);
        return;
      }

      try {
        const status = await fetchTwoFactorStatusCached();
        if (cancelled) return;

        if (!status) {
          passedRef.current = true;
          markTwoFactorPassed();
          setReady(true);
          return;
        }

        const gate = twoFactorRedirectPath(status, currentPath);
        if (gate) {
          router.replace(gate);
          return;
        }

        if (opts.requireEnabled && !status.enabled) {
          opts.onRequireEnabled?.(currentPath);
          opts.onBlocked?.("require_enabled");
          setBlockedReason("require_enabled");
          return;
        }

        if (opts.validateStatus && !opts.validateStatus(status)) {
          opts.onBlocked?.("validation_failed");
          setBlockedReason("validation_failed");
          return;
        }

        passedRef.current = true;
        markTwoFactorPassed();
        setReady(true);
      } catch {
        if (!cancelled) {
          passedRef.current = true;
          markTwoFactorPassed();
          setReady(true);
        }
      }
    }

    void evaluate();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "SIGNED_OUT") {
        passedRef.current = false;
        clearPortalSessionMarks();
        setReady(false);
        setBlockedReason(null);
        invalidateTwoFactorStatusCache();
        void evaluate();
        return;
      }

      if (event === "SIGNED_IN") {
        passedRef.current = false;
        clearPortalSessionMarks();
        setReady(false);
        setBlockedReason(null);
        invalidateTwoFactorStatusCache();
        void evaluate();
        return;
      }

      if (event === "TOKEN_REFRESHED") {
        invalidateTwoFactorStatusCache();
        if (!passedRef.current && !hasTwoFactorPassed()) {
          void evaluate();
        }
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [router]);

  return { ready, blockedReason, pathname };
}
