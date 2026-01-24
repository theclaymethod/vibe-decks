import {
  SlideContainer,
  GridSection,
  FeatureCard,
  Eyebrow,
  SectionHeader,
  type SlideMode,
} from "@/design-system";

interface Feature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureGridTemplateProps {
  eyebrow?: string;
  title: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  mode?: SlideMode;
}

export function FeatureGridTemplate({
  eyebrow,
  title,
  features,
  columns = 3,
  mode = "white",
}: FeatureGridTemplateProps) {
  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        <div className="mb-10">
          {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
          <SectionHeader style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}>
            {title}
          </SectionHeader>
        </div>

        <div className="flex-1 flex items-center">
          <GridSection columns={columns} className="w-full">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              />
            ))}
          </GridSection>
        </div>
      </div>
    </SlideContainer>
  );
}
