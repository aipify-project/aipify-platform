const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Security", href: "#about" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Contact", href: "#about" },
    { label: "Careers", href: "#about" },
  ],
  Resources: [
    { label: "Documentation", href: "#about" },
    { label: "Support", href: "#about" },
    { label: "Status", href: "#about" },
  ],
};

export default function Footer() {
  return (
    <footer id="about" className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white">
                A
              </span>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Aipify
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
              Intelligent AI assistants that learn your systems and help your
              team work smarter.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          id="pricing"
          className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Simple, transparent pricing
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Start free and scale as your business grows. Full pricing coming
                soon.
              </p>
            </div>
            <a
              href="#get-started"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-violet-700"
            >
              Start Free
            </a>
          </div>
        </div>

        <div id="login" className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Aipify AI
          </p>
        </div>
      </div>
    </footer>
  );
}
