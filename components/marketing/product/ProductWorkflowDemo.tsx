"use client";

import { useEffect, useState } from "react";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { trackEvent } from "@/lib/marketing/analytics";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";

type ProductWorkflowDemoProps = ProductPageContent["workflow"];

const STEP_MS = 3200;

export default function ProductWorkflowDemo({ title, subtitle, examples, controls }: ProductWorkflowDemoProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const example = examples[exampleIndex];
  const steps = example?.steps ?? [];
  const step = steps[activeStep];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    setActiveStep(0);
  }, [exampleIndex]);

  useEffect(() => {
    if (reducedMotion || paused || steps.length === 0) return;
    const id = window.setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length;
        trackEvent("demo_step_view", { step: next + 1, example: example?.id });
        return next;
      });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, steps.length, example?.id]);

  const goPrev = () => {
    setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
    setPaused(true);
  };

  const goNext = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
    setPaused(true);
  };

  if (examples.length === 0) return null;

  return (
    <section id="workflow" className="scroll-mt-20 border-y border-aipify-border" aria-labelledby="product-workflow-title">
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <div className="max-w-2xl">
          <h2 id="product-workflow-title" className={PublicMarketingClasses.sectionHeading}>
            {title}
          </h2>
          {subtitle ? <p className={PublicMarketingClasses.sectionSubtitle}>{subtitle}</p> : null}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {examples.map((ex, i) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                setExampleIndex(i);
                setPaused(true);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-aipify-focus ${
                i === exampleIndex
                  ? "bg-aipify-companion text-white"
                  : "border border-aipify-border bg-aipify-surface text-aipify-text-secondary hover:text-aipify-text"
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg">
          <div className="grid lg:grid-cols-[1fr_minmax(0,22rem)]">
            <div className="border-b border-aipify-border p-6 lg:border-b-0 lg:border-r">
              <p className="text-sm font-semibold text-aipify-text">{example?.label}</p>
              {example?.disclaimer ? (
                <p className="mt-1 text-xs text-aipify-text-muted">{example.disclaimer}</p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-2">
                {steps.map((s, i) => (
                  <button
                    key={`${s.title}-${i}`}
                    type="button"
                    onClick={() => {
                      setActiveStep(i);
                      setPaused(true);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-aipify-focus ${
                      i === activeStep
                        ? "bg-aipify-accent-soft text-aipify-companion ring-1 ring-aipify-accent-muted"
                        : "border border-aipify-border bg-aipify-surface-muted text-aipify-text-secondary hover:text-aipify-text"
                    }`}
                    aria-current={i === activeStep ? "step" : undefined}
                  >
                    {i + 1}. {s.title}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  className="rounded-lg border border-aipify-border bg-aipify-surface px-3 py-1.5 text-sm font-medium text-aipify-text hover:bg-aipify-surface-muted"
                >
                  {controls.previous}
                </button>
                {!reducedMotion ? (
                  <button
                    type="button"
                    onClick={() => setPaused((p) => !p)}
                    className="rounded-lg border border-aipify-border bg-aipify-surface px-3 py-1.5 text-sm font-medium text-aipify-companion hover:bg-aipify-accent-soft"
                  >
                    {paused ? controls.play : controls.pause}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg border border-aipify-border bg-aipify-surface px-3 py-1.5 text-sm font-medium text-aipify-text hover:bg-aipify-surface-muted"
                >
                  {controls.next}
                </button>
              </div>
            </div>

            <div className="border-t border-aipify-border bg-aipify-accent-soft/30 p-6 lg:border-t-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <p className="text-xs font-medium uppercase tracking-wide text-aipify-companion">Live step</p>
              </div>
              <p className="mt-4 text-lg font-semibold text-aipify-text">{step?.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step?.detail}</p>

              {step?.prepared || step?.approval || step?.audit ? (
                <div className="mt-6 space-y-3">
                  {step.prepared ? (
                    <div className="rounded-lg border border-aipify-border bg-aipify-surface px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">Aipify prepared</p>
                      <p className="mt-1 text-sm text-aipify-text">{step.prepared}</p>
                    </div>
                  ) : null}
                  {step.approval ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Approval</p>
                      <p className="mt-1 text-sm text-amber-900">{step.approval}</p>
                    </div>
                  ) : null}
                  {step.audit ? (
                    <div className="rounded-lg border border-aipify-border bg-aipify-surface-muted px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-aipify-text-secondary">Audit</p>
                      <p className="mt-1 text-sm text-aipify-text">{step.audit}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
