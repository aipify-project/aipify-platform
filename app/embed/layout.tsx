import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Website Kompis",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-transparent text-aipify-text">{children}</div>
  );
}
