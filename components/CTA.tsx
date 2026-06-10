export default function CTA() {
  return (
    <section
      id="get-started"
      className="relative overflow-hidden bg-white py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-100/50 to-violet-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Ready to bring AI into your business?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
          Get started with Aipify and discover how intelligent assistants can
          support your team.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#get-started"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-700 hover:to-violet-700 sm:w-auto"
          >
            Start Free
          </a>
          <a
            href="#demo"
            className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-10 py-4 text-base font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 sm:w-auto"
          >
            Book a Demo
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          No credit card required · Setup in minutes · Cancel anytime
        </p>
      </div>
    </section>
  );
}
