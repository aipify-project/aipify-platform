"use client";

import { useEffect } from "react";
import { stopAllMediaCaptureTracks } from "@/lib/presence/unified-notification-feed/media-capture-registry";
import {
  useCompanionExperience,
  useCompanionPanelKeepMounted,
} from "./CompanionExperienceProvider";
import { CompanionPanel } from "./CompanionPanel";

export function CompanionDrawer() {
  const {
    open,
    drawerExpanded,
    closeDrawer,
    labels,
    locale,
    pathname,
    drawerQuery,
    drawerConversationId,
  } = useCompanionExperience();
  const keepMounted = useCompanionPanelKeepMounted();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeDrawer]);

  useEffect(() => {
    if (open) return;
    stopAllMediaCaptureTracks("companion_drawer_closed");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const mobile = window.matchMedia("(max-width: 639px)");
    function applyLock() {
      document.body.style.overflow = mobile.matches ? "hidden" : "";
    }
    applyLock();
    mobile.addEventListener("change", applyLock);
    return () => {
      mobile.removeEventListener("change", applyLock);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!keepMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end ${
        open ? "" : "pointer-events-none invisible"
      }`}
      role="presentation"
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        className={`absolute inset-0 bg-slate-900/25 backdrop-blur-[1px] sm:bg-slate-900/20 ${
          open ? "" : "pointer-events-none"
        }`}
        aria-label={labels.closeDrawer}
        onClick={closeDrawer}
      />
      <div
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label={labels.ariaCompanionPanel}
        className={`relative flex h-full w-full max-w-[100vw] flex-col bg-aipify-canvas shadow-2xl ${
          drawerExpanded ? "sm:w-[min(calc(100vw-1.5rem),1400px)]" : "sm:w-[min(760px,100vw)]"
        }`}
      >
        <CompanionPanel
          labels={labels}
          locale={locale}
          pathname={pathname}
          mode="drawer"
          onClose={closeDrawer}
          initialQuery={drawerQuery ?? undefined}
          initialConversationId={drawerConversationId ?? undefined}
          panelVisible={open}
        />
      </div>
    </div>
  );
}
