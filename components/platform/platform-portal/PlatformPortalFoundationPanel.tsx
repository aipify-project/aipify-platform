import Link from "next/link";
import { PlatformLayoutClasses } from "@/lib/design";
import { PlatformPageFrame } from "@/components/platform/PlatformPageFrame";

type PlatformPortalFoundationPanelProps = {
  title: string;
  subtitle: string;
  structureNote: string;
  backLabel: string;
  backHref?: string;
};

export function PlatformPortalFoundationPanel({
  title,
  subtitle,
  structureNote,
  backLabel,
  backHref = "/platform",
}: PlatformPortalFoundationPanelProps) {
  return (
    <PlatformPageFrame>
      <div className={PlatformLayoutClasses.pageHeader}>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {backLabel}
        </Link>
        <h1 className={`mt-4 ${PlatformLayoutClasses.pageTitle}`}>{title}</h1>
        <p className={PlatformLayoutClasses.pageSubtitle}>{subtitle}</p>
      </div>
      <p className={`${PlatformLayoutClasses.cardMuted} text-sm text-slate-800 dark:text-slate-200`}>
        {structureNote}
      </p>
    </PlatformPageFrame>
  );
}
