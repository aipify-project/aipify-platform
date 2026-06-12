"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/marketing/analytics";

export type OrbState = "online" | "working" | "attention" | "critical" | "disconnected" | "quiet";

type OrbStateInfo = { label: string; description: string };

type CompanionOrbDemoProps = {
  title: string;
  subtitle: string;
  clickHint: string;
  states: Record<OrbState, OrbStateInfo>;
};

const STATE_ORDER: OrbState[] = [
  "online",
  "working",
  "attention",
  "critical",
  "disconnected",
  "quiet",
];

const STATE_STYLES: Record<
  OrbState,
  { ring: string; core: string; animation: string }
> = {
  online: {
    ring: "from-cyan-400/40 to-blue-500/40",
    core: "from-cyan-400 to-blue-500",
    animation: "animate-aipify-orb-breathe",
  },
  working: {
    ring: "from-blue-400/40 to-violet-500/40",
    core: "from-blue-400 to-violet-500",
    animation: "animate-presence-working",
  },
  attention: {
    ring: "from-amber-400/40 to-orange-500/40",
    core: "from-amber-400 to-orange-500",
    animation: "animate-presence-approval",
  },
  critical: {
    ring: "from-red-400/40 to-rose-500/40",
    core: "from-red-400 to-rose-500",
    animation: "animate-presence-critical",
  },
  disconnected: {
    ring: "from-slate-500/30 to-slate-600/30",
    core: "from-slate-500 to-slate-600",
    animation: "",
  },
  quiet: {
    ring: "from-violet-400/30 to-indigo-500/30",
    core: "from-violet-400 to-indigo-500",
    animation: "animate-presence-standby",
  },
};

export default function CompanionOrbDemo({
  title,
  subtitle,
  clickHint,
  states,
}: CompanionOrbDemoProps) {
  const [activeState, setActiveState] = useState<OrbState>("online");
  const [panelOpen, setPanelOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || panelOpen) return;
    let index = 0;
    const id = window.setInterval(() => {
      index = (index + 1) % STATE_ORDER.length;
      const next = STATE_ORDER[index];
      setActiveState(next);
      trackEvent("orb_state_change", { state: next });
    }, 4000);
    return () => window.clearInterval(id);
  }, [reducedMotion, panelOpen]);

  const style = STATE_STYLES[activeState];
  const info = states[activeState];

  const orbButtons = useMemo(
    () =>
      STATE_ORDER.map((state) => ({
        state,
        ...states[state],
        ...STATE_STYLES[state],
      })),
    [states]
  );

  return (
    <section className="relative overflow-hidden" aria-labelledby="companion-orb-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 id="companion-orb-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-slate-400">{subtitle}</p>
            <p className="mt-2 text-sm text-slate-500">{clickHint}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {orbButtons.map(({ state, label }) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => {
                    setActiveState(state);
                    setPanelOpen(true);
                    trackEvent("orb_state_change", { state, source: "button" });
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    activeState === state
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[280px] items-center justify-center">
            <button
              type="button"
              className="group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e14]"
              aria-expanded={panelOpen}
              aria-label={`Companion orb — ${info.label}`}
              onClick={() => setPanelOpen((open) => !open)}
            >
              <span
                className={`absolute h-32 w-32 rounded-full bg-gradient-to-br ${style.ring} blur-xl ${reducedMotion ? "" : "animate-aipify-orb-glow"}`}
                aria-hidden="true"
              />
              <span
                className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${style.core} shadow-2xl shadow-cyan-500/20 ${reducedMotion ? "" : style.animation}`}
              >
                <span className="h-8 w-8 rounded-full bg-white/30 backdrop-blur-sm" />
              </span>
            </button>

            {panelOpen && (
              <div
                className="absolute bottom-0 left-1/2 w-full max-w-sm -translate-x-1/2 rounded-2xl border border-white/10 bg-[#111827]/95 p-5 shadow-xl backdrop-blur-md sm:left-auto sm:right-0 sm:translate-x-0 lg:max-w-xs"
                role="dialog"
                aria-label={info.label}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                      Companion state
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">{info.label}</p>
                    <p className="mt-2 text-sm text-slate-400">{info.description}</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                    aria-label="Close panel"
                    onClick={() => setPanelOpen(false)}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  System presence only — not employee monitoring.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
