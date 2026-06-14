import Link from "next/link";

type AuthLayoutProps = {
  appName: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  wide?: boolean;
  trustNote?: string;
};

export default function AuthLayout({
  appName,
  title,
  subtitle,
  children,
  wide = false,
  trustNote,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-100/40 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white">
              A
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              {appName}
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className={`w-full ${wide ? "max-w-2xl" : "max-w-md"}`}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-base text-gray-600 sm:text-lg">{subtitle}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-8">
            {children}
          </div>
          {trustNote ? (
            <p className="mt-4 text-center text-sm text-gray-500">{trustNote}</p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
