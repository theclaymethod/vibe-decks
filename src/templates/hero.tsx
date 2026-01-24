import { motion } from "motion/react";
import { SlideContainer, TechCode, type SlideMode } from "@/design-system";

interface HeroTemplateProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  code?: string;
  imageUrl?: string;
  mode?: SlideMode;
}

export function HeroTemplate({
  eyebrow,
  title,
  subtitle,
  code,
  imageUrl,
  mode = "dark",
}: HeroTemplateProps) {
  return (
    <SlideContainer mode={mode} className="relative !p-0 overflow-hidden">
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
      )}

      {imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      )}

      <div className="relative h-full flex flex-col justify-end p-16">
        <div className="max-w-4xl">
          {eyebrow && (
            <motion.span
              className="block text-[18px] tracking-[0.2em] uppercase mb-4 font-medium"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-muted)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {eyebrow}
            </motion.span>
          )}

          <motion.h1
            className="leading-[0.9] tracking-[-0.02em] uppercase mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(4rem, 10vw, 7rem)",
              color: "var(--color-text-primary)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: eyebrow ? 0.15 : 0, ease: "easeOut" }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              className="text-[26px] leading-[1.5] max-w-2xl"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-secondary)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: eyebrow ? 0.3 : 0.15, ease: "easeOut" }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {code && (
          <div className="absolute bottom-8 right-16">
            <TechCode size="sm">{code}</TechCode>
          </div>
        )}
      </div>
    </SlideContainer>
  );
}
