"use client";

import { useEffect } from "react";
import { useCompanionExperience } from "./CompanionExperienceProvider";
import { CompanionPanel } from "./CompanionPanel";

export function CompanionDrawer() {
  const { open, closeDrawer, labels, locale, pathname, drawerQuery } = useCompanionExperience();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeDrawer]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        aria-label={labels.closeDrawer}
        onClick={closeDrawer}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.ariaCompanionPanel}
        className="relative flex h-full w-full max-w-2xl flex-col bg-aipify-canvas shadow-2xl sm:max-w-xl lg:max-w-3xl motion-safe:translate-x-0"
      >
        <CompanionPanel
          labels={labels}
          locale={locale}
          pathname={pathname}
          mode="drawer"
          onClose={closeDrawer}
          initialQuery={drawerQuery ?? undefined}
        />
      </div>
    </div>
  );
}
