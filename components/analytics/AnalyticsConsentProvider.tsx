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
import AnalyticsConsentBanner from "./AnalyticsConsentBanner";
import type {
  AnalyticsConsentDecision,
  AnalyticsConsentLabels,
  AnalyticsConsentState,
} from "@/lib/product-analytics/consent";
import {
  isAnalyticsConsentAllowed,
  readAnalyticsConsentFromDocument,
  writeAnalyticsConsentCookie,
} from "@/lib/product-analytics/consent";

type AnalyticsConsentContextValue = {
  consent: AnalyticsConsentState;
  isAnalyticsAllowed: boolean;
  openPrivacySettings: () => void;
  setConsent: (decision: AnalyticsConsentDecision) => void;
};

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue | null>(null);

export function useAnalyticsConsent(): AnalyticsConsentContextValue {
  const value = useContext(AnalyticsConsentContext);
  if (!value) {
    throw new Error("useAnalyticsConsent must be used within AnalyticsConsentProvider");
  }
  return value;
}

type Props = {
  labels: AnalyticsConsentLabels;
  privacyHref?: string;
  children: ReactNode;
};

export default function AnalyticsConsentProvider({
  labels,
  privacyHref = "/privacy",
  children,
}: Props) {
  const [consent, setConsentState] = useState<AnalyticsConsentState>("unknown");
  const [hydrated, setHydrated] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  useEffect(() => {
    setConsentState(readAnalyticsConsentFromDocument());
    setHydrated(true);
  }, []);

  const setConsent = useCallback((decision: AnalyticsConsentDecision) => {
    writeAnalyticsConsentCookie(decision);
    setConsentState(decision);
    setManageOpen(false);
  }, []);

  const openPrivacySettings = useCallback(() => {
    setManageOpen(true);
  }, []);

  const contextValue = useMemo<AnalyticsConsentContextValue>(
    () => ({
      consent,
      isAnalyticsAllowed: isAnalyticsConsentAllowed(consent),
      openPrivacySettings,
      setConsent,
    }),
    [consent, openPrivacySettings, setConsent]
  );

  const showInitialBanner = hydrated && consent === "unknown";
  const showManageBanner = hydrated && manageOpen && consent !== "unknown";
  const showSettingsTrigger = hydrated && consent !== "unknown" && !manageOpen;

  return (
    <AnalyticsConsentContext.Provider value={contextValue}>
      {children}
      {showInitialBanner ? (
        <AnalyticsConsentBanner
          labels={labels}
          privacyHref={privacyHref}
          mode="initial"
          onAccept={() => setConsent("granted")}
          onDecline={() => setConsent("denied")}
        />
      ) : null}
      {showManageBanner ? (
        <AnalyticsConsentBanner
          labels={labels}
          privacyHref={privacyHref}
          mode="manage"
          onAccept={() => setConsent("granted")}
          onDecline={() => setConsent("denied")}
          onClose={() => setManageOpen(false)}
        />
      ) : null}
      {showSettingsTrigger ? (
        <div className="fixed bottom-4 left-4 z-[90]">
          <button
            type="button"
            onClick={openPrivacySettings}
            aria-haspopup="dialog"
            aria-expanded={manageOpen}
            className="rounded-full border border-zinc-200 bg-white/95 px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
          >
            {labels.privacySettingsOpen}
          </button>
        </div>
      ) : null}
    </AnalyticsConsentContext.Provider>
  );
}
