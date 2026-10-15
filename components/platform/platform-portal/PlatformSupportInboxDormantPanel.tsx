"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  PLATFORM_SUPPORT_INBOX_PRODUCT_TABS,
  type PlatformSupportInboxProductTab,
  getPlatformSupportInboxUiGateState,
} from "@/lib/platform-portal/support-inbox-ui-contract";
import { PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK } from "@/lib/platform-portal/support-tickets-read-adapter";
import type { PlatformSupportInboxLabels } from "@/lib/platform-portal/support-inbox-labels";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

type Props = {
  labels: PlatformSupportInboxLabels;
  /** Legacy queue panel rendered below the dormant APP SoT shell. */
  legacyQueue: ReactNode;
};

const STATUS_CARD_KEYS = ["open", "waiting", "resolved", "total"] as const;

function channelLinked(tab: PlatformSupportInboxProductTab): boolean {
  return PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK[tab].linked === true;
}

export function PlatformSupportInboxDormantPanel({ labels, legacyQueue }: Props) {
  const [activeTab, setActiveTab] =
    useState<PlatformSupportInboxProductTab>("kompis_bedrift_app");
  const gate = useMemo(() => getPlatformSupportInboxUiGateState(), []);
  const activeChannel = labels.channels[activeTab];
  const linked = channelLinked(activeTab);

  return (
    <div
      className="w-full space-y-8 rounded-3xl bg-violet-50/50 px-4 py-6 sm:px-6 lg:px-8"
      data-support-inbox="dormant"
      data-live-tickets={gate.liveTickets ? "true" : "false"}
    >
      <header className="space-y-3">
        <h1 className={AipifyShellClasses.pageTitle}>{labels.title}</h1>
        <p className={`${AipifyShellClasses.pageSubtitle} max-w-3xl`}>
          {labels.subtitle}
        </p>
      </header>

      <section
        className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <h2 className="text-sm font-semibold tracking-tight">
          {labels.dormantBannerTitle}
        </h2>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-amber-900/90">
          {labels.dormantBannerBody}
        </p>
      </section>

      <nav
        className="flex flex-wrap gap-2"
        aria-label={labels.filters.channel}
        role="tablist"
      >
        {PLATFORM_SUPPORT_INBOX_PRODUCT_TABS.map((tab) => {
          const isActive = tab === activeTab;
          const isLinked = channelLinked(tab);
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={
                isActive
                  ? "inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-sky-100 px-4 py-2.5 text-sm font-semibold text-sky-950 shadow-sm"
                  : "inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
              }
            >
              <span>{labels.channels[tab].label}</span>
              <span
                className={
                  isLinked
                    ? "rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800"
                    : "rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
                }
              >
                {isLinked ? labels.linkStatus.linked : labels.linkStatus.notLinked}
              </span>
            </button>
          );
        })}
      </nav>

      <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
        {linked ? activeChannel.statusLinked : activeChannel.statusNotLinked}{" "}
        {activeChannel.note}
      </p>

      <section aria-label={labels.statusCards.scopeNote}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATUS_CARD_KEYS.map((key) => (
            <article
              key={key}
              className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {labels.statusCards[key]}
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-400">
                {labels.statusCards.unavailable}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-2 max-w-3xl text-xs text-slate-500">
          {labels.statusCards.scopeNote}
        </p>
      </section>

      <section className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-4">
          <label className="block text-xs font-medium text-slate-600">
            {labels.filters.status}
            <select
              disabled
              className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
              aria-disabled="true"
            >
              <option>—</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-slate-600">
            {labels.filters.priority}
            <select
              disabled
              className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
              aria-disabled="true"
            >
              <option>—</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-slate-600 lg:col-span-2">
            {labels.filters.search}
            <input
              disabled
              type="search"
              placeholder={labels.filters.searchPlaceholder}
              className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
              aria-disabled="true"
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-slate-500">{labels.filters.disabledHint}</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
          <div className="border-b border-violet-50 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              {labels.list.title}
            </h2>
          </div>
          <div className="px-5 py-10 text-center">
            <h3 className="text-base font-semibold text-slate-900">
              {labels.list.emptyTitle}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              {labels.list.emptyBody}
            </p>
          </div>
          <div className="hidden border-t border-violet-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:grid sm:grid-cols-6 sm:gap-3">
            <span>{labels.list.columns.customer}</span>
            <span className="sm:col-span-2">{labels.list.columns.subject}</span>
            <span>{labels.list.columns.channel}</span>
            <span>{labels.list.columns.status}</span>
            <span>{labels.list.columns.updated}</span>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            {labels.detail.title}
          </h2>
          <p className="text-sm text-slate-600">{labels.detail.empty}</p>
          <div className="space-y-3">
            {[
              labels.detail.originalLanguage,
              labels.detail.norwegianTranslation,
              labels.detail.replyTranslation,
              labels.detail.history,
            ].map((block) => (
              <div
                key={block}
                className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-500"
              >
                {block}
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {labels.detail.internalNotes}
              </p>
              <p className="mt-2 text-sm text-slate-400">—</p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
                {labels.detail.customerVisibleReply}
              </p>
              <p className="mt-2 text-sm text-sky-700/70">—</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-amber-800">
            {labels.detail.approveBeforeSend}
          </p>
          <p className="text-xs text-slate-500">{labels.detail.localeGap}</p>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500"
          >
            {labels.detail.sendDisabled}
          </button>
        </section>
      </div>

      <section className="space-y-4 border-t border-violet-100 pt-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {labels.legacySectionTitle}
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            {labels.legacySectionSubtitle}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {legacyQueue}
        </div>
      </section>
    </div>
  );
}
