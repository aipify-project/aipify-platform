"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  const isServerError = Boolean(error.digest);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-6 antialiased">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">This page couldn&apos;t load</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {isServerError
              ? "A server error occurred. Try again or return to the homepage."
              : "Something went wrong. Try again or return to the homepage."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-violet-700"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              Go home
            </a>
          </div>
          {error.digest ? (
            <p className="mt-6 text-xs text-gray-400">Error {error.digest}</p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
