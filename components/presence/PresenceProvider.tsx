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
import { createClient } from "@/lib/supabase/client";
import {
  getEmptyPresenceBundle,
  parsePresenceCenterBundle,
  type PresenceCenterBundle,
  type PresenceSettings,
  type PresenceSoundMode,
  type PresenceViewMode,
} from "@/lib/presence/presence-engine";
import PresenceCenterPanel from "./PresenceCenterPanel";

export type PresenceLabels = {
  indicatorTitle: string;
  indicatorAria: string;
  indicatorTooltip: {
    title: string;
    status: string;
    learning: string;
    approvals: string;
    healing: string;
    health: string;
    open: string;
  };
  centerTitle: string;
  close: string;
  loading: string;
  currentState: string;
  currentActivity: string;
  status: string;
  estimatedCompletion: string;
  riskLevel: string;
  seconds: string;
  today: string;
  snapshot: {
    environments: string;
    learning: string;
    healing: string;
    pending: string;
  };
  health: {
    title: string;
    deltaUp: string;
    deltaDown: string;
    deltaFlat: string;
    contributors: string;
  };
  approval: {
    whyTitle: string;
    whyBody: string;
    reasonsTitle: string;
  };
  history: {
    viewDetails: string;
    hideDetails: string;
    trigger: string;
    actions: string;
    outcome: string;
  };
  recommendations: {
    whatHappened: string;
    whyMatters: string;
    suggestedAction: string;
    ifIgnored: string;
  };
  impact: Record<"low" | "medium" | "high" | "critical", string>;
  modes: {
    title: string;
    normal: string;
    learning: string;
    healing: string;
    approval_required: string;
    attention_required: string;
  };
  viewMode: {
    title: string;
    executive: string;
    operations: string;
    executiveHint: string;
    operationsHint: string;
  };
  metrics: {
    automationsRunning: string;
    learningToday: string;
    healingToday: string;
    pendingApprovals: string;
    systemHealth: string;
  };
  sections: {
    activities: string;
    recommendations: string;
    history: string;
    executiveSummary: string;
    settings: string;
    notifications: string;
  };
  states: Record<string, string>;
  stateMessages: Record<string, string>;
  settings: {
    animationMode: string;
    presenceVisible: string;
    executiveSummaries: string;
    selfHealingNotifications: string;
    approvalNotifications: string;
    learningNotifications: string;
    soundMode: string;
    intensities: Record<string, string>;
    soundModes: Record<string, string>;
    save: string;
    saved: string;
  };
  empty: {
    history: string;
    recommendations: string;
  };
};

type PresenceContextValue = {
  bundle: PresenceCenterBundle;
  loading: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  refresh: () => Promise<void>;
  updateSettings: (settings: Partial<PresenceSettings>) => Promise<void>;
  labels: PresenceLabels;
  surface: "platform" | "customer";
  locale: string;
};

const PresenceContext = createContext<PresenceContextValue | null>(null);

type PresenceProviderProps = {
  surface: "platform" | "customer";
  labels: PresenceLabels;
  locale: string;
  children: ReactNode;
};

export function PresenceProvider({ surface, labels, locale, children }: PresenceProviderProps) {
  const [bundle, setBundle] = useState<PresenceCenterBundle>(getEmptyPresenceBundle());
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_presence_center_bundle", {
      p_surface: surface,
    });

    if (!error && data) {
      setBundle(parsePresenceCenterBundle(data));
    }
    setLoading(false);
  }, [surface]);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const updateSettings = useCallback(
    async (settings: Partial<PresenceSettings>) => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("update_presence_settings", {
        p_surface: surface,
        p_animation_intensity: settings.animation_intensity ?? null,
        p_presence_visible: settings.presence_visible ?? null,
        p_executive_summaries: settings.executive_summaries ?? null,
        p_self_healing_notifications: settings.self_healing_notifications ?? null,
        p_approval_notifications: settings.approval_notifications ?? null,
        p_sound_enabled: settings.sound_enabled ?? null,
        p_sound_mode: (settings.sound_mode as PresenceSoundMode) ?? null,
        p_learning_notifications: settings.learning_notifications ?? null,
        p_view_mode: (settings.view_mode as PresenceViewMode) ?? null,
      });

      if (!error && data) {
        setBundle((current) => ({
          ...current,
          settings: {
            ...current.settings,
            ...parsePresenceCenterBundle({ settings: data }).settings,
          },
        }));
      }
    },
    [surface]
  );

  const value = useMemo(
    () => ({
      bundle,
      loading,
      open,
      setOpen,
      refresh,
      updateSettings,
      labels,
      surface,
      locale,
    }),
    [bundle, loading, open, refresh, updateSettings, labels, surface, locale]
  );

  return (
    <PresenceContext.Provider value={value}>
      {children}
      <PresenceCenterPanel />
    </PresenceContext.Provider>
  );
}

export function usePresence(): PresenceContextValue {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error("usePresence must be used within PresenceProvider");
  }
  return context;
}

export function useOptionalPresence(): PresenceContextValue | null {
  return useContext(PresenceContext);
}
