import type { ReactNode } from "react";
import { AppLayoutClasses } from "@/lib/design/app-layout";

type AppContentWidthProps = {
  children: ReactNode;
  className?: string;
};

/** Canonical wide APP content frame (~1560px). Use inside DashboardShell main. */
export function AppContentWidth({ children, className = "" }: AppContentWidthProps) {
  return (
    <div className={`${AppLayoutClasses.pageWidth} ${AppLayoutClasses.sectionGap} ${className}`.trim()}>
      {children}
    </div>
  );
}
