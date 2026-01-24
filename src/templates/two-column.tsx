import {
  SlideContainer,
  TwoColumnLayout,
  Eyebrow,
  SectionHeader,
  ListItem,
  type SlideMode,
} from "@/design-system";

interface TwoColumnTemplateProps {
  eyebrow?: string;
  title: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  ratio?: "1:1" | "2:1" | "1:2" | "3:2" | "2:3";
  mode?: SlideMode;
}

export function TwoColumnTemplate({
  eyebrow,
  title,
  leftContent,
  rightContent,
  ratio = "1:1",
  mode = "white",
}: TwoColumnTemplateProps) {
  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        <div className="mb-10">
          {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
          <SectionHeader style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}>
            {title}
          </SectionHeader>
        </div>

        <div className="flex-1">
          <TwoColumnLayout
            left={leftContent}
            right={rightContent}
            ratio={ratio}
          />
        </div>
      </div>
    </SlideContainer>
  );
}

interface TwoColumnTextProps {
  eyebrow?: string;
  title: string;
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
  mode?: SlideMode;
}

export function TwoColumnTextTemplate({
  eyebrow,
  title,
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
  mode = "white",
}: TwoColumnTextProps) {
  const leftContent = (
    <div>
      <h3
        className="text-[32px] uppercase mb-6"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        {leftTitle}
      </h3>
      <div className="space-y-4">
        {leftItems.map((item, idx) => (
          <ListItem key={idx} number={idx + 1}>
            {item}
          </ListItem>
        ))}
      </div>
    </div>
  );

  const rightContent = (
    <div>
      <h3
        className="text-[32px] uppercase mb-6"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        {rightTitle}
      </h3>
      <div className="space-y-4">
        {rightItems.map((item, idx) => (
          <ListItem key={idx} number={idx + 1}>
            {item}
          </ListItem>
        ))}
      </div>
    </div>
  );

  return (
    <TwoColumnTemplate
      eyebrow={eyebrow}
      title={title}
      leftContent={leftContent}
      rightContent={rightContent}
      mode={mode}
    />
  );
}
