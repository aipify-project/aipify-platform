"use client";

import { useEffect, useRef } from "react";

type UseVisibilityAwareIntervalOptions = {
  enabled?: boolean;
  runImmediately?: boolean;
  refreshOnVisible?: boolean;
};

export function useVisibilityAwareInterval(
  callback: () => void | Promise<void>,
  intervalMs: number,
  {
    enabled = true,
    runImmediately = false,
    refreshOnVisible = true,
  }: UseVisibilityAwareIntervalOptions = {}
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || intervalMs <= 0) {
      return;
    }

    let intervalId: number | null = null;

    const run = () => {
      void callbackRef.current();
    };

    const stop = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    const start = () => {
      stop();
      if (document.hidden) {
        return;
      }
      intervalId = window.setInterval(run, intervalMs);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
        return;
      }
      if (refreshOnVisible) {
        run();
      }
      start();
    };

    if (runImmediately) {
      run();
    }

    start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, intervalMs, runImmediately, refreshOnVisible]);
}

export function isDocumentVisible(): boolean {
  if (typeof document === "undefined") {
    return true;
  }
  return !document.hidden;
}
