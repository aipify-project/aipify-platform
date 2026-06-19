export type OnboardingChecklistItem = {
  id: string;
  label: string;
};

type OnboardingChecklistSectionProps = {
  title?: string;
  items: OnboardingChecklistItem[] | string[];
  compact?: boolean;
};

/** Phase 396 — shared onboarding checklist for marketing and platform surfaces. */
export default function OnboardingChecklistSection({
  title,
  items,
  compact = false,
}: OnboardingChecklistSectionProps) {
  const normalized = items.map((item, index) =>
    typeof item === "string" ? { id: `check-${index + 1}`, label: item } : item
  );

  return (
    <section aria-labelledby={title ? "onboarding-checklist-title" : undefined} className="border-y border-aipify-border bg-aipify-accent-soft/25">
      <div className={`mx-auto max-w-lg px-4 sm:px-6 lg:px-8 ${compact ? "py-10 lg:py-12" : "py-16 lg:py-20"}`}>
        {title ? (
          <h2 id="onboarding-checklist-title" className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
            {title}
          </h2>
        ) : null}
        <ul className={`space-y-3 ${title ? "mt-8" : ""}`}>
          {normalized.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm text-aipify-text-secondary"
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-aipify-companion/30 text-xs text-aipify-companion"
                aria-hidden="true"
              >
                ✓
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
