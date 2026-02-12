import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  StaggerContainer,
} from "@/design-system";

const logos = [
  { name: "React", label: "Frontend" },
  { name: "TypeScript", label: "Language" },
  { name: "Tailwind", label: "Styling" },
  { name: "Cloudflare", label: "Infrastructure" },
  { name: "PostgreSQL", label: "Database" },
  { name: "Redis", label: "Caching" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function Slide15Partners() {
  return (
    <SlideContainer mode="dark">
      <div className="h-full flex flex-col">
        <div className="mb-10">
          <Eyebrow
            className="text-[20px]"
            style={{ color: "var(--color-yellow)" }}
          >
            Technology Stack
          </Eyebrow>
          <SectionHeader
            className="mt-2"
            style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
          >
            Built With
          </SectionHeader>
        </div>

        <StaggerContainer
          stagger={0.1}
          delay={0.15}
          className="flex-1 grid grid-cols-3 grid-rows-2 gap-6"
        >
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex flex-col items-center justify-center"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border-light)",
              }}
              whileHover={{
                y: -8,
                boxShadow: "0 8px 30px rgba(252, 217, 75, 0.15)",
                borderColor: "var(--color-yellow)",
                transition: { duration: 0.2 },
              }}
            >
              <div
                className="w-12 h-1 mb-5"
                style={{ backgroundColor: "var(--color-yellow)" }}
              />
              <span
                className="text-[32px] uppercase tracking-[-0.01em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-text-primary)",
                }}
              >
                {logo.name}
              </span>
              <MonoText
                className="text-[14px] mt-2 tracking-[0.15em] uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                {logo.label}
              </MonoText>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </SlideContainer>
  );
}
