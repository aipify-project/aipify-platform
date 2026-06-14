"use client";

import { useEffect, useRef } from "react";
import {
  getBackoffIntervalMs,
  recordPollingFailure,
  recordPollingSuccess,
} from "./backoff";
import { registerPollingCleanup } from "./registry";
import { isDocumentVisible } from "./visibility-aware-interval";

export type UsePollingTaskOptions = {
  /** Unique key for dedup/backoff. */
  taskKey: string;
  /** Base interval when tab is visible. 0 disables interval polling. */
  intervalMs: number;
  /** Optional slower interval while tab is hidden (critical/badge only). */
  hiddenIntervalMs?: number;
  enabled?: boolean;
  runImmediately?: boolean;
  refreshOnVisible?: boolean;
  execute: () => Promise<boolean>;
};

export function usePollingTask({
  taskKey,
  intervalMs,
  hiddenIntervalMs,
  enabled = true,
  runImmediately = false,
  refreshOnVisible = true,
  execute,
}: UsePollingTaskOptions): void {
  const executeRef = useRef(execute);

  useEffect(() => {
    executeRef.current = execute;
  }, [execute]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let timeoutId: number | null = null;
    let cancelled = false;

    const clearTimer = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const schedule = (delayMs: number) => {
      clearTimer();
      if (delayMs <= 0 || cancelled) {
        return;
      }
      timeoutId = window.setTimeout(() => {
        void run(false);
      }, delayMs);
    };

    const run = async (fromVisibility: boolean) => {
      if (cancelled) return;

      const hidden = typeof document !== "undefined" && document.hidden;
      const allowHidden = hidden && hiddenIntervalMs && hiddenIntervalMs > 0;

      if (hidden && !allowHidden && intervalMs > 0) {
        return;
      }

      let ok = true;
      try {
        ok = await executeRef.current();
      } catch {
        ok = false;
      }

      if (cancelled) return;

      if (ok) {
        recordPollingSuccess(taskKey);
      } else {
        recordPollingFailure(taskKey);
      }

      const base = hidden && allowHidden ? hiddenIntervalMs! : intervalMs;
      if (base <= 0) {
        return;
      }

      const nextDelay = ok
        ? base
        : getBackoffIntervalMs(taskKey, base);

      if (!fromVisibility || isDocumentVisible()) {
        schedule(nextDelay);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearTimer();
        if (hiddenIntervalMs && hiddenIntervalMs > 0) {
          schedule(hiddenIntervalMs);
        }
        return;
      }
      if (refreshOnVisible) {
        void run(true);
      } else if (intervalMs > 0) {
        schedule(intervalMs);
      }
    };

    if (runImmediately) {
      void run(false);
    } else if (intervalMs > 0 && isDocumentVisible()) {
      schedule(intervalMs);
    } else if (hiddenIntervalMs && hiddenIntervalMs > 0 && document.hidden) {
      schedule(hiddenIntervalMs);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    const unregister = registerPollingCleanup(() => {
      cancelled = true;
      clearTimer();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    });

    return () => {
      cancelled = true;
      clearTimer();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      unregister();
    };
  }, [
    enabled,
    execute,
    hiddenIntervalMs,
    intervalMs,
    refreshOnVisible,
    runImmediately,
    taskKey,
  ]);
}
