"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/marketing/analytics";

type DemoStep = { title: string; detail: string };

type AnimatedProductDemoProps = {
  title: string;
  subtitle: string;
  steps: DemoStep[];
  mobileSummary: string;
};

const STEP_MS = 2800;

export default function AnimatedProductDemo({
  title,
  subtitle,
  steps,
  mobileSummary,
}: AnimatedProductDemoProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || steps.length === 0) return;
    const id = window.setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length;
        trackEvent("demo_step_view", { step: next + 1 });
        return next;
      });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, steps.length]);

  const progress = useMemo(
    () => ((activeStep + 1) / Math.max(steps.length, 1)) * 100,
    [activeStep, steps.length]
  );

  return (
    <section className="border-y border-aipify-border bg-aipify-surface-muted/60" aria-labelledby="animated-demo-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="animated-demo-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-aipify-text-secondary">{subtitle}</p>
        </div>

        <div className="mt-12 lg:hidden">
          <div className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm">
            <p className="text-sm font-medium text-aipify-companion">Support flow</p>
            <p className="mt-2 text-sm text-aipify-text-secondary">{mobileSummary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {steps.map((step, i) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    i === activeStep
                      ? "bg-aipify-companion text-white"
                      : "border border-aipify-border bg-aipify-surface-muted text-aipify-text-secondary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p className="font-semibold text-aipify-text">{steps[activeStep]?.title}</p>
              <p className="mt-1 text-sm text-aipify-text-secondary">{steps[activeStep]?.detail}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 hidden lg:block">
          <div className="overflow-hidden rounded-2xl border border-aipify-border bg-gradient-to-br from-[#111827] to-[#0a0e14] p-1 shadow-2xl shadow-black/40">
            <div className="rounded-xl bg-[#0f1419] p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Support Operations</p>
                    <p className="text-xs text-aipify-text-muted">Live demo sequence</p>
                  </div>
                </div>
                <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-300">
                  Step {activeStep + 1} / {steps.length}
                </span>
              </div>

              <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {steps.map((step, i) => {
                  const isActive = i === activeStep;
                  const isPast = i < activeStep;
                  return (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => setActiveStep(i)}
                      className={`rounded-xl border p-4 text-left transition ${
                        isActive
                          ? "border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                          : isPast
                            ? "border-white/5 bg-white/[0.03] opacity-70"
                            : "border-white/5 bg-white/[0.02] opacity-50"
                      }`}
                    >
                      <span className="text-xs font-semibold text-aipify-text-muted">0{i + 1}</span>
                      <p className="mt-1 text-sm font-semibold text-white">{step.title}</p>
                      {isActive && (
                        <p className="mt-2 text-xs leading-relaxed text-aipify-text-secondary">{step.detail}</p>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">Active step</p>
                <p className="mt-1 text-base font-medium text-white">{steps[activeStep]?.title}</p>
                <p className="mt-2 text-sm text-aipify-text-secondary">{steps[activeStep]?.detail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
