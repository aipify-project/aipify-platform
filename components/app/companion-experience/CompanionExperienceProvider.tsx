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
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";
import {
  patchCompanionUiSession,
  readCompanionUiSession,
} from "@/lib/app/companion/session-state";

type CompanionExperienceContextValue = {
  open: boolean;
  panelEverOpened: boolean;
  mode: "drawer" | "fullpage";
  labels: CompanionExperienceLabels;
  locale: string;
  openDrawer: () => void;
  openDrawerWithQuery: (query: string) => void;
  drawerQuery: string | null;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  pathname: string;
  organizationKey: string | null;
};

const CompanionExperienceContext = createContext<CompanionExperienceContextValue | null>(null);

type CompanionExperienceProviderProps = {
  labels: CompanionExperienceLabels;
  locale: string;
  children: ReactNode;
};

export function CompanionExperienceProvider({
  labels,
  locale,
  children,
}: CompanionExperienceProviderProps) {
  const pathname = usePathname();
  const profileCtx = useOptionalDashboardProfile();
  const organizationKey = profileCtx?.profile?.company.id ?? null;

  const [open, setOpen] = useState(() => readCompanionUiSession()?.panelOpen ?? false);
  const [drawerQuery, setDrawerQuery] = useState<string | null>(null);
  const [panelEverOpened, setPanelEverOpened] = useState(
    () => readCompanionUiSession()?.panelOpen ?? false,
  );

  useEffect(() => {
    if (open) {
      setPanelEverOpened(true);
    }
    patchCompanionUiSession(
      {
        panelOpen: open,
        organizationKey,
        pathname,
      },
      organizationKey,
    );
  }, [open, organizationKey, pathname]);

  const openDrawer = useCallback(() => {
    setDrawerQuery(null);
    setOpen(true);
    setPanelEverOpened(true);
  }, []);

  const openDrawerWithQuery = useCallback((query: string) => {
    setDrawerQuery(query.trim());
    setOpen(true);
    setPanelEverOpened(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setDrawerQuery(null);
  }, []);

  const toggleDrawer = useCallback(() => {
    setOpen((value) => {
      const next = !value;
      if (next) {
        setPanelEverOpened(true);
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      open,
      mode: "drawer" as const,
      labels,
      locale,
      openDrawer,
      openDrawerWithQuery,
      drawerQuery,
      closeDrawer,
      toggleDrawer,
      pathname,
      organizationKey,
      panelEverOpened,
    }),
    [
      open,
      labels,
      locale,
      openDrawer,
      openDrawerWithQuery,
      drawerQuery,
      closeDrawer,
      toggleDrawer,
      pathname,
      organizationKey,
      panelEverOpened,
    ],
  );

  return (
    <CompanionExperienceContext.Provider value={value}>
      {children}
    </CompanionExperienceContext.Provider>
  );
}

export function useCompanionExperience(): CompanionExperienceContextValue {
  const ctx = useContext(CompanionExperienceContext);
  if (!ctx) {
    throw new Error("useCompanionExperience must be used within CompanionExperienceProvider");
  }
  return ctx;
}

export function useOptionalCompanionExperience(): CompanionExperienceContextValue | null {
  return useContext(CompanionExperienceContext);
}

/** Whether the drawer panel should stay mounted to preserve in-memory conversation state. */
export function useCompanionPanelKeepMounted(): boolean {
  const ctx = useOptionalCompanionExperience();
  if (!ctx) return false;
  return ctx.open || ctx.panelEverOpened;
}
