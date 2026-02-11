import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  type SlideMode,
} from "@/design-system";

type MilestoneStatus = "complete" | "current" | "future";

interface Milestone {
  phase: string;
  date: string;
  title: string;
  description: string;
  status: MilestoneStatus;
}

interface TimelineTemplateProps {
  eyebrow?: string;
  title: string;
  milestones: Milestone[];
  mode?: SlideMode;
}

export function TimelineTemplate({
  eyebrow,
  title,
  milestones,
  mode = "white",
}: TimelineTemplateProps) {
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
          <motion.div
            className="relative pl-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.2 },
              },
            }}
          >
            <div
              className="absolute left-[39px] top-0 bottom-0 w-[3px]"
              style={{ backgroundColor: "var(--color-border)" }}
            />

            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className="relative flex items-start mb-12 last:mb-0 cursor-pointer rounded-lg -ml-4 pl-4 pr-4 py-3 transition-all duration-300 hover:bg-[var(--color-border)]/10"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.4, ease: "easeOut" },
                  },
                }}
              >
                <div
                  className={cn(
                    "absolute left-0 w-8 h-8 border-2",
                    m.status === "current" && "animate-pulse"
                  )}
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor:
                      m.status !== "future"
                        ? "var(--color-yellow)"
                        : "var(--color-bg-primary)",
                  }}
                />

                <div className="ml-16">
                  <span
                    className="text-[16px] uppercase tracking-[0.1em] block"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {m.phase} — {m.date}
                  </span>
                  <h3
                    className="text-[36px] uppercase mt-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {m.title}
                  </h3>
                  <span
                    className="text-[20px] mt-3 block max-w-lg leading-relaxed"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {m.description}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SlideContainer>
  );
}
