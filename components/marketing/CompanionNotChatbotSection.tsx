type CompanionNotChatbotSectionProps = {
  title: string;
  statements: string[];
};

export default function CompanionNotChatbotSection({ title, statements }: CompanionNotChatbotSectionProps) {
  return (
    <section aria-labelledby="companion-not-chatbot-title" className="border-y border-aipify-border bg-aipify-accent-soft/30">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 id="companion-not-chatbot-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mt-10 space-y-4">
          {statements.map((statement) => (
            <li key={statement} className="text-base leading-relaxed text-aipify-text-secondary sm:text-lg">
              {statement}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
