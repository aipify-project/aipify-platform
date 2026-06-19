type MarketingKnowledgeFaqSectionProps = {
  title: string;
  faqs: Array<{ q: string; a: string }>;
};

export default function MarketingKnowledgeFaqSection({ title, faqs }: MarketingKnowledgeFaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="mt-12 border-t border-aipify-border pt-10">
      <h2 className="text-xl font-bold text-aipify-text">{title}</h2>
      <div className="mt-6 space-y-6">
        {faqs.map((faq) => (
          <article key={faq.q} className="rounded-xl border border-aipify-border bg-aipify-surface p-5">
            <h3 className="font-semibold text-aipify-text">{faq.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{faq.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
