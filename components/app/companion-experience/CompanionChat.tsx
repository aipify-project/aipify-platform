"use client";

import type { CompanionChatMessage, CompanionExperienceLabels } from "@/lib/app/companion/types";
import Link from "next/link";
import { CompanionIcon } from "./CompanionIcon";

type CompanionChatProps = {
  messages: CompanionChatMessage[];
  loading: boolean;
  labels: CompanionExperienceLabels;
};

export function CompanionChat({ messages, loading, labels }: CompanionChatProps) {
  if (messages.length === 0 && !loading) return null;

  return (
    <section className="mt-6 space-y-4" aria-live="polite">
      {messages.map((msg) =>
        msg.role === "user" ? (
          <div key={msg.id} className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-slate-100 px-4 py-3 text-sm text-aipify-text">
              {msg.content}
            </div>
          </div>
        ) : (
          <div key={msg.id} className="flex items-start gap-3">
            <CompanionIcon size={32} className="mt-1 shrink-0" />
            <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-violet-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-sm text-aipify-text">{msg.content}</p>
              {msg.steps && msg.steps.length > 0 ? (
                <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-aipify-text-secondary">
                  {msg.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              ) : null}
              {msg.ctas && msg.ctas.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.ctas.map((cta) => (
                    <Link
                      key={cta.href + cta.label}
                      href={cta.href}
                      className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-aipify-companion hover:bg-violet-100"
                    >
                      {cta.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )
      )}

      {loading ? (
        <div className="flex items-start gap-3">
          <CompanionIcon size={32} withRing className="mt-1 shrink-0 motion-safe:animate-pulse" />
          <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3">
            <span className="sr-only">{labels.verifiedContext}</span>
            <div className="flex gap-1" aria-hidden="true">
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
