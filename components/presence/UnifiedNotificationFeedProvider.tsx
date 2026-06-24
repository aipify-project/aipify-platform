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
import { usePathname } from "next/navigation";
import { dispatchOperationalDataRefresh } from "@/lib/command-center/operational-refresh-events";
import {
  dedupeFetch,
  isCommandCenterRoute,
  POLL_INTERVAL_HIDDEN_BADGE_MS,
  POLL_INTERVAL_NOTIFICATIONS_MS,
  shouldPollNotifications,
  usePollingTask,
} from "@/lib/polling";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import {
  detectNewNotificationIds,
  findLatestByEventType,
  findUnreadCompanionReplyReady,
  isNotificationUnread,
  parsePresenceNotificationFeed,
  parsePresenceNotificationPreferences,
  playSoftBellChimeAsync,
  primeSoftBellAudio,
  shouldPlayInAppNotificationSound,
  type UnifiedNotificationCenterLabels,
} from "@/lib/presence/unified-notification-feed";
import { patchNotificationArchivedLocally, patchNotificationReadLocally } from "@/lib/app/notifications/inbox";
import {
  applyActiveCompanionSeenSync,
} from "@/lib/presence/unified-notification-feed/companion-seen-sync";
import { getCompanionActiveSession } from "@/lib/presence/unified-notification-feed/companion-active-session";

const FEED_LIMIT = 40;
const PULSE_DURATION_MS = 2600;

type UnifiedNotificationFeedContextValue = {
  labels: UnifiedNotificationCenterLabels;
  notifications: PresenceNotification[];
  unreadCount: number;
  loading: boolean;
  centerOpen: boolean;
  pulseActive: boolean;
  toastNotification: PresenceNotification | null;
  preferences: PresenceNotificationPreferences | null;
  openCenter: () => void;
  closeCenter: () => void;
  refresh: () => Promise<boolean>;
  refreshPreferences: () => Promise<void>;
  applyPreferences: (preferences: PresenceNotificationPreferences) => void;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markConversationNotificationsRead: (conversationId: string) => Promise<void>;
  dismissNotification: (notificationId: string) => Promise<void>;
  openNotification: (notification: PresenceNotification) => Promise<void>;
  suppressToast: (notificationId: string) => void;
};

const UnifiedNotificationFeedContext = createContext<UnifiedNotificationFeedContextValue | null>(
  null,
);

async function performNotificationAction(
  notificationId: string,
  actionType: "mark_as_reviewed" | "archive" | "dismiss",
): Promise<void> {
  await fetch(`/api/presence/notifications/${notificationId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action_type: actionType }),
  });
}

type UnifiedNotificationFeedProviderProps = {
  children: ReactNode;
  labels: UnifiedNotificationCenterLabels;
};

export function UnifiedNotificationFeedProvider({
  children,
  labels,
}: UnifiedNotificationFeedProviderProps) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<PresenceNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [centerOpen, setCenterOpen] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [toastNotification, setToastNotification] = useState<PresenceNotification | null>(null);
  const [preferences, setPreferences] = useState<PresenceNotificationPreferences | null>(null);

  const orgReadyRef = useRef<boolean | null>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const previousUnreadRef = useRef(0);
  const pulseTimerRef = useRef<number | null>(null);
  const suppressedToastIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);
  const playedSoundIdsRef = useRef<Set<string>>(new Set());
  const audioPrimedRef = useRef(false);
  const preferencesRef = useRef<PresenceNotificationPreferences | null>(null);
  const pendingMarkReadRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    preferencesRef.current = preferences;
  }, [preferences]);

  const ensureOrgReady = useCallback(async (): Promise<boolean> => {
    if (orgReadyRef.current === true) return true;
    if (orgReadyRef.current === false) return false;

    try {
      const res = await fetch("/api/app/organization-context", { cache: "no-store" });
      if (!res.ok) {
        orgReadyRef.current = false;
        return false;
      }
      const body = (await res.json()) as { state?: string; has_app_access?: boolean };
      const ready = body.state === "ready" && body.has_app_access === true;
      orgReadyRef.current = ready;
      return ready;
    } catch {
      orgReadyRef.current = false;
      return false;
    }
  }, []);

  const loadPreferences = useCallback(async (): Promise<PresenceNotificationPreferences | null> => {
    try {
      const res = await fetch("/api/presence/preferences", { cache: "no-store" });
      if (!res.ok) return null;
      const data = (await res.json()) as unknown;
      const parsed = parsePresenceNotificationPreferences(data);
      setPreferences(parsed);
      return parsed;
    } catch {
      return null;
    }
  }, []);

  const refreshPreferences = useCallback(async () => {
    await loadPreferences();
  }, [loadPreferences]);

  const applyPreferences = useCallback((next: PresenceNotificationPreferences) => {
    setPreferences(next);
  }, []);

  const markReadOnServer = useCallback(async (notificationIds: string[]) => {
    const uniqueIds = notificationIds.filter((id) => {
      if (pendingMarkReadRef.current.has(id)) return false;
      pendingMarkReadRef.current.add(id);
      return true;
    });
    if (uniqueIds.length === 0) return;

    await Promise.all(
      uniqueIds.map((notificationId) =>
        performNotificationAction(notificationId, "mark_as_reviewed").finally(() => {
          pendingMarkReadRef.current.delete(notificationId);
        }),
      ),
    );
  }, []);

  const applyFeedEffects = useCallback(
    (
      feedNotifications: PresenceNotification[],
      prefs: PresenceNotificationPreferences | null,
      unreadCount: number,
    ) => {
      const session = getCompanionActiveSession();
      const seenSync = applyActiveCompanionSeenSync(
        { notifications: feedNotifications, unreadCount },
        session,
      );

      if (seenSync.idsToMarkRead.length > 0) {
        void markReadOnServer(seenSync.idsToMarkRead);
      }

      const syncedNotifications = seenSync.feed.notifications;
      const syncedUnreadCount = seenSync.feed.unreadCount;

      const newIds = detectNewNotificationIds(knownIdsRef.current, syncedNotifications);
      if (initializedRef.current && newIds.length > 0) {
        const newItems = syncedNotifications.filter((item) => newIds.includes(item.id));
        const playfulBell = newItems.find((item) => item.event_type === "playful_bell_moment");
        if (playfulBell) {
          setPulseActive(true);
          if (pulseTimerRef.current) {
            window.clearTimeout(pulseTimerRef.current);
          }
          pulseTimerRef.current = window.setTimeout(() => {
            setPulseActive(false);
            pulseTimerRef.current = null;
          }, PULSE_DURATION_MS);
        }

        void (async () => {
          for (const item of newItems) {
            if (!shouldPlayInAppNotificationSound(item, prefs)) continue;
            if (playedSoundIdsRef.current.has(item.id)) continue;
            playedSoundIdsRef.current.add(item.id);
            primeSoftBellAudio();
            await playSoftBellChimeAsync();
            break;
          }
        })();
      }

      for (const item of syncedNotifications) {
        knownIdsRef.current.add(item.id);
      }
      initializedRef.current = true;

      const replyToast = findUnreadCompanionReplyReady(
        syncedNotifications,
        suppressedToastIdsRef.current,
      );
      setToastNotification(replyToast);

      return { notifications: syncedNotifications, unreadCount: syncedUnreadCount };
    },
    [markReadOnServer],
  );

  const refresh = useCallback(async (): Promise<boolean> => {
    if (!shouldPollNotifications(pathname)) {
      return true;
    }
    if (!(await ensureOrgReady())) {
      return false;
    }

    try {
      const ok = await dedupeFetch("unified-presence-notifications", async () => {
        const res = await fetch(
          `/api/presence/notifications?limit=${FEED_LIMIT}&unread_only=false`,
          { cache: "no-store" },
        );
        if (!res.ok) return false;

        const data = (await res.json()) as unknown;
        const feed = parsePresenceNotificationFeed(data);
        const prefs = preferencesRef.current;
        const synced = applyFeedEffects(feed.notifications, prefs, feed.unreadCount);
        setNotifications(synced.notifications);
        setUnreadCount(synced.unreadCount);
        return true;
      });
      return ok;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, [applyFeedEffects, ensureOrgReady, pathname]);

  useEffect(() => {
    void loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    if (audioPrimedRef.current || typeof window === "undefined") return;

    const primeOnce = () => {
      if (audioPrimedRef.current) return;
      audioPrimedRef.current = true;
      primeSoftBellAudio();
      window.removeEventListener("pointerdown", primeOnce);
      window.removeEventListener("keydown", primeOnce);
    };

    window.addEventListener("pointerdown", primeOnce, { passive: true });
    window.addEventListener("keydown", primeOnce, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", primeOnce);
      window.removeEventListener("keydown", primeOnce);
    };
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!isCommandCenterRoute(pathname)) {
      previousUnreadRef.current = unreadCount;
      return;
    }
    if (unreadCount > previousUnreadRef.current) {
      dispatchOperationalDataRefresh("notifications");
    }
    previousUnreadRef.current = unreadCount;
  }, [pathname, unreadCount]);

  const pollingEnabled = shouldPollNotifications(pathname);

  usePollingTask({
    taskKey: "unified-presence-notifications",
    intervalMs: pollingEnabled ? POLL_INTERVAL_NOTIFICATIONS_MS : 0,
    hiddenIntervalMs: pollingEnabled ? POLL_INTERVAL_HIDDEN_BADGE_MS : undefined,
    enabled: pollingEnabled,
    runImmediately: false,
    refreshOnVisible: true,
    execute: refresh,
  });

  const markNotificationRead = useCallback(async (notificationId: string) => {
    let wasUnread = false;
    setNotifications((current) => {
      const target = current.find((item) => item.id === notificationId);
      if (!target || !isNotificationUnread(target)) return current;
      wasUnread = true;
      return patchNotificationReadLocally(current, notificationId);
    });
    if (wasUnread) {
      setUnreadCount((current) => Math.max(0, current - 1));
    }
    await performNotificationAction(notificationId, "mark_as_reviewed");
  }, []);

  const markConversationNotificationsRead = useCallback(
    async (conversationId: string) => {
      let idsToMark: string[] = [];
      setNotifications((current) => {
        const session = getCompanionActiveSession();
        const synced = applyActiveCompanionSeenSync(
          { notifications: current, unreadCount: 0 },
          {
            panelVisible: true,
            conversationId,
            hasVisibleAssistantReply: session.hasVisibleAssistantReply || true,
          },
        );
        idsToMark = synced.idsToMarkRead;
        return synced.feed.notifications;
      });
      if (idsToMark.length === 0) return;
      setUnreadCount((current) => Math.max(0, current - idsToMark.length));
      await markReadOnServer(idsToMark);
    },
    [markReadOnServer],
  );

  const dismissNotification = useCallback(
    async (notificationId: string) => {
      let wasUnread = false;
      setNotifications((current) => {
        const target = current.find((item) => item.id === notificationId);
        if (!target) return current;
        if (isNotificationUnread(target)) wasUnread = true;
        return patchNotificationArchivedLocally(current, notificationId);
      });
      if (wasUnread) {
        setUnreadCount((current) => Math.max(0, current - 1));
      }
      suppressedToastIdsRef.current.add(notificationId);
      if (toastNotification?.id === notificationId) {
        setToastNotification(null);
      }
      await performNotificationAction(notificationId, "archive");
    },
    [toastNotification?.id],
  );

  const openNotification = useCallback(
    async (notification: PresenceNotification) => {
      await markNotificationRead(notification.id);
      const href = notification.action_href?.trim();
      if (href) {
        window.location.assign(href);
      }
    },
    [markNotificationRead],
  );

  const suppressToast = useCallback((notificationId: string) => {
    suppressedToastIdsRef.current.add(notificationId);
    setToastNotification(null);
  }, []);

  const value = useMemo<UnifiedNotificationFeedContextValue>(
    () => ({
      labels,
      notifications,
      unreadCount,
      loading,
      centerOpen,
      pulseActive,
      toastNotification,
      preferences,
      openCenter: () => setCenterOpen(true),
      closeCenter: () => setCenterOpen(false),
      refresh,
      refreshPreferences,
      applyPreferences,
      markNotificationRead,
      markConversationNotificationsRead,
      dismissNotification,
      openNotification,
      suppressToast,
    }),
    [
      labels,
      notifications,
      unreadCount,
      loading,
      centerOpen,
      pulseActive,
      toastNotification,
      preferences,
      refresh,
      refreshPreferences,
      applyPreferences,
      markNotificationRead,
      markConversationNotificationsRead,
      dismissNotification,
      openNotification,
      suppressToast,
    ],
  );

  return (
    <UnifiedNotificationFeedContext.Provider value={value}>
      {children}
    </UnifiedNotificationFeedContext.Provider>
  );
}

export function useUnifiedNotificationFeed(): UnifiedNotificationFeedContextValue {
  const context = useContext(UnifiedNotificationFeedContext);
  if (!context) {
    throw new Error("useUnifiedNotificationFeed must be used within UnifiedNotificationFeedProvider");
  }
  return context;
}

export function useOptionalUnifiedNotificationFeed(): UnifiedNotificationFeedContextValue | null {
  return useContext(UnifiedNotificationFeedContext);
}

export function getLatestPlayfulBellMoment(
  notifications: PresenceNotification[],
): PresenceNotification | null {
  return findLatestByEventType(notifications, "playful_bell_moment");
}
