import Link from "next/link";
import { marketingDataAttr } from "@/lib/marketing/analytics";

type PilotStorySectionProps = {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  cta: string;
};

export default function PilotStorySection({
  title,
  subtitle,
  description,
  highlights,
  cta,
}: PilotStorySectionProps) {
  return (
    <section aria-labelledby="pilot-story-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-3xl border border-aipify-border bg-gradient-to-br from-[#111827] via-[#0f1419] to-[#0a0e14]">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">{subtitle}</p>
              <h2 id="pilot-story-title" className="mt-3 text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-aipify-text-secondary leading-relaxed">{description}</p>
              <Link
                href="/pilot"
                className="mt-8 inline-flex items-center rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                {...marketingDataAttr("cta_click", "pilot_learn_more")}
              >
                {cta}
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="border-t border-aipify-border bg-white/[0.02] p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-sm font-semibold text-white">Operational validation</p>
              <ul className="mt-6 space-y-4">
                {highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-aipify-text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
