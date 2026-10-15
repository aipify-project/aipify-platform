import type { ReactNode } from "react";
import { PlatformLayoutClasses } from "@/lib/design";

type PlatformPageFrameProps = {
  children: ReactNode;
  className?: string;
  /** Dense tables / registries may prefer tighter vertical rhythm. */
  tight?: boolean;
};

/**
 * Shared Platform Admin page frame — full content width (customers fasit).
 * Use inside `/platform/*` only; DashboardShell already pads horizontally.
 */
export function PlatformPageFrame({ children, className = "", tight = false }: PlatformPageFrameProps) {
  const base = tight ? PlatformLayoutClasses.pageTight : PlatformLayoutClasses.page;
  return <div className={`${base}${className ? ` ${className}` : ""}`}>{children}</div>;
}
