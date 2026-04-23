import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How fast is Zipply?",
    answer:
      "Zipply is built on top of a global edge network. Links are resolved in milliseconds, and the redirection happens almost instantly. We prioritize performance above all else.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes! Our basic plan is free forever. You can create shortened links, track clicks, and use our API without paying a dime. We also offer premium features for heavy users.",
  },
  {
    question: "Do you offer an API?",
    answer:
      "Absolutely. Zipply is API-first. You can manage your links, retrieve analytics, and integrate our shortening engine directly into your own workflow using our robust REST API.",
  },
  {
    question: "Can I use custom domains?",
    answer:
      "Currently, we provide zipply.io/codes. Support for custom branded domains is on our roadmap and will be available to premium users soon.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Security is a core pillar of our platform. We use industry-standard encryption for all data at rest and in transit. Your API keys are strictly scoped and can be revoked at any time.",
  },
];

const FAQ = () => {
  return (
    <section className="bg-background w-full border-b">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl">
            Common Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-lg font-medium">
            Everything you need to know about Zipply.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b-2 py-2 last:border-b-0"
            >
              <AccordionTrigger className="text-left text-lg font-bold transition-all hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed font-medium">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
