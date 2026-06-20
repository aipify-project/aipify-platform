"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/marketing/analytics";

type DemoStep = { title: string; detail: string };

type HomepageWorkflowDemoProps = {
  title: string;
  subtitle: string;
  steps: DemoStep[];
};

const STEP_MS = 3200;

export default function HomepageWorkflowDemo({ title, subtitle, steps }: HomepageWorkflowDemoProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused || steps.length === 0) return;
    const id = window.setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length;
        trackEvent("demo_step_view", { step: next + 1 });
        return next;
      });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, steps.length]);

  const step = steps[activeStep];

  return (
    <section className="border-y border-aipify-border" aria-labelledby="workflow-demo-title">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 id="workflow-demo-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          {subtitle ? <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg">
          <div className="grid lg:grid-cols-[1fr_minmax(0,22rem)]">
            <div className="border-b border-aipify-border p-6 lg:border-b-0 lg:border-r">
              <p className="text-sm font-semibold text-aipify-text">Support workflow</p>
              <p className="mt-1 text-sm text-aipify-text-secondary">
                A realistic path from request to governed response.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {steps.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => setActiveStep(i)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-aipify-focus ${
                      i === activeStep
                        ? "bg-aipify-companion text-white"
                        : "border border-aipify-border bg-aipify-surface-muted text-aipify-text-secondary hover:text-aipify-text"
                    }`}
                    aria-current={i === activeStep ? "step" : undefined}
                  >
                    {i + 1}. {s.title}
                  </button>
                ))}
              </div>
              {!reducedMotion ? (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="mt-4 text-sm font-medium text-aipify-accent hover:text-aipify-companion"
                >
                  {paused ? "Resume demo" : "Pause demo"}
                </button>
              ) : null}
            </div>

            <div className="bg-[#1e293b] p-6 text-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Live step</p>
              </div>
              <p className="mt-4 text-lg font-semibold text-white">{step?.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{step?.detail}</p>
              <div className="mt-6 rounded-lg border border-slate-600/80 bg-slate-800/80 px-4 py-3">
                <p className="text-xs font-medium text-violet-300">Aipify prepared</p>
                <p className="mt-1 text-sm text-slate-100">Draft ready · Awaiting human approval · Audit trail active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
