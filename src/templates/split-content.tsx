import {
  SlideContainer,
  TwoColumnLayout,
  Eyebrow,
  SectionHeader,
  type SlideMode,
} from "@/design-system";

interface SplitContentTemplateProps {
  eyebrow?: string;
  title: string;
  content: string;
  bulletPoints?: string[];
  imageUrl: string;
  imageSide?: "left" | "right";
  mode?: SlideMode;
}

export function SplitContentTemplate({
  eyebrow,
  title,
  content,
  bulletPoints,
  imageUrl,
  imageSide = "right",
  mode = "white",
}: SplitContentTemplateProps) {
  const textContent = (
    <div className="space-y-6">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <SectionHeader style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}>
        {title}
      </SectionHeader>
      <p
        className="text-[22px] leading-[1.7]"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-text-secondary)",
        }}
      >
        {content}
      </p>
      {bulletPoints && bulletPoints.length > 0 && (
        <ul className="mt-6 space-y-4">
          {bulletPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-4">
              <span
                className="mt-2.5 w-3 h-3 shrink-0"
                style={{ backgroundColor: "var(--color-yellow)" }}
              />
              <span
                className="text-[20px] leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {point}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const imageContent = (
    <div
      className="w-full h-full bg-cover bg-center"
      style={{
        backgroundImage: `url('${imageUrl}')`,
        minHeight: 400,
      }}
    />
  );

  return (
    <SlideContainer mode={mode}>
      <TwoColumnLayout
        left={imageSide === "left" ? imageContent : textContent}
        right={imageSide === "right" ? imageContent : textContent}
      />
    </SlideContainer>
  );
}
