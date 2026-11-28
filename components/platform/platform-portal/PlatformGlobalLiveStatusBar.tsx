"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePollingTask } from "@/lib/polling/use-polling-task";
import {
  PLATFORM_TRAFFIC_STATUS_API_PATH,
  PLATFORM_TRAFFIC_STATUS_FETCH_TIMEOUT_MS,
  PLATFORM_TRAFFIC_STATUS_POLL_MS,
  parsePlatformTrafficStatus,
  trafficStatusFreshness,
  type TrafficStatusFreshness,
} from "@/lib/platform-portal/traffic-status-contract";
import type { PlatformTrafficStatus } from "@/lib/platform-portal/traffic-status";
import type { PlatformTrafficStatusLabels } from "@/lib/platform-portal/traffic-status-labels";
import { PlatformTrafficStatusBar } from "./PlatformTrafficStatusBar";

type PlatformGlobalLiveStatusBarProps = {
  labels: PlatformTrafficStatusLabels;
  locale: string;
};

/**
 * Single persistent Platform Admin status bar.
 * One poller for the shell — not per page or per indicator.
 */
export function PlatformGlobalLiveStatusBar({
  labels,
  locale,
}: PlatformGlobalLiveStatusBarProps) {
  const [status, setStatus] = useState<PlatformTrafficStatus | null>(null);
  const [freshness, setFreshness] = useState<TrafficStatusFreshness>("unavailable");
  const [expanded, setExpanded] = useState(false);
  const lastSuccessAtMs = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  const execute = useCallback(async (): Promise<boolean> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, PLATFORM_TRAFFIC_STATUS_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(PLATFORM_TRAFFIC_STATUS_API_PATH, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!mountedRef.current) return false;

      if (response.status === 401 || response.status === 403) {
        setFreshness("unavailable");
        return false;
      }
      if (!response.ok) {
        setFreshness(trafficStatusFreshness(lastSuccessAtMs.current));
        return false;
      }

      const payload: unknown = await response.json();
      if (!mountedRef.current) return false;

      const parsed = parsePlatformTrafficStatus(payload);
      if (!parsed) {
        setFreshness(trafficStatusFreshness(lastSuccessAtMs.current));
        return false;
      }

      lastSuccessAtMs.current = Date.now();
      setStatus(parsed);
      setFreshness("fresh");
      return true;
    } catch {
      if (mountedRef.current) {
        setFreshness(trafficStatusFreshness(lastSuccessAtMs.current));
      }
      return false;
    } finally {
      window.clearTimeout(timeoutId);
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, []);

  usePollingTask({
    taskKey: "platform-admin-global-live-status-bar",
    intervalMs: PLATFORM_TRAFFIC_STATUS_POLL_MS,
    enabled: true,
    runImmediately: true,
    refreshOnVisible: true,
    execute,
  });

  return (
    <PlatformTrafficStatusBar
      status={status}
      labels={labels}
      locale={locale}
      freshness={freshness}
      expanded={expanded}
      onToggleExpanded={() => setExpanded((current) => !current)}
    />
  );
}
