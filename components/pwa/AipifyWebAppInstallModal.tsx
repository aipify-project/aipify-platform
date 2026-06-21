"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { AppWindow, MonitorSmartphone, Shield, Sparkles, Zap } from "lucide-react";
import { APP_WEB_APP_INSTALL_ARTICLE_PATH } from "@/lib/pwa/constants";
import { usePwaInstall } from "./PwaInstallProvider";
import type { PwaInstallLabels } from "@/lib/pwa/types";

const BENEFIT_ICONS = [Zap, AppWindow, Shield, MonitorSmartphone, Sparkles] as const;

type AipifyWebAppInstallModalProps = {
  labels: PwaInstallLabels;
};

export function AipifyWebAppInstallModal({ labels }: AipifyWebAppInstallModalProps) {
  const { modalOpen, modalPhase, confirmInstall, dismissModal } = usePwaInstall();
  const titleId = useId();
  const primaryRef = useRef<HTMLButtonElement>(null);

  const benefits = [labels.benefit1, labels.benefit2, labels.benefit3, labels.benefit4, labels.benefit5];
  const guidance = labels.modalGuidance;

  useEffect(() => {
    if (!modalOpen) return;
    primaryRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismissModal();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, dismissModal]);

  if (!modalOpen) return null;

  const title =
    modalPhase === "manual"
      ? guidance.manualTitle
      : modalPhase === "unsupported"
        ? guidance.unsupportedTitle
        : labels.modalTitle;

  const description =
    modalPhase === "manual"
      ? guidance.manualDescription
      : modalPhase === "unsupported"
        ? guidance.unsupportedDescription
        : labels.modalDescription;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]"
        aria-label={labels.notNow}
        onClick={dismissModal}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-xl font-semibold text-gray-900">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{description}</p>

        {modalPhase === "benefits" ? (
          <>
            <ul className="mt-6 space-y-3">
              {benefits.map((benefit, index) => {
                const Icon = BENEFIT_ICONS[index] ?? Sparkles;
                return (
                  <li key={benefit} className="flex gap-3 text-sm text-gray-700">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-violet-200 text-violet-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="flex min-h-[44px] items-center leading-relaxed">{benefit}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-xs text-gray-500">{labels.browserConfirmation}</p>
          </>
        ) : null}

        {modalPhase === "manual" ? (
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-gray-700">
            <li>{guidance.manualStep1}</li>
            <li>{guidance.manualStep2}</li>
            <li>{guidance.manualStep3}</li>
          </ol>
        ) : null}

        {modalPhase === "unsupported" ? (
          <p className="mt-5 text-sm text-gray-600">{guidance.unsupportedHint}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          {modalPhase === "benefits" ? (
            <button
              ref={primaryRef}
              type="button"
              onClick={() => void confirmInstall()}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              {labels.continueInstall}
            </button>
          ) : (
            <button
              ref={primaryRef}
              type="button"
              onClick={dismissModal}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              {guidance.close}
            </button>
          )}
          <button
            type="button"
            onClick={dismissModal}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            {labels.notNow}
          </button>
        </div>

        <Link
          href={APP_WEB_APP_INSTALL_ARTICLE_PATH}
          className="mt-4 inline-flex text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          {labels.guideLink}
        </Link>
      </div>
    </div>
  );
}
