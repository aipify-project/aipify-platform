"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import type { AnalyticsConsentState } from "@/lib/product-analytics/consent";
import {
  buildGa4ScriptSrc,
  handleGa4ScriptLoad,
  resolveGaMeasurementId,
  syncGa4WithConsent,
  type Ga4Window,
} from "@/lib/product-analytics/ga4";

type Props = {
  consent: AnalyticsConsentState;
  hydrated: boolean;
};

export default function ConsentGatedGoogleAnalytics({ consent, hydrated }: Props) {
  const measurementId = resolveGaMeasurementId();
  const [mountScript, setMountScript] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !measurementId) {
      setMountScript(false);
      return;
    }

    const result = syncGa4WithConsent(consent, measurementId, window as unknown as Ga4Window, hydrated);
    setMountScript(result.shouldMountScript);
  }, [consent, hydrated, measurementId]);

  if (!measurementId || !mountScript) {
    return null;
  }

  return (
    <Script
      id="aipify-consent-gated-ga4"
      src={buildGa4ScriptSrc(measurementId)}
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window === "undefined" || consent !== "granted") return;
        handleGa4ScriptLoad(measurementId, window as unknown as Ga4Window);
      }}
    />
  );
}
