"use client";

/** Broadcast when operational surfaces should silently reload (notifications, approvals, etc.). */
export const OPERATIONAL_DATA_REFRESH_EVENT = "aipify:operational-data-changed";

export type OperationalDataRefreshDetail = {
  source?: string;
};

export function dispatchOperationalDataRefresh(source?: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OperationalDataRefreshDetail>(OPERATIONAL_DATA_REFRESH_EVENT, {
      detail: { source },
    }),
  );
}

export function subscribeOperationalDataRefresh(
  listener: (detail: OperationalDataRefreshDetail) => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const custom = event as CustomEvent<OperationalDataRefreshDetail>;
    listener(custom.detail ?? {});
  };

  window.addEventListener(OPERATIONAL_DATA_REFRESH_EVENT, handler);
  return () => window.removeEventListener(OPERATIONAL_DATA_REFRESH_EVENT, handler);
}
