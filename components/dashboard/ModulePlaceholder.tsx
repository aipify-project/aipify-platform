import { AipifyPulse } from "@/components/branding";
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
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-base text-gray-500">{subtitle}</p>
      <div
        className={`relative mt-8 overflow-hidden rounded-2xl border p-8 ${CUSTOMER_ACCENT.cardSurface}`}
      >
        <div className="absolute right-6 top-6 opacity-40">
          <AipifyPulse
            size="sm"
            title={pulseLabel}
            aria-label={pulseLabel}
          />
        </div>
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
