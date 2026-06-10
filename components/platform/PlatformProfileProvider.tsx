"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import type { PlatformAdmin, PlatformRole } from "@/lib/tenant/types";

type PlatformProfileContextValue = {
  platformAdmin: PlatformAdmin | null;
  displayName: string;
  loading: boolean;
};

const PlatformProfileContext =
  createContext<PlatformProfileContextValue | null>(null);

export function PlatformProfileProvider({ children }: { children: ReactNode }) {
  const [platformAdmin, setPlatformAdmin] = useState<PlatformAdmin | null>(null);
  const [displayName, setDisplayName] = useState("Platform Admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [adminProfile, userProfile] = await Promise.all([
        getPlatformProfile(supabase),
        getDashboardProfile(supabase),
      ]);

      if (!cancelled) {
        setPlatformAdmin(adminProfile);
        setDisplayName(userProfile?.user.full_name ?? "Platform Admin");
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ platformAdmin, displayName, loading }),
    [platformAdmin, displayName, loading]
  );

  return (
    <PlatformProfileContext.Provider value={value}>
      {children}
    </PlatformProfileContext.Provider>
  );
}

export function usePlatformProfile() {
  return useContext(PlatformProfileContext);
}

export function platformRoleLabel(
  role: PlatformRole,
  labels: Record<PlatformRole, string>
) {
  return labels[role];
}
