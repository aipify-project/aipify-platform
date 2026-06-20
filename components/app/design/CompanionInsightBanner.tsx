import AipifyPulse from "@/components/branding/AipifyPulse";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type CompanionInsightBannerProps = {
  principle: string;
  label: string;
};

export function CompanionInsightBanner({ principle, label }: CompanionInsightBannerProps) {
  return (
    <aside
      className={`${AppPremiumShell.elevatedCard} flex gap-4 border-violet-200/80 bg-gradient-to-r from-violet-50/90 to-aipify-surface p-5`}
      aria-label={label}
    >
      <div className="relative shrink-0">
        <span
          className="pointer-events-none absolute -inset-1 rounded-full border border-violet-300/40 motion-safe:animate-[aipify-presence-ring_2.8s_ease-in-out_infinite] motion-reduce:animate-none"
          aria-hidden="true"
        />
        <AipifyPulse size="sm" variant="mono" title="Aipify" aria-label="Aipify Companion" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">{label}</p>
        <p className="mt-2 text-sm leading-relaxed text-aipify-text sm:text-base">{principle}</p>
      </div>
    </aside>
  );
}
