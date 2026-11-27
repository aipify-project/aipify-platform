"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { GuidanceIcon } from "./icons";
import type { GuidanceStepModel } from "./types";

/**
 * Client-only step picker. Selecting a step explains it. Nothing is sent.
 */
export function SalesGuidanceStepper({
  label,
  steps,
  whyLabel,
  sayLabel,
  exampleLabel,
  notice,
  avoidLabel,
  avoid,
}: {
  label: string;
  steps: GuidanceStepModel[];
  whyLabel: string;
  sayLabel: string;
  exampleLabel: string;
  notice?: string;
  avoidLabel?: string;
  avoid?: string;
}) {
  const [activeId, setActiveId] = useState(steps[0]?.id ?? "");
  const baseId = useId();
  if (steps.length === 0) return null;
  const active = steps.find((step) => step.id === activeId) ?? steps[0];

  return (
    <section aria-label={label} className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
        <div className="rounded-2xl border border-[#E8E4F2] bg-white p-3 shadow-[0_1px_2px_rgba(30,24,60,0.04)] sm:p-4">
          <ol className="space-y-2">
            {steps.map((step) => {
              const selected = step.id === active.id;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    id={`${baseId}-${step.id}-tab`}
                    aria-controls={`${baseId}-panel`}
                    aria-pressed={selected}
                    onClick={() => setActiveId(step.id)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] ${
                      selected ? "bg-[#F3EDFF] text-[#1E293B]" : "hover:bg-[#F7F4FF]"
                    }`}
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#7C3AED] ring-1 ring-[#E8E4F2]">
                      <GuidanceIcon name={step.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                        {step.indexLabel}
                      </span>
                      <span className="mt-0.5 block text-base font-semibold text-[#1E293B]">{step.title}</span>
                      {selected ? (
                        <span className="mt-1 block text-sm leading-relaxed text-[#64748B]">{step.summary}</span>
                      ) : null}
                    </span>
                  </button>
                  {selected ? (
                    <div className="mt-2 lg:hidden">
                      <StepDetail
                        step={active}
                        whyLabel={whyLabel}
                        sayLabel={sayLabel}
                        exampleLabel={exampleLabel}
                        avoidLabel={avoidLabel}
                        avoid={avoid}
                        panelId={`${baseId}-panel-mobile-${step.id}`}
                        labelledBy={`${baseId}-${step.id}-tab`}
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
        <div className="hidden lg:block">
          <StepDetail
            step={active}
            whyLabel={whyLabel}
            sayLabel={sayLabel}
            exampleLabel={exampleLabel}
            avoidLabel={avoidLabel}
            avoid={avoid}
            panelId={`${baseId}-panel`}
            labelledBy={`${baseId}-${active.id}-tab`}
          />
        </div>
      </div>
      {notice ? <p className="text-sm text-[#64748B]">{notice}</p> : null}
    </section>
  );
}

function StepDetail({
  step,
  whyLabel,
  sayLabel,
  exampleLabel,
  avoidLabel,
  avoid,
  panelId,
  labelledBy,
}: {
  step: GuidanceStepModel;
  whyLabel: string;
  sayLabel: string;
  exampleLabel: string;
  avoidLabel?: string;
  avoid?: string;
  panelId: string;
  labelledBy: string;
}) {
  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={labelledBy}
      className="rounded-2xl bg-[#F3EDFF] p-5 sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5538D3]">{step.indexLabel}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1E293B]">{step.title}</h2>
      <dl className="mt-5 space-y-4">
        <div>
          <dt className="text-sm font-semibold text-[#1E293B]">{whyLabel}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-[#475569]">{step.why}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[#1E293B]">{sayLabel}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-[#475569]">{step.say}</dd>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-[#E8E4F2]">
          <dt className="text-sm font-semibold text-[#1E293B]">{exampleLabel}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-[#475569]">{step.example}</dd>
        </div>
        {avoid && avoidLabel ? (
          <div>
            <dt className="text-sm font-semibold text-[#1E293B]">{avoidLabel}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-[#475569]">{avoid}</dd>
          </div>
        ) : null}
      </dl>
      {step.action ? (
        <Link
          href={step.action.href}
          className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] focus-visible:ring-offset-2"
        >
          {step.action.label}
        </Link>
      ) : null}
    </div>
  );
}
