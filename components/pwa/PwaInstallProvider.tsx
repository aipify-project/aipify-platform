"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  captureBeforeInstallPrompt,
  getDeferredInstallPrompt,
  invokeDeferredInstallPrompt,
  markWebAppInstalled,
  resetInstallPromptDismissal,
  subscribeInstallPrompt,
} from "@/lib/pwa/install-prompt-store";
import {
  createSsrWebAppInstallRuntimeSnapshot,
  readWebAppInstallRuntimeSnapshot,
  resolveWebAppInstallCardState,
  resolveWebAppInstallModalPhase,
  resolveWebAppInstallVisibility,
  shouldShowManualInstallGuidance,
  shouldUseNativeInstallPrompt,
  type WebAppInstallCardState,
  type WebAppInstallModalPhase,
} from "@/lib/pwa/install-controller";
import { supportsBeforeInstallPrompt } from "@/lib/pwa/capability";
import type { BeforeInstallPromptEvent, PwaInstallVisibility } from "@/lib/pwa/types";
import { ServiceWorkerRegistration } from "./ServiceWorkerRegistration";

type PwaInstallContextValue = {
  visibility: PwaInstallVisibility;
  cardState: WebAppInstallCardState;
  hasDeferredPrompt: boolean;
  modalOpen: boolean;
  modalPhase: WebAppInstallModalPhase;
  requestBrandedInstall: () => void;
  confirmInstall: () => Promise<void>;
  dismissModal: () => void;
  resetDismissed: () => void;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState(createSsrWebAppInstallRuntimeSnapshot);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhase, setModalPhase] = useState<WebAppInstallModalPhase>("benefits");
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const refresh = useCallback(() => {
    setSnapshot(readWebAppInstallRuntimeSnapshot());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeInstallPrompt(refresh);
  }, [refresh]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent;

    function onBeforeInstallPrompt(event: Event) {
      if (!supportsBeforeInstallPrompt(ua)) return;
      captureBeforeInstallPrompt(event as BeforeInstallPromptEvent);
      refresh();
    }

    function onAppInstalled() {
      markWebAppInstalled();
      refresh();
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [refresh]);

  const visibility = useMemo(() => resolveWebAppInstallVisibility(snapshot), [snapshot]) as PwaInstallVisibility;
  const cardState = useMemo(() => resolveWebAppInstallCardState(snapshot), [snapshot]);

  const requestBrandedInstall = useCallback(() => {
    const current = readWebAppInstallRuntimeSnapshot();
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setModalPhase(resolveWebAppInstallModalPhase(current));
    setModalOpen(true);
  }, []);

  const dismissModal = useCallback(() => {
    setModalOpen(false);
    setModalPhase("benefits");
    returnFocusRef.current?.focus();
  }, []);

  const resetDismissed = useCallback(() => {
    resetInstallPromptDismissal();
    refresh();
  }, [refresh]);

  const confirmInstall = useCallback(async () => {
    const current = readWebAppInstallRuntimeSnapshot();

    if (shouldUseNativeInstallPrompt(current)) {
      setModalOpen(false);
      const outcome = await invokeDeferredInstallPrompt();
      refresh();
      if (outcome === "dismissed") {
        setModalPhase("benefits");
      }
      returnFocusRef.current?.focus();
      return;
    }

    if (shouldShowManualInstallGuidance(current)) {
      setModalPhase("manual");
      return;
    }

    setModalPhase("unsupported");
  }, [refresh]);

  const value = useMemo(
    () => ({
      visibility,
      cardState,
      hasDeferredPrompt: snapshot.hasDeferredPrompt,
      requestBrandedInstall,
      confirmInstall,
      dismissModal,
      modalOpen,
      modalPhase,
      resetDismissed,
    }),
    [
      visibility,
      cardState,
      snapshot.hasDeferredPrompt,
      requestBrandedInstall,
      confirmInstall,
      dismissModal,
      modalOpen,
      modalPhase,
      resetDismissed,
    ]
  );

  return (
    <PwaInstallContext.Provider value={value}>
      <ServiceWorkerRegistration />
      {children}
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstall(): PwaInstallContextValue {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) {
    throw new Error("usePwaInstall must be used within PwaInstallProvider");
  }
  return ctx;
}

export function useOptionalPwaInstall(): PwaInstallContextValue | null {
  return useContext(PwaInstallContext);
}
