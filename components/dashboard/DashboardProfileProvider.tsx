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
import { createClient } from "@/lib/supabase/client";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import type { DashboardProfile } from "@/lib/tenant/types";

type DashboardProfileContextValue = {
  profile: DashboardProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const DashboardProfileContext =
  createContext<DashboardProfileContextValue | null>(null);

type DashboardProfileProviderProps = {
  children: ReactNode;
};

export function DashboardProfileProvider({
  children,
}: DashboardProfileProviderProps) {
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const nextProfile = await getDashboardProfile(supabase);
    setProfile(nextProfile);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const supabase = createClient();
      const nextProfile = await getDashboardProfile(supabase);

      if (!cancelled) {
        setProfile(nextProfile);
        setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ profile, loading, refresh }),
    [profile, loading, refresh]
  );

  return (
    <DashboardProfileContext.Provider value={value}>
      {children}
    </DashboardProfileContext.Provider>
  );
}

export function useDashboardProfile() {
  const context = useContext(DashboardProfileContext);

  if (!context) {
    throw new Error(
      "useDashboardProfile must be used within DashboardProfileProvider"
    );
  }

  return context;
}

export function useOptionalDashboardProfile() {
  return useContext(DashboardProfileContext);
}
