import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  GridSection,
  StaggerContainer,
} from "@/design-system";

const members = [
  { name: "Alex Chen", role: "Product Lead", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face" },
  { name: "Sarah Kim", role: "Engineering", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop&crop=face" },
  { name: "Mike Davis", role: "Design", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face" },
  { name: "Emma Wilson", role: "Data Science", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop&crop=face" },
];

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function Slide14Team() {
  return (
    <SlideContainer mode="white">
      <div className="h-full flex flex-col">
        <div className="mb-8">
          <Eyebrow>The Team</Eyebrow>
          <SectionHeader
            className="mt-2"
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
          >
            Key Stakeholders
          </SectionHeader>
        </div>

        <StaggerContainer stagger={0.08} delay={0} className="flex-1">
          <GridSection columns={4} gap="md" className="h-full items-center">
            {members.map((person, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center text-center group cursor-pointer"
                variants={itemVariants}
              >
                <div className="w-64 h-64 rounded-full mb-6 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3
                  className="text-[36px] transition-colors duration-300 group-hover:[color:var(--color-primary)]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {person.name}
                </h3>

                <MonoText className="text-[20px] mt-2">
                  {person.role}
                </MonoText>
              </motion.div>
            ))}
          </GridSection>
        </StaggerContainer>
      </div>
    </SlideContainer>
  );
}
