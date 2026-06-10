import type { CustomerHealth } from "@/lib/platform/ai-dashboard";

type CustomerHealthBadgeProps = {
  health: CustomerHealth;
  labels: {
    healthy: string;
    attention: string;
    atRisk: string;
  };
};

const HEALTH_META: Record<
  CustomerHealth,
  { icon: string; className: string }
> = {
  healthy: {
    icon: "🟢",
    className: "text-emerald-700",
  },
  attention: {
    icon: "🟡",
    className: "text-amber-700",
  },
  at_risk: {
    icon: "🔴",
    className: "text-rose-700",
  },
};

export default function CustomerHealthBadge({ health, labels }: CustomerHealthBadgeProps) {
  const meta = HEALTH_META[health];
  const label =
    health === "healthy"
      ? labels.healthy
      : health === "attention"
        ? labels.attention
        : labels.atRisk;

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${meta.className}`}>
      <span aria-hidden="true">{meta.icon}</span>
      {label}
    </span>
  );
}
