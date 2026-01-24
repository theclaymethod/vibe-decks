import { SlideContainer, type SlideMode } from "@/design-system";

interface QuoteTemplateProps {
  quote: string;
  attribution: string;
  role?: string;
  mode?: SlideMode;
}

export function QuoteTemplate({
  quote,
  attribution,
  role,
  mode = "dark",
}: QuoteTemplateProps) {
  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div
          className="text-[120px] leading-none mb-2"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-yellow)",
          }}
        >
          "
        </div>

        <p
          className="max-w-5xl leading-[1.1] uppercase"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            color: "var(--color-text-primary)",
          }}
        >
          {quote}
        </p>

        <div className="mt-12 flex items-center gap-5">
          <div
            className="w-14 h-14 flex items-center justify-center"
            style={{ backgroundColor: "var(--color-yellow)" }}
          >
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-black)",
              }}
            >
              {attribution
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="text-left">
            <span
              className="text-[20px] font-medium block"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-primary)",
              }}
            >
              {attribution}
            </span>
            {role && (
              <span
                className="text-[18px] block"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text-muted)",
                }}
              >
                {role}
              </span>
            )}
          </div>
        </div>
      </div>
    </SlideContainer>
  );
}
