import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import type { EmptyStateModel, LearningStageModel } from "./types";

export function GuidedEmptyState({ model }: { model: EmptyStateModel }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D3C7FF] bg-[#F7F4FF] px-6 py-10 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#7C3AED] ring-1 ring-[#E8E4F2]">
        <Inbox className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-[#1E293B]">{model.title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#64748B]">{model.body}</p>
      {model.action ? (
        <Link
          href={model.action.href}
          className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] focus-visible:ring-offset-2"
        >
          {model.action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function LearningPath({
  title,
  support,
  stages,
}: {
  title: string;
  support: string;
  stages: LearningStageModel[];
}) {
  return (
    <section aria-labelledby="sales-learning-path" className="rounded-2xl border border-[#E8E4F2] bg-white p-5 sm:p-6">
      <h2 id="sales-learning-path" className="text-2xl font-semibold tracking-tight text-[#1E293B]">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#64748B]">{support}</p>
      <ol className="mt-5 grid gap-3 lg:grid-cols-3">
        {stages.map((stage, index) => (
          <li key={stage.id} className="flex h-full flex-col rounded-2xl bg-[#F3EDFF] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5538D3]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-[#1E293B]">{stage.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[#475569]">{stage.body}</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#7C3AED]" aria-hidden />
              {stage.status}
            </p>
            {stage.action ? (
              <Link
                href={stage.action.href}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#5538D3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE]"
              >
                {stage.action.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function LearningLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#5538D3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE]"
    >
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
