import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  StatCard,
  type SlideMode,
} from "@/design-system";

interface Stat {
  value: string;
  label: string;
  sublabel?: string;
}

interface StatCardsTemplateProps {
  eyebrow?: string;
  title: string;
  stats: Stat[];
  accentIndex?: number;
  mode?: SlideMode;
}

export function StatCardsTemplate({
  eyebrow,
  title,
  stats,
  accentIndex = 1,
  mode = "white",
}: StatCardsTemplateProps) {
  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        <div className="mb-10">
          {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
          <SectionHeader style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}>
            {title}
          </SectionHeader>
        </div>

        <div className="flex-1 flex items-center justify-around gap-8">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              value={stat.value}
              label={stat.label}
              sublabel={stat.sublabel}
              className="flex-1 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            />
          ))}
        </div>
      </div>
    </SlideContainer>
  );
}
