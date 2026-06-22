"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";

type CompanionExperienceContextValue = {
  open: boolean;
  mode: "drawer" | "fullpage";
  labels: CompanionExperienceLabels;
  locale: string;
  openDrawer: () => void;
  openDrawerWithQuery: (query: string) => void;
  drawerQuery: string | null;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  pathname: string;
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
  const [open, setOpen] = useState(false);
  const [drawerQuery, setDrawerQuery] = useState<string | null>(null);

  const openDrawer = useCallback(() => {
    setDrawerQuery(null);
    setOpen(true);
  }, []);
  const openDrawerWithQuery = useCallback((query: string) => {
    setDrawerQuery(query.trim());
    setOpen(true);
  }, []);
  const closeDrawer = useCallback(() => {
    setOpen(false);
    setDrawerQuery(null);
  }, []);
  const toggleDrawer = useCallback(() => setOpen((v) => !v), []);

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
    }),
    [open, labels, locale, openDrawer, openDrawerWithQuery, drawerQuery, closeDrawer, toggleDrawer, pathname]
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
