import type { HTMLAttributes, ReactNode } from "react";
import { SELLER_PORTAL_LAYOUT } from "@/lib/partners-portal/design-tokens";

type AipifyCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  as?: "div" | "section" | "article";
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

const PAD = {
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-7",
} as const;

export function AipifyCard({
  children,
  className = "",
  padding = "md",
  as: Tag = "section",
  ...rest
}: AipifyCardProps) {
  return (
    <Tag
      {...rest}
      className={`${SELLER_PORTAL_LAYOUT.radiusCard} ${SELLER_PORTAL_LAYOUT.borderClass} ${SELLER_PORTAL_LAYOUT.surfaceClass} ${SELLER_PORTAL_LAYOUT.shadowCard} ${PAD[padding]} ${className}`}
    >
      {children}
    </Tag>
  );
}
