import {
  SlideContainer,
  Eyebrow,
  HeroTitle,
  BodyText,
  Label,
  TechCode,
  AnimatedEntry,
  StaggerContainer,
} from "@/design-system";

export function Slide01Title() {
  return (
    <SlideContainer mode="yellow" className="relative flex flex-col">
      <StaggerContainer
        stagger={0.15}
        delay={0}
        className="flex-1 flex flex-col items-center justify-center"
      >
        <div className="text-center max-w-5xl">
          <AnimatedEntry variant="slideUp" className="mb-6">
            <Eyebrow>Product Overview</Eyebrow>
          </AnimatedEntry>

          <AnimatedEntry variant="slideUp">
            <HeroTitle>Project Name</HeroTitle>
          </AnimatedEntry>

          <AnimatedEntry variant="slideUp">
            <BodyText className="mx-auto mt-8 max-w-3xl text-center" size="lg">
              A brief description of your project, product, or presentation
              topic
            </BodyText>
          </AnimatedEntry>

          <AnimatedEntry
            variant="slideUp"
            className="mt-10 flex items-center justify-center"
          >
            <Label>Q1 2024 Report</Label>
          </AnimatedEntry>
        </div>
      </StaggerContainer>

      <div className="flex items-end justify-between">
        <TechCode size="sm">XPN LOG.X4.22.00.1</TechCode>
        <div
          className="flex items-center gap-6 text-[16px] tracking-[0.15em] uppercase"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-muted)",
          }}
        >
          <span>Your Name</span>
          <span
            className="h-4 w-px"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <span>January 2024</span>
        </div>
      </div>
    </SlideContainer>
  );
}
