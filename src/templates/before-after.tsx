import { SlideContainer } from "@/design-system";

interface BeforeAfterTemplateProps {
  beforeEyebrow?: string;
  beforeTitle: string;
  beforeItems: string[];
  afterEyebrow?: string;
  afterTitle: string;
  afterItems: string[];
}

export function BeforeAfterTemplate({
  beforeEyebrow = "THE CHALLENGE",
  beforeTitle,
  beforeItems,
  afterEyebrow = "THE SOLUTION",
  afterTitle,
  afterItems,
}: BeforeAfterTemplateProps) {
  return (
    <SlideContainer mode="white" className="!p-0">
      <div className="h-full grid grid-cols-2 relative">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-[3px] z-10"
          style={{ backgroundColor: "var(--color-black)" }}
        />

        <div
          className="h-full p-16 flex flex-col justify-center"
          style={{ backgroundColor: "var(--color-black)" }}
        >
          <span
            className="inline-block text-[18px] tracking-[0.2em] uppercase font-medium"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-yellow)",
            }}
          >
            {beforeEyebrow}
          </span>

          <h2
            className="mt-4 uppercase"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)",
              lineHeight: 0.95,
              color: "var(--color-white)",
            }}
          >
            {beforeTitle}
          </h2>

          <ul className="mt-10 space-y-5">
            {beforeItems.map((item, i) => (
              <li key={i} className="flex items-start gap-4 transition-transform duration-200 hover:translate-x-2">
                <span
                  className="shrink-0 mt-2.5 w-3 h-3"
                  style={{ backgroundColor: "var(--color-yellow)" }}
                />
                <span
                  className="text-[20px] leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="h-full p-16 flex flex-col justify-center"
          style={{ backgroundColor: "var(--color-yellow)" }}
        >
          <span
            className="inline-block text-[18px] tracking-[0.2em] uppercase font-medium"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-black)",
            }}
          >
            {afterEyebrow}
          </span>

          <h2
            className="mt-4 uppercase"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)",
              lineHeight: 0.95,
              color: "var(--color-black)",
            }}
          >
            {afterTitle}
          </h2>

          <ul className="mt-10 space-y-5">
            {afterItems.map((item, i) => (
              <li key={i} className="flex items-start gap-4 transition-transform duration-200 hover:translate-x-2">
                <span
                  className="shrink-0 mt-2.5 w-3 h-3"
                  style={{ backgroundColor: "var(--color-black)" }}
                />
                <span
                  className="text-[20px] leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--color-black)",
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideContainer>
  );
}
