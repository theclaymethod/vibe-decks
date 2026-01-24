import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  StatCard,
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

        <motion.div
          className="flex-1 flex items-center justify-around gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex-1"
            >
              <StatCard
                value={stat.value}
                label={stat.label}
                sublabel={stat.sublabel}
                className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideContainer>
  );
}
