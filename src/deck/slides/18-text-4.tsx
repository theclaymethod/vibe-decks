import { SlideContainer, SectionHeader, BodyText } from "@/design-system";

export function Slide18Text4() {
  return (
    <SlideContainer mode="white" className="relative">
      {/* Top-left: Title card */}
      <div
        className="absolute flex flex-col justify-center p-8"
        style={{
          left: 183,
          top: 135,
          width: 300,
          height: 200,
          backgroundColor: "var(--color-bg-secondary)",
          borderLeft: "3px solid var(--color-primary)",
        }}
      >
        <SectionHeader className="text-[28px] leading-tight">
          Ada Lovelace
        </SectionHeader>
      </div>

      {/* Center: Bio */}
      <div
        className="absolute flex flex-col justify-center p-8"
        style={{
          left: 747,
          top: 445,
          width: 300,
          height: 200,
          backgroundColor: "var(--color-bg-secondary)",
          borderLeft: "3px solid var(--color-primary)",
        }}
      >
        <BodyText size="sm">
          Mathematician and writer, recognized as the first computer programmer
          for her work on Charles Babbage's Analytical Engine in 1843.
        </BodyText>
      </div>

      {/* Bottom-left: Legacy note */}
      <div
        className="absolute flex flex-col justify-center p-8"
        style={{
          left: 269,
          top: 754,
          width: 300,
          height: 200,
          backgroundColor: "var(--color-bg-secondary)",
          borderLeft: "3px solid var(--color-primary)",
        }}
      >
        <BodyText size="sm">
          Her notes on the Analytical Engine included what is considered the
          first algorithm — making her a pioneer of computing.
        </BodyText>
      </div>

      {/* Right-center: Key insight */}
      <div
        className="absolute flex flex-col justify-center p-8"
        style={{
          left: 1301,
          top: 428,
          width: 300,
          height: 200,
          backgroundColor: "var(--color-bg-secondary)",
          borderLeft: "3px solid var(--color-primary)",
        }}
      >
        <BodyText size="sm">
          She envisioned machines going beyond mere calculation — anticipating
          general-purpose computing over a century early.
        </BodyText>
      </div>
    </SlideContainer>
  );
}
