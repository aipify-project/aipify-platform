import type { ReactNode } from "react";

export default function WebsiteKompisEmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        html, body {
          background: transparent !important;
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
          width: 100%;
          color-scheme: normal;
        }
        /* Closed chrome must not inherit a full-viewport paint surface. */
        html[data-ak-shell="closed"],
        html[data-ak-shell="closed"] body {
          height: 72px !important;
          width: 72px !important;
          min-height: 72px !important;
          max-height: 72px !important;
        }
      `}</style>
      {children}
    </>
  );
}
