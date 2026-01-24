import { motion } from "motion/react";
import { SlideContainer, CenterContent, Eyebrow, type SlideMode } from "@/design-system";

interface BigNumberTemplateProps {
  eyebrow?: string;
  number: string;
  label: string;
  description?: string;
  mode?: SlideMode;
}

export function BigNumberTemplate({
  eyebrow,
  number,
  label,
  description,
  mode = "yellow",
}: BigNumberTemplateProps) {
  return (
    <SlideContainer mode={mode}>
      <CenterContent>
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Eyebrow className="mb-8">{eyebrow}</Eyebrow>
          </motion.div>
        )}

        <motion.div
          className="leading-none"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(12rem, 30vw, 20rem)",
            color: "var(--color-text-primary)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: eyebrow ? 0.15 : 0, ease: "easeOut" }}
        >
          {number}
        </motion.div>

        <motion.span
          className="text-[24px] uppercase tracking-[0.2em] mt-8 block"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-primary)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: eyebrow ? 0.3 : 0.15, ease: "easeOut" }}
        >
          {label}
        </motion.span>

        {description && (
          <motion.span
            className="text-[20px] mt-6 max-w-lg block text-center"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-text-secondary)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: eyebrow ? 0.45 : 0.3, ease: "easeOut" }}
          >
            {description}
          </motion.span>
        )}
      </CenterContent>
    </SlideContainer>
  );
}
