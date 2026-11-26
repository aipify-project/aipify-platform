"use client";

/**
 * Persistent CSP portal session for the partner shell.
 *
 * Root cause of slow menu navigation: every page remounted
 * `CertifiedSalesPartnerWorkspacePanel`, which re-fetched
 * `GET /api/certified-sales-partner/portal` (Core `csp_get_partner_overview`)
 * and blocked the main pane on loading.
 *
 * This provider lives in the partners layout so the fetch runs once per
 * browser session (plus silent revalidation on focus / auth change).
 * It never caches across users — cleared on auth change / logout.
 */
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
import { classifyCspPortalResponse, type CspPendingStatus } from "@/lib/certified-sales-partner/portal-gate";
import { parseCspPortalView, type CspPortalView } from "@/lib/certified-sales-partner/portal-view";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";

export type CspPortalSessionState =
  | "loading"
  | "ready"
  | "closed"
  | "error"
  | "unauthorized"
  | "not_registered"
  | "pending";

type SessionValue = {
  state: CspPortalSessionState;
  portal: CspPortalView | null;
  pendingStatus: CspPendingStatus | null;
  detail: string | null;
  reload: (opts?: { silent?: boolean }) => Promise<void>;
};

const CspPortalSessionContext = createContext<SessionValue | null>(null);

/** Shared with child panels — same contract as the previous workspace-local context. */
const CspPortalViewContext = createContext<CspPortalView | null>(null);

export function useCspPortal(): CspPortalView | null {
  return useContext(CspPortalViewContext);
}

export function useCspPortalSession(): SessionValue {
  const value = useContext(CspPortalSessionContext);
  if (!value) {
    throw new Error("useCspPortalSession requires CspPortalSessionProvider");
  }
  return value;
}

/** Optional — WorkspacePanel can fall back when rendered outside the layout provider (tests). */
export function useOptionalCspPortalSession(): SessionValue | null {
  return useContext(CspPortalSessionContext);
}

type Props = { children: ReactNode };

export function CspPortalSessionProvider({ children }: Props) {
  const [state, setState] = useState<CspPortalSessionState>("loading");
  const [portal, setPortal] = useState<CspPortalView | null>(null);
  const [pendingStatus, setPendingStatus] = useState<CspPendingStatus | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const hasLoadedOnce = useRef(false);
  const inFlight = useRef<Promise<void> | null>(null);

  const reload = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent === true && hasLoadedOnce.current;
    if (!silent) {
      setState("loading");
      setPortal(null);
      setPendingStatus(null);
    }

    const run = (async () => {
      try {
        const res = await fetch("/api/certified-sales-partner/portal", { cache: "no-store" });
        const data: unknown = await res.json().catch(() => ({}));
        const gate = classifyCspPortalResponse(res.status, data);
        switch (gate.kind) {
          case "unauthorized":
            setPortal(null);
            setPendingStatus(null);
            setDetail(null);
            setState("unauthorized");
            break;
          case "not_registered":
            setPortal(null);
            setPendingStatus(null);
            setDetail(null);
            setState("not_registered");
            break;
          case "backend_closed":
            setPortal(null);
            setPendingStatus(null);
            setDetail(gate.detail);
            setState("closed");
            break;
          case "error":
            if (!silent) {
              setPortal(null);
              setPendingStatus(null);
              setDetail(gate.detail);
              setState("error");
            }
            break;
          case "pending":
            setPortal(null);
            setPendingStatus(gate.status);
            setDetail(null);
            setState("pending");
            break;
          case "ready":
            setPortal(parseCspPortalView(data));
            setPendingStatus(null);
            setDetail(null);
            setState("ready");
            break;
        }
        hasLoadedOnce.current = true;
      } catch {
        if (!silent) {
          setPortal(null);
          setPendingStatus(null);
          setDetail(null);
          setState("error");
        }
      }
    })();

    inFlight.current = run;
    await run;
    if (inFlight.current === run) inFlight.current = null;
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const onFocus = () => {
      void reload({ silent: true });
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") onFocus();
    });

    const supabase = getBrowserSupabaseClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      // Keep portal data across soft navigation and quiet token refresh.
      if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return;
      hasLoadedOnce.current = false;
      void reload();
    });

    return () => {
      window.removeEventListener("focus", onFocus);
      sub.subscription.unsubscribe();
    };
  }, [reload]);

  const session = useMemo(
    () => ({ state, portal, pendingStatus, detail, reload }),
    [state, portal, pendingStatus, detail, reload],
  );

  return (
    <CspPortalSessionContext.Provider value={session}>
      <CspPortalViewContext.Provider value={state === "ready" ? portal : null}>
        {children}
      </CspPortalViewContext.Provider>
    </CspPortalSessionContext.Provider>
  );
}
