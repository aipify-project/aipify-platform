import HomepageSectionShell from "./HomepageSectionShell";

type TrustItem = { title: string; description: string };

type TrustFoundationStripProps = {
  items: TrustItem[];
};

const TRUST_ICONS = [
  "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
  "M15 10.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM4.5 19.25h15a1.5 1.5 0 001.5-1.5V17a6 6 0 00-12 0v.75a1.5 1.5 0 001.5 1.5z",
];

export default function TrustFoundationStrip({ items }: TrustFoundationStripProps) {
  return (
    <HomepageSectionShell alt>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((item, index) => (
          <li key={item.title} className="flex gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-aipify-border bg-aipify-surface"
              aria-hidden="true"
            >
              <svg className="h-4 w-4 text-aipify-companion" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={TRUST_ICONS[index % TRUST_ICONS.length]} />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-aipify-text">{item.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-aipify-text-secondary">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </HomepageSectionShell>
  );
}
