import { motion } from "motion/react";
import {
  SlideContainer,
  GridSection,
  FeatureCard,
  Eyebrow,
  SectionHeader,
  type SlideMode,
} from "@/design-system";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

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
            <motion.div
              className="contents"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  />
                </motion.div>
              ))}
            </motion.div>
          </GridSection>
        </div>
      </div>
    </SlideContainer>
  );
}
