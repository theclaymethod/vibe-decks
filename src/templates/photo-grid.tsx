import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  type SlideMode,
} from "@/design-system";

interface PhotoGridItem {
  imageUrl: string;
  title: string;
  subtitle?: string;
}

interface PhotoGridTemplateProps {
  eyebrow?: string;
  title: string;
  items: PhotoGridItem[];
  columns?: 2 | 3 | 4;
  mode?: SlideMode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function PhotoGridTemplate({
  eyebrow,
  title,
  items,
  columns = 3,
  mode = "white",
}: PhotoGridTemplateProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  const rows = columns === 2 ? 2 : columns === 4 ? 1 : 2;
  const rowClass = rows === 1 ? "grid-rows-1" : "grid-rows-2";

  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          {eyebrow && (
            <Eyebrow
              className="text-[20px]"
              style={{ color: "var(--color-primary)" }}
            >
              {eyebrow}
            </Eyebrow>
          )}
          <SectionHeader
            className="mt-2"
            style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}
          >
            {title}
          </SectionHeader>
        </div>

        <motion.div
          className={`flex-1 grid ${colClass} ${rowClass} gap-4`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item, idx) => (
            <motion.div key={idx} className="h-full" variants={itemVariants}>
              <div className="relative h-full rounded overflow-hidden group cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "26px",
                    }}
                  >
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <MonoText
                      className="opacity-80"
                      style={{ fontSize: "20px" }}
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
    </SlideContainer>
  );
}
