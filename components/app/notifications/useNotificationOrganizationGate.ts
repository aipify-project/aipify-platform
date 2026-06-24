"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { resolveAppPortalAccessMessageKey } from "@/lib/app-portal/access-state-messages";
import {
  isNotificationOrganizationReady,
  resolveNotificationOrganizationKey,
  resolveStableNotificationRequestKey,
} from "@/lib/app/notifications/organization-context-gate";
import {
  parseAppOrganizationContext,
  type AppOrganizationContext,
} from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/client";

export { isNotificationOrganizationReady, resolveNotificationOrganizationKey };

export function useNotificationOrganizationGate() {
  const pathname = usePathname();
  const [context, setContext] = useState<AppOrganizationContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const loadedPathRef = useRef<string | null>(null);

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
    if (loadedPathRef.current === pathname) return;
    loadedPathRef.current = pathname;
    void refresh();
  }, [pathname, refresh]);

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

export async function resolveNotificationAuthUserId(): Promise<string | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export function buildStableNotificationRequestKey(
  context: AppOrganizationContext | null,
  userId: string | null,
): string | null {
  return resolveStableNotificationRequestKey(context, userId);
}
