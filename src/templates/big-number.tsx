import { SlideContainer, CenterContent, Eyebrow, type SlideMode } from "@/design-system";

interface BigNumberTemplateProps {
  eyebrow?: string;
  number: string;
  label: string;
  description?: string;
  mode?: SlideMode;
}

export function BigNumberTemplate({
  eyebrow,
  number,
  label,
  description,
  mode = "yellow",
}: BigNumberTemplateProps) {
  return (
    <SlideContainer mode={mode}>
      <CenterContent>
        {eyebrow && (
          <Eyebrow className="mb-8">{eyebrow}</Eyebrow>
        )}

        <div
          className="leading-none"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(12rem, 30vw, 20rem)",
            color: "var(--color-text-primary)",
          }}
        >
          {number}
        </div>

        <span
          className="text-[24px] uppercase tracking-[0.2em] mt-8 block"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-primary)",
          }}
        >
          {label}
        </span>

        {description && (
          <span
            className="text-[20px] mt-6 max-w-lg block text-center"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-text-secondary)",
            }}
          >
            {description}
          </span>
        )}
      </CenterContent>
    </SlideContainer>
  );
}
