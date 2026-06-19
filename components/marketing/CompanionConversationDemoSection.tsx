"use client";

import { useState } from "react";

export type CompanionConversationExample = {
  id: string;
  question: string;
  answer: string;
};

type CompanionConversationDemoSectionProps = {
  title: string;
  examples: CompanionConversationExample[];
};

export default function CompanionConversationDemoSection({
  title,
  examples,
}: CompanionConversationDemoSectionProps) {
  const [activeId, setActiveId] = useState(examples[0]?.id ?? "");
  const active = examples.find((example) => example.id === activeId) ?? examples[0];

  if (!active) return null;

  return (
    <section aria-labelledby="companion-conversations-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="companion-conversations-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {examples.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => setActiveId(example.id)}
              aria-pressed={example.id === active.id}
              className={`rounded-full border px-4 py-2 text-left text-sm transition ${
                example.id === active.id
                  ? "border-aipify-companion/40 bg-aipify-accent-soft text-aipify-companion"
                  : "border-aipify-border bg-aipify-surface-muted/60 text-aipify-text-secondary hover:border-aipify-companion/20"
              }`}
            >
              {example.question}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4 rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-6">
          <div className="rounded-xl bg-aipify-surface px-4 py-3 text-sm text-aipify-text">{active.question}</div>
          <div className="rounded-xl border border-aipify-accent-muted bg-aipify-accent-soft/50 px-4 py-3 text-sm leading-relaxed text-aipify-text-secondary">
            {active.answer}
          </div>
        </div>
      </div>
    </section>
  );
}
