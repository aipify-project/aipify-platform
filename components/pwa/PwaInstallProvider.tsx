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
  isWebAppInstalled,
  markWebAppInstalled,
  subscribeInstallPrompt,
  wasInstallPromptDismissed,
} from "@/lib/pwa/install-prompt-store";
import {
  canOfferWebAppInstall,
  isStandaloneDisplayMode,
  supportsBeforeInstallPrompt,
} from "@/lib/pwa/capability";
import type { BeforeInstallPromptEvent, PwaInstallVisibility } from "@/lib/pwa/types";
import { ServiceWorkerRegistration } from "./ServiceWorkerRegistration";

type PwaInstallContextValue = {
  visibility: PwaInstallVisibility;
  hasDeferredPrompt: boolean;
  requestBrandedInstall: () => void;
  confirmInstall: () => Promise<void>;
  dismissModal: () => void;
  modalOpen: boolean;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [standalone, setStandalone] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const refresh = useCallback(() => {
    setStandalone(isStandaloneDisplayMode());
    setInstalled(isWebAppInstalled());
    setDismissed(wasInstallPromptDismissed());
    setHasPrompt(Boolean(getDeferredInstallPrompt()));
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

  const visibility: PwaInstallVisibility = useMemo(() => {
    if (standalone || installed) return "installed";
    if (typeof window === "undefined") return "hidden";
    const ua = window.navigator.userAgent;
    if (!canOfferWebAppInstall(ua, standalone)) return "hidden";
    if (dismissed && !hasPrompt) return "hidden";
    return "install";
  }, [standalone, installed, dismissed, hasPrompt]);

  const requestBrandedInstall = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setModalOpen(true);
  }, []);

  const dismissModal = useCallback(() => {
    setModalOpen(false);
    returnFocusRef.current?.focus();
  }, []);

  const confirmInstall = useCallback(async () => {
    setModalOpen(false);
    const outcome = await invokeDeferredInstallPrompt();
    if (outcome === "unavailable") {
      window.location.href = "/install";
      return;
    }
    refresh();
    returnFocusRef.current?.focus();
  }, [refresh]);

  const value = useMemo(
    () => ({
      visibility,
      hasDeferredPrompt: hasPrompt,
      requestBrandedInstall,
      confirmInstall,
      dismissModal,
      modalOpen,
    }),
    [visibility, hasPrompt, requestBrandedInstall, confirmInstall, dismissModal, modalOpen]
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
