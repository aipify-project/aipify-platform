import type { Metadata } from "next";
import { PwaInstallShell } from "@/components/pwa/PwaInstallShell";
import { SystemNoticeRootProvider } from "@/components/providers/SystemNoticeRootProvider";
import { AIPIFY_GLOBAL_ICONS } from "@/lib/branding/favicon-metadata";
import { getLocale } from "@/lib/i18n/get-locale";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aipify works for you",
  description:
    "Aipify helps organizations streamline operations, support teams, automate approved workflows and make smarter decisions through intelligent business assistance.",
  metadataBase: new URL("https://aipify.ai"),
  icons: AIPIFY_GLOBAL_ICONS,
  openGraph: {
    title: "Aipify works for you",
    description:
      "Aipify Business Operating System — support, install, insights and commerce modules for professional organizations.",
    url: "https://aipify.ai",
    siteName: "Aipify",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aipify works for you",
    description:
      "Aipify Business Operating System — support, install, insights and commerce modules for professional organizations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SystemNoticeRootProvider>
          <PwaInstallShell>{children}</PwaInstallShell>
        </SystemNoticeRootProvider>
      </body>
    </html>
  );
}
