"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { resolveAppPortalAccessMessageKey } from "@/lib/app-portal/access-state-messages";
import {
  isNotificationOrganizationReady,
  resolveNotificationOrganizationKey,
} from "@/lib/app/notifications/organization-context-gate";
import {
  parseAppOrganizationContext,
  type AppOrganizationContext,
} from "@/lib/tenant/resolve-app-organization-context";

export { isNotificationOrganizationReady, resolveNotificationOrganizationKey };

const ORG_RETRY_MS = 900;
const ORG_MAX_RETRIES = 8;

export function useNotificationOrganizationGate() {
  const pathname = usePathname();
  const [context, setContext] = useState<AppOrganizationContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const retryTimerRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const refresh = useCallback(async (): Promise<AppOrganizationContext | null> => {
    setLoading(true);
    setFetchFailed(false);
    try {
      const res = await fetch("/api/app/organization-context", { cache: "no-store" });
      if (!res.ok) {
        setFetchFailed(true);
        setContext(null);
        return null;
      }
      const parsed = parseAppOrganizationContext(await res.json());
      setContext(parsed);
      if (isNotificationOrganizationReady(parsed)) {
        retryCountRef.current = 0;
      }
      return parsed;
    } catch {
      setFetchFailed(true);
      setContext(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    retryCountRef.current = 0;
    clearRetryTimer();
    void refresh();
  }, [pathname, refresh, clearRetryTimer]);

  useEffect(() => {
    clearRetryTimer();

    if (loading || fetchFailed || isNotificationOrganizationReady(context)) {
      return;
    }

    if (retryCountRef.current >= ORG_MAX_RETRIES) {
      return;
    }

    retryTimerRef.current = window.setTimeout(() => {
      retryCountRef.current += 1;
      void refresh();
    }, ORG_RETRY_MS);

    return clearRetryTimer;
  }, [clearRetryTimer, context, fetchFailed, loading, refresh]);

  useEffect(() => {
    function handleFocus() {
      if (!isNotificationOrganizationReady(context)) {
        retryCountRef.current = 0;
        void refresh();
      }
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [context, refresh]);

  const organizationKey = context ? resolveNotificationOrganizationKey(context) : null;
  const isReady = isNotificationOrganizationReady(context);
  const organizationName = context?.workspace_name ?? context?.licensed_to ?? null;
  const accessMessageKey = fetchFailed
    ? "pageLoadError"
    : resolveAppPortalAccessMessageKey(context?.state ?? "organization_missing");

  return {
    context,
    loading,
    fetchFailed,
    isReady,
    organizationKey,
    organizationName,
    accessMessageKey,
    refresh,
  };
}
