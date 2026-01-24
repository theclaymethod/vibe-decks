import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
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

interface ThreeUpItem {
  imageUrl: string;
  title: string;
  subtitle?: string;
}

interface ThreeUpTemplateProps {
  eyebrow?: string;
  title?: string;
  items: [ThreeUpItem, ThreeUpItem, ThreeUpItem];
  mode?: SlideMode;
  aspectRatio?: "square" | "portrait" | "landscape";
}

export function ThreeUpTemplate({
  eyebrow,
  title,
  items,
  mode = "white",
  aspectRatio = "portrait",
}: ThreeUpTemplateProps) {
  const isLight = mode === "white" || mode === "yellow";

  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-video",
  }[aspectRatio];

  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        {(eyebrow || title) && (
          <div className="mb-8 text-center">
            {eyebrow && (
              <Eyebrow
                className="text-[20px]"
                style={{ color: "var(--color-primary)" }}
              >
                {eyebrow}
              </Eyebrow>
            )}
            {title && (
              <SectionHeader
                className="mt-2"
                style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}
              >
                {title}
              </SectionHeader>
            )}
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="grid grid-cols-3 gap-6 w-full max-w-5xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="flex flex-col group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                  <div className={`${aspectClass} rounded-lg overflow-hidden`}>
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url('${item.imageUrl}')` }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3
                      className="text-[26px]"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: isLight
                          ? "var(--color-text-primary)"
                          : "var(--color-text-inverse)",
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <MonoText
                        className="text-[20px] mt-1 block"
                        style={{
                          color: isLight
                            ? "var(--color-text-muted)"
                            : "rgba(255,255,255,0.6)",
                        }}
                      >
                        {item.subtitle}
                      </MonoText>
                    )}
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
