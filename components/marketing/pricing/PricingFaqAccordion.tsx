"use client";

import { useId, useState } from "react";

type FaqItem = { question: string; answer: string };

type Props = {
  items: FaqItem[];
};

export default function PricingFaqAccordion({ items }: Props) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <dl className="divide-y divide-aipify-border rounded-2xl border border-aipify-border bg-aipify-surface shadow-sm">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-btn-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question}>
            <dt>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-aipify-text transition hover:bg-aipify-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-inset"
              >
                <span>{item.question}</span>
                <span className="shrink-0 text-aipify-companion" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </dt>
            <dd
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-4 text-sm leading-relaxed text-aipify-text-secondary motion-safe:transition-opacity"
            >
              {item.answer}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
