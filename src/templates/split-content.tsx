import { motion } from "motion/react";
import {
  SlideContainer,
  TwoColumnLayout,
  Eyebrow,
  SectionHeader,
  type SlideMode,
} from "@/design-system";

interface SplitContentTemplateProps {
  eyebrow?: string;
  title: string;
  content: string;
  bulletPoints?: string[];
  imageUrl: string;
  imageSide?: "left" | "right";
  mode?: SlideMode;
}

export function SplitContentTemplate({
  eyebrow,
  title,
  content,
  bulletPoints,
  imageUrl,
  imageSide = "right",
  mode = "white",
}: SplitContentTemplateProps) {
  const textContent = (
    <div className="space-y-6">
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: eyebrow ? 0.15 : 0, ease: "easeOut" }}
      >
        <SectionHeader style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}>
          {title}
        </SectionHeader>
      </motion.div>
      <motion.p
        className="text-[22px] leading-[1.7]"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-text-secondary)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: eyebrow ? 0.3 : 0.15, ease: "easeOut" }}
      >
        {content}
      </motion.p>
      {bulletPoints && bulletPoints.length > 0 && (
        <motion.ul
          className="mt-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: eyebrow ? 0.45 : 0.3, ease: "easeOut" }}
        >
          {bulletPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-4">
              <span
                className="mt-2.5 w-3 h-3 shrink-0"
                style={{ backgroundColor: "var(--color-yellow)" }}
              />
              <span
                className="text-[20px] leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {point}
              </span>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );

  const imageContent = (
    <div
      className="w-full h-full bg-cover bg-center"
      style={{
        backgroundImage: `url('${imageUrl}')`,
        minHeight: 400,
      }}
    />
  );

  return (
    <SlideContainer mode={mode}>
      <TwoColumnLayout
        left={imageSide === "left" ? imageContent : textContent}
        right={imageSide === "right" ? imageContent : textContent}
      />
    </SlideContainer>
  );
}
