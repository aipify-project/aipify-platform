"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  POLL_INTERVAL_SUPER_ADMIN_HEALTH_MS,
  allowsSuperAdminHealthPolling,
  dedupeFetch,
  usePollingTask,
} from "@/lib/polling";
import type { SuperAdminControlCenter } from "@/lib/super-admin/types";

type SuperAdminOperationsContextValue = {
  center: SuperAdminControlCenter | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<boolean>;
};

const SuperAdminOperationsContext = createContext<SuperAdminOperationsContextValue | null>(null);

export default function SuperAdminOperationsProvider({
  loadErrorLabel,
  children,
}: {
  loadErrorLabel: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [center, setCenter] = useState<SuperAdminControlCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const ok = await dedupeFetch("super-admin-control-center", async () => {
        const res = await fetch("/api/super-admin/control-center");
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          if (body.error) {
            console.error("[SuperAdmin] control center load failed:", body.error);
          }
          throw new Error(loadErrorLabel);
        }
        const data = (await res.json()) as SuperAdminControlCenter;
        setCenter(data);
        setError(null);
        return true;
      });
      return ok;
    } catch (err) {
      if (err instanceof Error && err.message !== loadErrorLabel) {
        console.error("[SuperAdmin] control center error:", err.message);
      }
      setError(loadErrorLabel);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadErrorLabel]);

  useEffect(() => {
    void load();
  }, [load]);

  const pollingEnabled = allowsSuperAdminHealthPolling(pathname);

  usePollingTask({
    taskKey: "super-admin-control-center",
    intervalMs: pollingEnabled ? POLL_INTERVAL_SUPER_ADMIN_HEALTH_MS : 0,
    enabled: pollingEnabled,
    runImmediately: false,
    refreshOnVisible: true,
    execute: load,
  });

  const value = useMemo(
    () => ({ center, loading, error, refresh: load }),
    [center, loading, error, load]
  );

  return (
    <SuperAdminOperationsContext.Provider value={value}>
      {children}
    </SuperAdminOperationsContext.Provider>
  );
}

export function useSuperAdminOperations() {
  const ctx = useContext(SuperAdminOperationsContext);
  if (!ctx) {
    throw new Error("useSuperAdminOperations must be used within SuperAdminOperationsProvider");
  }
  return ctx;
}
