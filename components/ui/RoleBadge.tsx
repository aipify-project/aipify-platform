import {
  normalizeRoleBadgeVariant,
  ROLE_BADGE_CLASSES,
} from "@/lib/app/role-badges";

type RoleBadgeProps = {
  roleKey: string;
  label: string;
  className?: string;
};

export function RoleBadge({ roleKey, label, className = "" }: RoleBadgeProps) {
  const variant = normalizeRoleBadgeVariant(roleKey);
  const colors = ROLE_BADGE_CLASSES[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${colors} ${className}`}
    >
      {label}
    </span>
  );
}
