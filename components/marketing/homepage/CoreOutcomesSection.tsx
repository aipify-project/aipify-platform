import type { HomepageRedesignContent } from "@/lib/marketing/parse-homepage";

const ICONS = [
  "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
];

type CoreOutcomesSectionProps = {
  title: string;
  items: HomepageRedesignContent["coreOutcomes"]["items"];
};

export default function CoreOutcomesSection({ title, items }: CoreOutcomesSectionProps) {
  return (
    <section aria-labelledby="core-outcomes-title">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="core-outcomes-title" className="max-w-2xl text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item.title}
              className="rounded-2xl border border-aipify-border bg-aipify-surface p-7 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-aipify-accent-soft">
                <svg
                  className="h-6 w-6 text-aipify-companion"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[index % ICONS.length]} />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-aipify-text">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-aipify-text-secondary">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
