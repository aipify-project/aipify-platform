"use client";

import { Suspense } from "react";
import MarketingAnalyticsRecorder from "./MarketingAnalyticsRecorder";
import MarketingEventBridge from "./MarketingEventBridge";
import MarketingScrollTracker from "./MarketingScrollTracker";

export default function MarketingAnalyticsShell() {
  return (
    <>
      <MarketingEventBridge />
      <MarketingScrollTracker />
      <Suspense fallback={null}>
        <MarketingAnalyticsRecorder />
      </Suspense>
    </>
  );
}
