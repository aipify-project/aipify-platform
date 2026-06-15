import { STATUS_VISUAL } from "@/lib/payment-providers";

type ProviderStatusBadgeProps = {
  statusKey: string;
  label: string;
};

export function ProviderStatusBadge({ statusKey, label }: ProviderStatusBadgeProps) {
  const visual = STATUS_VISUAL[statusKey] ?? STATUS_VISUAL.pending_setup;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${visual.badge}`}
      role="status"
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${visual.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
