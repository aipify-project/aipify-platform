"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type RefreshHandler = () => Promise<void>;

type ExecutiveCommandCenterRefreshContextValue = {
  refreshing: boolean;
  registerRefreshHandler: (handler: RefreshHandler | null) => void;
  refresh: () => Promise<void>;
};

const ExecutiveCommandCenterRefreshContext =
  createContext<ExecutiveCommandCenterRefreshContextValue | null>(null);

export function ExecutiveCommandCenterRefreshProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<RefreshHandler | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const registerRefreshHandler = useCallback((handler: RefreshHandler | null) => {
    handlerRef.current = handler;
  }, []);

  const refresh = useCallback(async () => {
    if (!handlerRef.current || refreshing) return;
    setRefreshing(true);
    try {
      await handlerRef.current();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  const value = useMemo(
    () => ({ refreshing, registerRefreshHandler, refresh }),
    [refreshing, registerRefreshHandler, refresh]
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
