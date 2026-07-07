"use client";

import { useCallback, useEffect, useState } from "react";
import { COMPANION_EXPERIENCE_ROUTE } from "@/lib/app/companion";
import {
  patchCompanionUiSession,
  readCompanionPanelOpenState,
} from "@/lib/app/companion/session-state";

type UseCompanionUIStateOptions = {
  pathname: string;
  organizationKey: string | null;
};

export type CompanionUIState = {
  open: boolean;
  drawerExpanded: boolean;
  panelEverOpened: boolean;
  openDrawer: () => void;
  openDrawerCompact: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  toggleDrawerExpanded: () => void;
  setDrawerExpanded: (expanded: boolean) => void;
};

/** Single source of truth for Companion drawer open + expanded width state. */
export function useCompanionUIState({
  pathname,
  organizationKey,
}: UseCompanionUIStateOptions): CompanionUIState {
  const [open, setOpen] = useState(() => readCompanionPanelOpenState());
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [panelEverOpened, setPanelEverOpened] = useState(() => readCompanionPanelOpenState());

  const persistPanelOpen = useCallback(
    (panelOpen: boolean) => {
      patchCompanionUiSession({ panelOpen, organizationKey, pathname }, organizationKey);
    },
    [organizationKey, pathname],
  );

  const openDrawerCompact = useCallback(() => {
    setDrawerExpanded(false);
    setOpen(true);
    setPanelEverOpened(true);
    persistPanelOpen(true);
  }, [persistPanelOpen]);

  const openDrawer = useCallback(() => {
    openDrawerCompact();
  }, [openDrawerCompact]);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setDrawerExpanded(false);
    persistPanelOpen(false);
  }, [persistPanelOpen]);

  const toggleDrawer = useCallback(() => {
    setOpen((current) => {
      const next = !current;
      if (next) {
        setPanelEverOpened(true);
      } else {
        setDrawerExpanded(false);
      }
      persistPanelOpen(next);
      return next;
    });
  }, [persistPanelOpen]);

  const toggleDrawerExpanded = useCallback(() => {
    setDrawerExpanded((current) => !current);
  }, []);

  const setDrawerExpandedState = useCallback((expanded: boolean) => {
    setDrawerExpanded(expanded);
  }, []);

  useEffect(() => {
    if (pathname !== COMPANION_EXPERIENCE_ROUTE) return;
    setOpen(false);
    setDrawerExpanded(false);
    persistPanelOpen(false);
  }, [pathname, persistPanelOpen]);

  useEffect(() => {
    if (open) {
      setPanelEverOpened(true);
    }
  }, [open]);

  return {
    open,
    drawerExpanded,
    panelEverOpened,
    openDrawer,
    openDrawerCompact,
    closeDrawer,
    toggleDrawer,
    toggleDrawerExpanded,
    setDrawerExpanded: setDrawerExpandedState,
  };
}
