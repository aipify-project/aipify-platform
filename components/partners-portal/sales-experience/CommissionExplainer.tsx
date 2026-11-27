import { CircleDot } from "lucide-react";
import type { CommissionStepModel, ExplainerCardModel } from "./types";

/** Pedagogical status order. Does not calculate or write a ledger amount. */
export function CommissionStatusTimeline({
  title,
  steps,
}: {
  title: string;
  steps: CommissionStepModel[];
}) {
  return (
    <section aria-labelledby="sales-commission-timeline" className="space-y-3">
      <h2 id="sales-commission-timeline" className="text-xl font-semibold text-[#1E293B]">
        {title}
      </h2>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => (
          <li key={step.id} className="rounded-2xl border border-[#E8E4F2] bg-white p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
              <CircleDot className="h-4 w-4 shrink-0 text-[#7C3AED]" aria-hidden />
              <span className="text-xs text-[#7C3AED]">{String(index + 1).padStart(2, "0")}</span>
              {step.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CommissionExplainerCard({ card }: { card: ExplainerCardModel }) {
  return (
    <article className="rounded-2xl border border-[#E8E4F2] bg-white p-5">
      <h3 className="text-base font-semibold text-[#1E293B]">{card.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{card.body}</p>
    </article>
  );
}
