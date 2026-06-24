"use client";

type CompanionMountTraceState = {
  mounts: number;
  unmounts: number;
};

const counters = new Map<string, CompanionMountTraceState>();

export function readCompanionMountCounter(name: string): CompanionMountTraceState {
  return counters.get(name) ?? { mounts: 0, unmounts: 0 };
}

export function traceCompanionMount(name: string): () => void {
  const current = readCompanionMountCounter(name);
  counters.set(name, { ...current, mounts: current.mounts + 1 });
  console.info(
    "[companion-mount]",
    JSON.stringify({ component: name, event: "mount", ...readCompanionMountCounter(name) }),
  );

  return () => {
    const latest = readCompanionMountCounter(name);
    counters.set(name, { ...latest, unmounts: latest.unmounts + 1 });
    console.info(
      "[companion-mount]",
      JSON.stringify({
        component: name,
        event: "unmount",
        ...readCompanionMountCounter(name),
      }),
    );
  };
}

export function logCompanionFocusSnapshot(input: {
  component: string;
  panelOpen?: boolean;
  activeConversationId?: string | null;
  organizationKey?: string | null;
}): void {
  console.info(
    "[companion-mount]",
    JSON.stringify({
      component: input.component,
      event: "visibility_visible",
      pathname: typeof window !== "undefined" ? window.location.pathname : null,
      panelOpen: input.panelOpen ?? null,
      activeConversationId: input.activeConversationId ?? null,
      organizationKey: input.organizationKey ?? null,
      counters: Object.fromEntries(counters.entries()),
    }),
  );
}

export function getCompanionMountCounters(): Record<string, CompanionMountTraceState> {
  return Object.fromEntries(counters.entries());
}
