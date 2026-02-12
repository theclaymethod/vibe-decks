import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  Divider,
  AnimatedEntry,
  StaggerContainer,
} from "@/design-system";

const ROWS = [
  { feature: "Core Analytics", standard: true, premium: true },
  { feature: "Real-time Updates", standard: false, premium: true },
  { feature: "Custom Dashboards", standard: false, premium: true },
  { feature: "API Access", standard: true, premium: true },
  { feature: "Priority Support", standard: false, premium: true },
  { feature: "White-label Option", standard: false, premium: true },
];

const slideUpRow = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function Slide07Comparison() {
  return (
    <SlideContainer mode="white" className="flex flex-col">
      <StaggerContainer stagger={0.12} delay={0} className="mb-10">
        <AnimatedEntry variant="slideUp" className="mb-4">
          <Eyebrow>Comparison</Eyebrow>
        </AnimatedEntry>
        <AnimatedEntry variant="slideUp" className="mb-8">
          <SectionHeader>Feature Matrix</SectionHeader>
        </AnimatedEntry>
        <AnimatedEntry variant="slideUp">
          <Divider />
        </AnimatedEntry>
      </StaggerContainer>

      <div className="flex-1 flex items-center">
        <motion.div
          className="w-full border-2"
          style={{ borderColor: "var(--color-border)" }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.3 },
            },
          }}
        >
          <motion.div
            className="grid grid-cols-3 border-b-2"
            style={{ borderColor: "var(--color-border)" }}
            variants={slideUpRow}
          >
            <div
              className="p-6 text-[18px] font-semibold uppercase tracking-[0.05em]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-primary)",
              }}
            >
              Feature
            </div>
            <div
              className="p-6 text-center text-[18px] font-semibold uppercase tracking-[0.05em]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-muted)",
              }}
            >
              Standard
            </div>
            <div
              className="p-6 text-center text-[18px] font-semibold uppercase tracking-[0.05em]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-primary)",
                backgroundColor: "var(--color-yellow)",
              }}
            >
              Premium
            </div>
          </motion.div>

          {ROWS.map((row, i) => (
            <motion.div
              key={i}
              className="grid grid-cols-3 border-b last:border-0"
              style={{ borderColor: "var(--color-border)" }}
              variants={slideUpRow}
            >
              <div
                className="p-6 text-[28px]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text-primary)",
                }}
              >
                {row.feature}
              </div>
              <div
                className="p-6 text-center text-[28px] font-bold"
                style={{
                  fontFamily: "var(--font-body)",
                  color: row.standard
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)",
                }}
              >
                {row.standard ? "+" : "—"}
              </div>
              <div
                className="p-6 text-center text-[28px] font-bold"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: "var(--color-yellow)",
                  color: "var(--color-black)",
                }}
              >
                {row.premium ? "+" : "—"}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideContainer>
  );
}
