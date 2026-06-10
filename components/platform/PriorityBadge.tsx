import type { ExecutivePriority } from "@/lib/platform/executive-intelligence";
import { PRIORITY_STYLES } from "@/lib/platform/executive-intelligence";

type PriorityBadgeProps = {
  priority: ExecutivePriority;
  label: string;
};

export default function PriorityBadge({ priority, label }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${PRIORITY_STYLES[priority]}`}
    >
      {label}
    </span>
  );
}
