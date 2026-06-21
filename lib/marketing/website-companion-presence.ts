export const WEBSITE_COMPANION_PRESENCE_STATES = [
  "READY",
  "WORKING",
  "COMPLETED",
  "APPROVAL_REQUIRED",
  "CRITICAL",
  "DISCONNECTED",
  "QUIET_HOURS",
] as const;

export type WebsiteCompanionPresenceState = (typeof WEBSITE_COMPANION_PRESENCE_STATES)[number];

export type WebsiteCompanionPresenceStyle = {
  ring: string;
  ringAnimation: string;
  buttonRing: string;
};

export const WEBSITE_COMPANION_PRESENCE_STYLES: Record<
  WebsiteCompanionPresenceState,
  WebsiteCompanionPresenceStyle
> = {
  READY: {
    ring: "from-violet-400/25 to-indigo-500/25",
    ringAnimation: "animate-aipify-orb-glow",
    buttonRing: "ring-aipify-border",
  },
  WORKING: {
    ring: "from-emerald-400/45 to-green-500/35",
    ringAnimation: "animate-marketing-companion-working",
    buttonRing: "ring-emerald-400/50",
  },
  COMPLETED: {
    ring: "from-emerald-300/30 to-teal-400/25",
    ringAnimation: "",
    buttonRing: "ring-emerald-300/40",
  },
  APPROVAL_REQUIRED: {
    ring: "from-amber-400/40 to-orange-500/35",
    ringAnimation: "animate-presence-approval",
    buttonRing: "ring-amber-400/50",
  },
  CRITICAL: {
    ring: "from-red-400/45 to-rose-500/40",
    ringAnimation: "animate-presence-critical",
    buttonRing: "ring-red-400/55",
  },
  DISCONNECTED: {
    ring: "from-slate-400/25 to-slate-500/20",
    ringAnimation: "",
    buttonRing: "ring-slate-300",
  },
  QUIET_HOURS: {
    ring: "from-violet-300/25 to-indigo-400/20",
    ringAnimation: "animate-presence-standby",
    buttonRing: "ring-violet-300/40",
  },
};

export function websiteCompanionPresenceLabel(
  states: Record<WebsiteCompanionPresenceState, string>,
  state: WebsiteCompanionPresenceState,
): string {
  return states[state] ?? state;
}
