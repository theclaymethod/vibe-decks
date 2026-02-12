import {
  SlideContainer,
  TwoColumnLayout,
  Eyebrow,
  SectionHeader,
  BodyText,
  ListItem,
  Divider,
  AnimatedEntry,
  StaggerContainer,
} from "@/design-system";

export function Slide03Intro() {
  return (
    <SlideContainer mode="white">
      <TwoColumnLayout
        ratio="1:1"
        gap="xl"
        left={
          <StaggerContainer stagger={0.12} delay={0}>
            <AnimatedEntry variant="slideUp" className="mb-4">
              <Eyebrow>Introduction</Eyebrow>
            </AnimatedEntry>
            <AnimatedEntry variant="slideUp" className="mb-6">
              <SectionHeader>What We Do</SectionHeader>
            </AnimatedEntry>
            <AnimatedEntry variant="slideUp" className="mb-8">
              <Divider />
            </AnimatedEntry>
            <AnimatedEntry variant="slideUp" className="mb-8">
              <BodyText>
                We help companies transform their digital presence through
                innovative solutions. Our team combines deep technical expertise
                with user-centered design to deliver exceptional results.
              </BodyText>
            </AnimatedEntry>
            <div className="space-y-5">
              <AnimatedEntry variant="slideUp">
                <ListItem number={1}>Full-stack development</ListItem>
              </AnimatedEntry>
              <AnimatedEntry variant="slideUp">
                <ListItem number={2}>Product design</ListItem>
              </AnimatedEntry>
              <AnimatedEntry variant="slideUp">
                <ListItem number={3}>Data analytics</ListItem>
              </AnimatedEntry>
            </div>
          </StaggerContainer>
        }
        right={
          <AnimatedEntry variant="fade" delay={0.3}>
            <div className="h-full w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop"
                alt="Team collaboration"
                className="h-full w-full object-cover"
              />
            </div>
          </AnimatedEntry>
        }
      />
    </SlideContainer>
  );
}
