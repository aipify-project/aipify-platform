"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { subscribeOperationalDataRefresh } from "@/lib/command-center/operational-refresh-events";
import {
  allowsOperationsPolling,
  POLL_INTERVAL_COMMAND_CENTER_MS,
  usePollingTask,
} from "@/lib/polling";
import type { RefreshHandler } from "./ExecutiveCommandCenterRefreshContext";

export function useExecutiveCommandCenterLiveRefresh(load: RefreshHandler): void {
  const pathname = usePathname();
  const loadRef = useRef(load);
  const pollingEnabled = allowsOperationsPolling(pathname);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  usePollingTask({
    taskKey: `ecc-live:${pathname}`,
    intervalMs: pollingEnabled ? POLL_INTERVAL_COMMAND_CENTER_MS : 0,
    enabled: pollingEnabled,
    runImmediately: false,
    refreshOnVisible: true,
    execute: async () => loadRef.current({ silent: true }),
  });

  useEffect(() => {
    if (!pollingEnabled) return;

    const onFocus = () => {
      void loadRef.current({ silent: true });
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [pollingEnabled]);

  useEffect(() => {
    if (!pollingEnabled) return;
    return subscribeOperationalDataRefresh(() => {
      void loadRef.current({ silent: true });
    });
  }, [pollingEnabled]);
}
