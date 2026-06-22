"use client";

import type { ReactNode, RefObject } from "react";

type CompanionChatScrollViewportProps = {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  chatEndRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  containerClassName?: string;
  viewportClassName?: string;
  showJumpToLatest: boolean;
  onJumpToLatest: () => void;
  scrollToLatestLabel: string;
  scrollToLatestAriaLabel: string;
  children: ReactNode;
  beforeViewport?: ReactNode;
};

export function CompanionChatScrollViewport({
  scrollContainerRef,
  chatEndRef,
  onScroll,
  containerClassName,
  viewportClassName,
  showJumpToLatest,
  onJumpToLatest,
  scrollToLatestLabel,
  scrollToLatestAriaLabel,
  children,
  beforeViewport,
}: CompanionChatScrollViewportProps) {
  return (
    <div ref={scrollContainerRef} onScroll={onScroll} className={containerClassName}>
      {beforeViewport}
      <div className={viewportClassName}>
        {children}

        {showJumpToLatest ? (
          <div className="pointer-events-none sticky bottom-3 z-10 mt-4 flex justify-center">
            <button
              type="button"
              onClick={onJumpToLatest}
              className="pointer-events-auto inline-flex min-h-10 items-center rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-aipify-companion shadow-sm hover:bg-violet-50"
              aria-label={scrollToLatestAriaLabel}
            >
              {scrollToLatestLabel}
            </button>
          </div>
        ) : null}

        <div ref={chatEndRef} aria-hidden="true" />
      </div>
    </div>
  );
}
