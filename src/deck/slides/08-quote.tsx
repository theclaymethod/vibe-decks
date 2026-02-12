import { SlideContainer, Quote, AnimatedEntry } from "@/design-system";

function QuotePanel({
  quote,
  attribution,
  imageUrl,
  delay = 0,
}: {
  quote: string;
  attribution: string;
  imageUrl: string;
  delay?: number;
}) {
  return (
    <AnimatedEntry variant="slideUp" delay={delay} className="group relative flex-1 overflow-hidden cursor-pointer">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 grayscale group-hover:grayscale-0"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-black/60 transition-colors duration-500 group-hover:bg-black/40" />

      <div className="relative h-full flex flex-col justify-center p-12">
        <Quote attribution={attribution}>
          {quote}
        </Quote>
      </div>
    </AnimatedEntry>
  );
}

export function Slide08Quote() {
  return (
    <SlideContainer mode="dark" className="!p-0">
      <div className="flex h-full gap-1">
        <QuotePanel
          quote="AI is transforming how we build software"
          attribution="John Doe, CTO at Anthropic"
          imageUrl="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80"
          delay={0}
        />
        <QuotePanel
          quote="The best software is still built by humans who deeply understand the problem"
          attribution="Jane Smith, Lead Engineer at Acme"
          imageUrl="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80"
          delay={0.15}
        />
      </div>
    </SlideContainer>
  );
}
