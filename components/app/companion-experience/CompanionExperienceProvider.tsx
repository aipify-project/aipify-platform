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
import {
  logCompanionFocusSnapshot,
  traceCompanionMount,
} from "@/lib/app/companion/companion-mount-trace";
import { useCompanionUIState } from "./hooks/useCompanionUIState";

type CompanionExperienceContextValue = {
  open: boolean;
  drawerExpanded: boolean;
  panelEverOpened: boolean;
  mode: "drawer" | "fullpage";
  labels: CompanionExperienceLabels;
  locale: string;
  openDrawer: () => void;
  openDrawerCompact: () => void;
  openDrawerWithQuery: (query: string) => void;
  openDrawerWithConversation: (conversationId: string) => void;
  drawerQuery: string | null;
  drawerConversationId: string | null;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  toggleDrawerExpanded: () => void;
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

  const {
    open,
    drawerExpanded,
    panelEverOpened,
    openDrawer,
    openDrawerCompact,
    closeDrawer,
    toggleDrawer,
    toggleDrawerExpanded,
  } = useCompanionUIState({ pathname, organizationKey });

  const [drawerQuery, setDrawerQuery] = useState<string | null>(null);
  const [drawerConversationId, setDrawerConversationId] = useState<string | null>(() => {
    const session = readCompanionUiSession();
    return session?.activeConversationId ?? null;
  });

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

  const openDrawerWithQuery = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      const session = readCompanionUiSession(organizationKey);
      setDrawerQuery(trimmed);
      setDrawerConversationId(session?.activeConversationId ?? null);
      openDrawerCompact();
      patchCompanionUiSession(
        {
          panelOpen: true,
          organizationKey,
          pathname,
          activeConversationId: session?.activeConversationId ?? undefined,
        },
        organizationKey,
      );
    },
    [organizationKey, pathname, openDrawerCompact],
  );

  const openDrawerWithConversation = useCallback(
    (conversationId: string) => {
      const trimmed = conversationId.trim();
      setDrawerConversationId(trimmed);
      setDrawerQuery(null);
      openDrawerCompact();
      patchCompanionUiSession(
        { panelOpen: true, organizationKey, pathname, activeConversationId: trimmed },
        organizationKey,
      );
    },
    [organizationKey, pathname, openDrawerCompact],
  );

  const value = useMemo(
    () => ({
      open,
      drawerExpanded,
      panelEverOpened,
      mode: "drawer" as const,
      labels,
      locale,
      openDrawer,
      openDrawerCompact,
      openDrawerWithQuery,
      openDrawerWithConversation,
      drawerQuery,
      drawerConversationId,
      closeDrawer,
      toggleDrawer,
      toggleDrawerExpanded,
      pathname,
      organizationKey,
    }),
    [
      open,
      drawerExpanded,
      panelEverOpened,
      labels,
      locale,
      openDrawer,
      openDrawerCompact,
      openDrawerWithQuery,
      openDrawerWithConversation,
      drawerQuery,
      drawerConversationId,
      closeDrawer,
      toggleDrawer,
      toggleDrawerExpanded,
      pathname,
      organizationKey,
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
