import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  type SlideMode,
} from "@/design-system";

interface StackedCard {
  label: string;
  title: string;
  description?: string;
  color?: string;
}

interface StackedCardsTemplateProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cards: StackedCard[];
  mode?: SlideMode;
}

export function StackedCardsTemplate({
  eyebrow,
  title,
  subtitle,
  cards,
  mode = "white",
}: StackedCardsTemplateProps) {
  const isLight = mode === "white" || mode === "yellow";

  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex">
        <div className="w-1/3 flex flex-col justify-center pr-8">
          {eyebrow && (
            <Eyebrow
              className="text-[20px]"
              style={{ color: "var(--color-primary)" }}
            >
              {eyebrow}
            </Eyebrow>
          )}
          <SectionHeader
            className="mt-2"
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
          >
            {title}
          </SectionHeader>
          {subtitle && (
            <MonoText
              className="mt-4 block text-[14px]"
              style={{
                color: isLight
                  ? "var(--color-text-muted)"
                  : "rgba(255,255,255,0.6)",
              }}
            >
              {subtitle}
            </MonoText>
          )}
        </div>

        <div className="w-2/3 flex items-center justify-center">
          <div className="relative w-80 h-64">
            {cards.map((card, i) => (
              <div
                key={i}
                className="absolute p-6 shadow-lg cursor-pointer transition-all duration-300 hover:z-50 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  backgroundColor: isLight ? "#fff" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
                  top: i * 24,
                  left: i * 24,
                  zIndex: cards.length - i,
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  className="text-[18px] uppercase tracking-[0.15em] mb-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: card.color || "var(--color-primary)",
                  }}
                >
                  {card.label}
                </div>
                <h3
                  className="text-[36px]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: isLight
                      ? "var(--color-text-primary)"
                      : "var(--color-text-inverse)",
                  }}
                >
                  {card.title}
                </h3>
                {card.description && (
                  <MonoText
                    className="mt-2 text-[14px] block"
                    style={{
                      color: isLight
                        ? "var(--color-text-muted)"
                        : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {card.description}
                  </MonoText>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideContainer>
  );
}
