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
        }
      `}</style>
      {children}
    </>
  );
}
