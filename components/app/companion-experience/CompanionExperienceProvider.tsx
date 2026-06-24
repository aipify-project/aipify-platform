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
  readCompanionPanelOpenState,
  readCompanionUiSession,
} from "@/lib/app/companion/session-state";
import {
  logCompanionFocusSnapshot,
  traceCompanionMount,
} from "@/lib/app/companion/companion-mount-trace";

type CompanionExperienceContextValue = {
  open: boolean;
  panelEverOpened: boolean;
  mode: "drawer" | "fullpage";
  labels: CompanionExperienceLabels;
  locale: string;
  openDrawer: () => void;
  openDrawerWithQuery: (query: string) => void;
  openDrawerWithConversation: (conversationId: string) => void;
  drawerQuery: string | null;
  drawerConversationId: string | null;
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

  const [open, setOpen] = useState(() => readCompanionPanelOpenState());
  const [drawerQuery, setDrawerQuery] = useState<string | null>(null);
  const [drawerConversationId, setDrawerConversationId] = useState<string | null>(() => {
    const session = readCompanionUiSession();
    return session?.activeConversationId ?? null;
  });
  const [panelEverOpened, setPanelEverOpened] = useState(() => readCompanionPanelOpenState());

  useEffect(() => traceCompanionMount("CompanionExperienceProvider"), []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      logCompanionFocusSnapshot({
        component: "CompanionExperienceProvider",
        panelOpen: open,
        activeConversationId: drawerConversationId,
        organizationKey,
      });
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [open, drawerConversationId, organizationKey]);

  useEffect(() => {
    if (open) {
      setPanelEverOpened(true);
    }
    patchCompanionUiSession(
      {
        panelOpen: open,
        organizationKey,
        pathname,
        activeConversationId: drawerConversationId,
      },
      organizationKey,
    );
  }, [open, organizationKey, pathname, drawerConversationId]);

  const openDrawer = useCallback(() => {
    setDrawerQuery(null);
    setDrawerConversationId(null);
    setOpen(true);
    setPanelEverOpened(true);
    patchCompanionUiSession({ panelOpen: true, organizationKey, pathname }, organizationKey);
  }, [organizationKey, pathname]);

  const openDrawerWithQuery = useCallback((query: string) => {
    setDrawerQuery(query.trim());
    setDrawerConversationId(null);
    setOpen(true);
    setPanelEverOpened(true);
    patchCompanionUiSession({ panelOpen: true, organizationKey, pathname }, organizationKey);
  }, [organizationKey, pathname]);

  const openDrawerWithConversation = useCallback((conversationId: string) => {
    const trimmed = conversationId.trim();
    setDrawerConversationId(trimmed);
    setDrawerQuery(null);
    setOpen(true);
    setPanelEverOpened(true);
    patchCompanionUiSession(
      { panelOpen: true, organizationKey, pathname, activeConversationId: trimmed },
      organizationKey,
    );
  }, [organizationKey, pathname]);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setDrawerQuery(null);
    setDrawerConversationId(null);
    patchCompanionUiSession({ panelOpen: false, organizationKey, pathname }, organizationKey);
  }, [organizationKey, pathname]);

  const toggleDrawer = useCallback(() => {
    setOpen((value) => {
      const next = !value;
      if (next) {
        setPanelEverOpened(true);
      }
      patchCompanionUiSession({ panelOpen: next, organizationKey, pathname }, organizationKey);
      return next;
    });
  }, [organizationKey, pathname]);

  const value = useMemo(
    () => ({
      open,
      mode: "drawer" as const,
      labels,
      locale,
      openDrawer,
      openDrawerWithQuery,
      openDrawerWithConversation,
      drawerQuery,
      drawerConversationId,
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
      openDrawerWithConversation,
      drawerQuery,
      drawerConversationId,
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
