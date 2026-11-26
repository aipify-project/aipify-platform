import { CheckCircle2, CircleDashed, Clock3, MinusCircle } from "lucide-react";
import type { ProductCardStatus } from "@/lib/commercial-packages/product-hero";

type ProductStatusBadgeProps = {
  status: ProductCardStatus;
  labels: {
    active: string;
    notActive: string;
    notLicensed: string;
    underReview: string;
    planned: string;
    available: string;
    unknown: string;
  };
};

export function ProductStatusBadge({ status, labels }: ProductStatusBadgeProps) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F7F0] px-2.5 py-1 text-xs font-semibold text-[var(--app-positive)] ring-1 ring-[#B7E4CF]">
        <CheckCircle2 aria-hidden className="size-3.5" strokeWidth={2.25} />
        {labels.active}
      </span>
    );
  }

  if (status === "under_review" || status === "planned") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-xs font-medium text-[var(--app-pending)] ring-1 ring-[#F5D4A3]">
        <Clock3 aria-hidden className="size-3.5" strokeWidth={2} />
        {status === "planned" ? labels.planned : labels.underReview}
      </span>
    );
  }

  if (status === "available") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--app-primary-soft)] px-2.5 py-1 text-xs font-medium text-[var(--app-primary)] ring-1 ring-[var(--app-border-accent)]">
        <CircleDashed aria-hidden className="size-3.5" strokeWidth={2} />
        {labels.available}
      </span>
    );
  }

  const text =
    status === "not_licensed"
      ? labels.notLicensed
      : status === "not_active"
        ? labels.notActive
        : labels.unknown;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--app-soft-surface)] px-2.5 py-1 text-xs font-medium text-[var(--app-text-muted)] ring-1 ring-[var(--app-border)]">
      <MinusCircle aria-hidden className="size-3.5" strokeWidth={2} />
      {text}
    </span>
  );
}
