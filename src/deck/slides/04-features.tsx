import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  Divider,
  GridSection,
  FeatureCard,
  AnimatedEntry,
  StaggerContainer,
} from "@/design-system";

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChartIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 17V9M13 17V5M8 17v-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Slide04Features() {
  return (
    <SlideContainer mode="light" className="flex flex-col">
      <StaggerContainer stagger={0.12} delay={0} className="mb-12">
        <AnimatedEntry variant="slideUp" className="mb-4">
          <Eyebrow>Capabilities</Eyebrow>
        </AnimatedEntry>
        <AnimatedEntry variant="slideUp" className="mb-8">
          <SectionHeader>Key Features</SectionHeader>
        </AnimatedEntry>
        <AnimatedEntry variant="slideUp">
          <Divider />
        </AnimatedEntry>
      </StaggerContainer>

      <StaggerContainer stagger={0.15} delay={0.3} className="flex-1 flex items-center">
        <GridSection columns={3} gap="lg" className="w-full">
          <AnimatedEntry variant="slideUp">
            <FeatureCard
              icon={<CheckIcon />}
              title="Easy Integration"
              description="Connect with your existing tools in minutes, not hours"
            />
          </AnimatedEntry>
          <AnimatedEntry variant="slideUp">
            <FeatureCard
              icon={<ChartIcon />}
              title="Real-time Analytics"
              description="Track performance with live dashboards and custom reports"
            />
          </AnimatedEntry>
          <AnimatedEntry variant="slideUp">
            <FeatureCard
              icon={<ShieldIcon />}
              title="Enterprise Security"
              description="Bank-level encryption and compliance certifications"
            />
          </AnimatedEntry>
        </GridSection>
      </StaggerContainer>
    </SlideContainer>
  );
}
