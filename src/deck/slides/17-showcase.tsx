import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  staggerContainerVariants,
  slideUpVariants,
  hoverLift,
} from "@/design-system";

const projects = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=533&fit=crop",
    title: "Enterprise Platform",
    subtitle: "SaaS Dashboard",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=533&fit=crop",
    title: "Consumer Mobile",
    subtitle: "iOS & Android",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=533&fit=crop",
    title: "Marketing Site",
    subtitle: "Brand Launch",
  },
];

export function Slide17Showcase() {
  return (
    <SlideContainer mode="white">
      <div className="h-full flex flex-col">
        <div className="mb-8 text-center">
          <Eyebrow
            className="text-[20px]"
            style={{ color: "var(--color-primary)" }}
          >
            Case Studies
          </Eyebrow>
          <SectionHeader
            className="mt-2"
            style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}
          >
            Recent Projects
          </SectionHeader>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="grid grid-cols-3 gap-6 w-full max-w-5xl"
            variants={staggerContainerVariants(0.1, 0.2)}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                variants={slideUpVariants}
                whileHover={hoverLift}
              >
                <div className="flex flex-col group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundImage: `url('${project.imageUrl}')`,
                      }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3
                      className="text-[26px]"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {project.title}
                    </h3>
                    <MonoText
                      className="text-[20px] mt-1 block"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {project.subtitle}
                    </MonoText>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SlideContainer>
  );
}
