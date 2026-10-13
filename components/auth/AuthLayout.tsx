import Link from "next/link";
import { PublicAccessAtmosphere } from "@/components/auth/PublicAccessAtmosphere";

type AuthLayoutProps = {
  appName: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  wide?: boolean;
  bare?: boolean;
  alignTop?: boolean;
  trustNote?: string;
  showMascot?: boolean;
};

export default function AuthLayout({
  appName,
  title,
  subtitle,
  children,
  wide = false,
  bare = false,
  alignTop = false,
  trustNote,
  showMascot = true,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col text-[#1f2235]">
      <PublicAccessAtmosphere showMascot={showMascot} />

      <header className="relative z-10 border-b border-[rgba(96,82,176,.12)] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5577f2]/38] focus-visible:ring-offset-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#7357e8,#5577f2)] text-sm font-bold text-white shadow-sm">
              A
            </span>
            <span className="text-xl font-bold tracking-tight text-[#1f2235]">
              {appName}
            </span>
          </Link>
        </div>
      </header>

      <main
        className={`relative z-10 flex flex-1 justify-center px-4 sm:px-6 ${
          alignTop ? "items-start pb-8 pt-6 sm:pt-8" : "items-center py-12"
        }`}
      >
        <div className={`w-full ${wide ? "max-w-[68rem]" : "max-w-md"}`}>
          {title || subtitle ? (
            <div className="mb-8 text-center">
              {title ? (
                <h1 className="text-3xl font-bold tracking-tight text-[#1f2235] sm:text-4xl">{title}</h1>
              ) : null}
              {subtitle ? (
                <p className="mt-3 text-base text-[#687086] sm:text-lg">{subtitle}</p>
              ) : null}
            </div>
          ) : null}

          {bare ? (
            children
          ) : (
            <div className="rounded-[28px] border border-[rgba(96,82,176,.15)] bg-white p-6 shadow-[0_12px_30px_rgba(38,33,87,.07)] sm:p-8">
              {children}
            </div>
          )}
          {trustNote ? (
            <p className="mt-4 text-center text-sm text-[#687086]">{trustNote}</p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
