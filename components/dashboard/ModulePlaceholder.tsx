import { AipifyPulse } from "@/components/branding";
import { AIPIFY_BRAND } from "@/lib/branding/tokens";
import { CUSTOMER_ACCENT } from "@/lib/dashboard/customer-tokens";

type ModulePlaceholderProps = {
  title: string;
  subtitle: string;
  description?: string;
  comingSoon: string;
  pulseLabel: string;
};

export default function ModulePlaceholder({
  title,
  subtitle,
  description,
  comingSoon,
  pulseLabel,
}: ModulePlaceholderProps) {
  const { sidebarMark } = AIPIFY_BRAND;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-base text-gray-500">{subtitle}</p>
        </div>
        <AipifyPulse
          size={sidebarMark.pulseSize}
          variant="mono"
          opacity={sidebarMark.pulseOpacity}
          title={pulseLabel}
          aria-label={pulseLabel}
          className="shrink-0 text-violet-600/80"
        />
      </div>
      <div
        className={`relative mt-8 overflow-hidden rounded-2xl border p-8 ${CUSTOMER_ACCENT.cardSurface}`}
      >
        <p className="max-w-xl text-base leading-relaxed text-gray-600">
          {description ?? comingSoon}
        </p>
        {description && (
          <p className={`mt-6 text-sm font-medium ${CUSTOMER_ACCENT.badge}`}>
            {comingSoon}
          </p>
        )}
      </div>
    </div>
  );
}
