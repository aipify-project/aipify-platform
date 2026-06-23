"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ExecutiveCommandCenterRefreshOptions = {
  silent?: boolean;
};

export type RefreshHandler = (
  options?: ExecutiveCommandCenterRefreshOptions,
) => Promise<boolean>;

export type RefreshOutcome = {
  ok: boolean;
  silent?: boolean;
  errorMessage?: string | null;
};

type ExecutiveCommandCenterRefreshContextValue = {
  refreshing: boolean;
  silentRefreshing: boolean;
  lastUpdatedAt: number | null;
  refreshError: string | null;
  registerRefreshHandler: (handler: RefreshHandler | null) => void;
  refresh: () => Promise<void>;
  reportRefreshOutcome: (outcome: RefreshOutcome) => void;
  setSilentRefreshing: (value: boolean) => void;
};

const ExecutiveCommandCenterRefreshContext =
  createContext<ExecutiveCommandCenterRefreshContextValue | null>(null);

export function ExecutiveCommandCenterRefreshProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<RefreshHandler | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [silentRefreshing, setSilentRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const registerRefreshHandler = useCallback((handler: RefreshHandler | null) => {
    handlerRef.current = handler;
  }, []);

  const reportRefreshOutcome = useCallback((outcome: RefreshOutcome) => {
    if (outcome.ok) {
      setLastUpdatedAt(Date.now());
      setRefreshError(null);
      return;
    }
    if (!outcome.silent) {
      setRefreshError(outcome.errorMessage ?? "failed");
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!handlerRef.current || refreshing || silentRefreshing) return;
    setRefreshing(true);
    setRefreshError(null);
    try {
      const ok = await handlerRef.current({ silent: false });
      if (ok) {
        setLastUpdatedAt(Date.now());
        setRefreshError(null);
      } else {
        setRefreshError("failed");
      }
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, silentRefreshing]);

  const value = useMemo(
    () => ({
      refreshing,
      silentRefreshing,
      lastUpdatedAt,
      refreshError,
      registerRefreshHandler,
      refresh,
      reportRefreshOutcome,
      setSilentRefreshing,
    }),
    [
      refreshing,
      silentRefreshing,
      lastUpdatedAt,
      refreshError,
      registerRefreshHandler,
      refresh,
      reportRefreshOutcome,
    ],
  );

  return (
    <ExecutiveCommandCenterRefreshContext.Provider value={value}>
      {children}
    </ExecutiveCommandCenterRefreshContext.Provider>
  );
}

export function useExecutiveCommandCenterRefresh() {
  const ctx = useContext(ExecutiveCommandCenterRefreshContext);
  if (!ctx) {
    throw new Error("useExecutiveCommandCenterRefresh must be used within ExecutiveCommandCenterRefreshProvider");
  }
  return ctx;
}
