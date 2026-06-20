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
          <div className="overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface p-1 shadow-lg">
            <div className="rounded-xl bg-aipify-surface-muted/60 p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-aipify-companion">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-aipify-text">Support Operations</p>
                    <p className="text-xs text-aipify-text-muted">Live demo sequence</p>
                  </div>
                </div>
                <span className="rounded-full bg-aipify-accent-soft px-3 py-1 text-xs font-medium text-aipify-companion">
                  Step {activeStep + 1} / {steps.length}
                </span>
              </div>

              <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-aipify-border">
                <div
                  className="h-full rounded-full bg-aipify-companion transition-all duration-500"
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
                          ? "border-aipify-companion/40 bg-aipify-accent-soft shadow-sm"
                          : isPast
                            ? "border-aipify-border bg-aipify-surface opacity-80"
                            : "border-aipify-border bg-aipify-surface-muted/60 opacity-70"
                      }`}
                    >
                      <span className="text-xs font-semibold text-aipify-text-muted">0{i + 1}</span>
                      <p className="mt-1 text-sm font-semibold text-aipify-text">{step.title}</p>
                      {isActive && (
                        <p className="mt-2 text-xs leading-relaxed text-aipify-text-secondary">{step.detail}</p>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-aipify-accent-muted bg-aipify-accent-soft/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">Active step</p>
                <p className="mt-1 text-base font-medium text-aipify-text">{steps[activeStep]?.title}</p>
                <p className="mt-2 text-sm text-aipify-text-secondary">{steps[activeStep]?.detail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
