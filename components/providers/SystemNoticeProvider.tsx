"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SystemNoticeLabels } from "@/lib/system-notice/types";
import { SYSTEM_NOTICE_LABELS_EN } from "@/lib/system-notice/fallback-labels-en";

const FALLBACK = SYSTEM_NOTICE_LABELS_EN;

const SystemNoticeContext = createContext<SystemNoticeLabels>(FALLBACK);

export function SystemNoticeProvider({
  labels,
  children,
}: {
  labels: SystemNoticeLabels;
  children: ReactNode;
}) {
  return <SystemNoticeContext.Provider value={labels}>{children}</SystemNoticeContext.Provider>;
}

export function useSystemNoticeLabels(): SystemNoticeLabels {
  return useContext(SystemNoticeContext);
}
