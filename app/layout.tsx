import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aipify — AI that works for your business",
  description:
    "Aipify helps businesses automate support, streamline operations and make smarter decisions through intelligent AI assistants.",
  metadataBase: new URL("https://aipify.ai"),
  openGraph: {
    title: "Aipify — AI that works for your business",
    description:
      "Intelligent AI assistants for support, analytics, commerce and system learning.",
    url: "https://aipify.ai",
    siteName: "Aipify",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aipify — AI that works for your business",
    description:
      "Intelligent AI assistants for support, analytics, commerce and system learning.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
