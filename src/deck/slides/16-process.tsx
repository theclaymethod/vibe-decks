import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  staggerContainerVariants,
  slideUpLargeVariants,
} from "@/design-system";

const cards = [
  {
    label: "Step 1",
    title: "Discovery & Research",
    description: "Understanding user needs and market context",
    color: "var(--color-primary)",
  },
  {
    label: "Step 2",
    title: "Design & Prototype",
    description: "Rapid iteration on solutions",
    color: "#85d7ff",
  },
  {
    label: "Step 3",
    title: "Build & Launch",
    description: "Quality engineering and deployment",
    color: "#10b981",
  },
];

export function Slide16Process() {
  return (
    <SlideContainer mode="yellow">
      <div className="h-full flex">
        <div className="w-1/3 flex flex-col justify-center pr-8">
          <Eyebrow
            className="text-[20px]"
            style={{ color: "var(--color-primary)" }}
          >
            Process
          </Eyebrow>
          <SectionHeader
            className="mt-2"
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
          >
            How We Work
          </SectionHeader>
          <MonoText
            className="mt-4 block text-[14px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            A systematic approach to building great products.
          </MonoText>
        </div>

        <div className="w-2/3 flex items-center justify-center">
          <motion.div
            className="relative w-80 h-64"
            variants={staggerContainerVariants(0.15, 0.2)}
            initial="hidden"
            animate="visible"
          >
            {cards.map((card, i) => (
              <motion.div
                key={i}
                className="absolute p-6 shadow-lg cursor-pointer transition-all duration-300 hover:z-50 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  top: i * 24,
                  left: i * 24,
                  zIndex: cards.length - i,
                  width: "100%",
                  height: "100%",
                }}
                variants={slideUpLargeVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div
                  className="text-[18px] uppercase tracking-[0.15em] mb-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: card.color,
                  }}
                >
                  {card.label}
                </div>
                <h3
                  className="text-[36px]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {card.title}
                </h3>
                <MonoText
                  className="mt-2 text-[14px] block"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {card.description}
                </MonoText>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SlideContainer>
  );
}
