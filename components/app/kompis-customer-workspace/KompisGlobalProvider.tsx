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
import { APP_LAYOUT_BREAKPOINTS, type AppKompisLayoutMode } from "@/lib/design/app-layout";
import {
  resolveEffectiveKompisLayoutMode,
  resolveKompisRouteLayout,
  type KompisRouteLayoutCapability,
} from "@/lib/kompis-customer-workspace/route-layout";
import {
  readKompisGlobalUiState,
  writeKompisGlobalUiState,
} from "@/lib/kompis-customer-workspace/ui-state";

export type KompisGlobalLabels = {
  title: string;
  openButton: string;
  closeButton: string;
  ariaOpen: string;
  ariaClose: string;
  available: string;
  contextPrefix: string;
  contexts: Record<string, string>;
  prompts: {
    dashboard: string[];
    integrations: string[];
    billing: string[];
    support: string[];
    organization: string[];
    approvals: string[];
    workspace: string[];
    generic: string[];
  };
  labelsCatalog: Record<string, string>;
};

type KompisGlobalContextValue = {
  open: boolean;
  openKompis: () => void;
  closeKompis: () => void;
  toggleKompis: () => void;
  pathname: string;
  capability: KompisRouteLayoutCapability;
  layoutMode: AppKompisLayoutMode;
  labels: KompisGlobalLabels;
  locale: string;
  organizationName: string;
  userRole: string;
  isAdmin: boolean;
  initialPermissionsJson: string | null;
};

const KompisGlobalContext = createContext<KompisGlobalContextValue | null>(null);

type ProviderProps = {
  labels: KompisGlobalLabels;
  locale: string;
  organizationName: string;
  userRole: string;
  isAdmin: boolean;
  initialPermissionsJson: string | null;
  children: ReactNode;
};

function useViewportWidth(): number {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : APP_LAYOUT_BREAKPOINTS.splitMinPx
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

export function KompisGlobalProvider({
  labels,
  locale,
  organizationName,
  userRole,
  isAdmin,
  initialPermissionsJson,
  children,
}: ProviderProps) {
  const pathname = usePathname() || "/app";
  const viewportWidth = useViewportWidth();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persisted = readKompisGlobalUiState();
    if (persisted) setOpen(persisted.open);
    setHydrated(true);
  }, []);

  const setOpenPersisted = useCallback((next: boolean) => {
    setOpen(next);
    writeKompisGlobalUiState(next);
  }, []);

  const openKompis = useCallback(() => setOpenPersisted(true), [setOpenPersisted]);
  const closeKompis = useCallback(() => setOpenPersisted(false), [setOpenPersisted]);
  const toggleKompis = useCallback(
    () => setOpenPersisted(!open),
    [open, setOpenPersisted]
  );

  const capability = useMemo(() => resolveKompisRouteLayout(pathname), [pathname]);
  const layoutMode = useMemo(
    () =>
      resolveEffectiveKompisLayoutMode(capability, {
        viewportWidth,
        splitMinPx: APP_LAYOUT_BREAKPOINTS.splitMinPx,
      }),
    [capability, viewportWidth]
  );

  useEffect(() => {
    if (!hydrated || !open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeKompis();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeKompis, hydrated, open]);

  const value = useMemo<KompisGlobalContextValue>(
    () => ({
      open,
      openKompis,
      closeKompis,
      toggleKompis,
      pathname,
      capability,
      layoutMode,
      labels,
      locale,
      organizationName,
      userRole,
      isAdmin,
      initialPermissionsJson,
    }),
    [
      open,
      openKompis,
      closeKompis,
      toggleKompis,
      pathname,
      capability,
      layoutMode,
      labels,
      locale,
      organizationName,
      userRole,
      isAdmin,
      initialPermissionsJson,
    ]
  );

  return (
    <KompisGlobalContext.Provider value={value}>{children}</KompisGlobalContext.Provider>
  );
}

export function useKompisGlobal(): KompisGlobalContextValue {
  const ctx = useContext(KompisGlobalContext);
  if (!ctx) {
    throw new Error("useKompisGlobal must be used within KompisGlobalProvider");
  }
  return ctx;
}

export function useOptionalKompisGlobal(): KompisGlobalContextValue | null {
  return useContext(KompisGlobalContext);
}
