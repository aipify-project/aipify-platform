import type { ReactNode } from "react";

/**
 * Embed shell layout — first paint must be closed 72×72 transparent, not root canvas.
 * data-ak-shell is set by a blocking script before React hydrates (root layout owns <html>).
 */
export default function WebsiteKompisEmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{document.documentElement.setAttribute("data-ak-shell","closed");}catch(_e){}})();`,
        }}
      />
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
        /* Closed chrome must not inherit full-viewport root layout (h-full / min-h-full / canvas). */
        html[data-ak-shell="closed"],
        html[data-ak-shell="closed"] body {
          height: 72px !important;
          width: 72px !important;
          min-height: 72px !important;
          max-height: 72px !important;
          min-width: 72px !important;
          max-width: 72px !important;
          padding: 0 !important;
          margin: 0 !important;
          background: transparent !important;
          overflow: hidden !important;
        }
        html[data-ak-shell="closed"] body.min-h-full {
          min-height: 72px !important;
        }
        html[data-ak-shell="closed"] #__next,
        html[data-ak-shell="closed"] [data-ak-embed-root] {
          width: 72px !important;
          height: 72px !important;
          min-height: 0 !important;
          background: transparent !important;
          overflow: hidden !important;
        }
        /* Open shell: pad inside host iframe so Design V1 border/shadow is not clipped. */
        html[data-ak-shell="open"],
        html[data-ak-shell="open"] body {
          padding: 12px !important;
          box-sizing: border-box !important;
          background: transparent !important;
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          max-height: none !important;
          min-width: 0 !important;
          min-height: 0 !important;
        }
      `}</style>
      <div data-ak-embed-root className="h-full w-full bg-transparent">
        {children}
      </div>
    </>
  );
}
