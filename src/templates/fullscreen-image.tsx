import { motion } from "motion/react";
import { SlideContainer, MonoText } from "@/design-system";

interface FullscreenImageTemplateProps {
  imageUrl: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  position?: "bottom-left" | "bottom-right" | "center" | "top-left";
  overlay?: "gradient" | "dark" | "light" | "none";
}

export function FullscreenImageTemplate({
  imageUrl,
  eyebrow,
  title,
  subtitle,
  position = "bottom-left",
  overlay = "gradient",
}: FullscreenImageTemplateProps) {
  const overlayClass = {
    gradient: "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
    dark: "bg-black/50",
    light: "bg-white/30",
    none: "",
  }[overlay];

  const positionClass = {
    "bottom-left": "justify-end items-start",
    "bottom-right": "justify-end items-end text-right",
    center: "justify-center items-center text-center",
    "top-left": "justify-start items-start",
  }[position];

  return (
    <SlideContainer mode="dark" className="relative !p-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${imageUrl}')` }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {overlay !== "none" && <div className={`absolute inset-0 ${overlayClass}`} />}

      <div className={`relative h-full flex flex-col p-16 ${positionClass}`}>
        <div className={position === "center" ? "max-w-4xl" : "max-w-3xl"}>
          {eyebrow && (
            <MonoText
              className="block text-[20px] tracking-[0.2em] uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {eyebrow}
            </MonoText>
          )}

          <h1
            className="text-white leading-[1.05] tracking-[-0.02em] mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.5rem, 7vw, 6rem)",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="text-[26px] leading-[1.5]"
              style={{
                fontFamily: "var(--font-body)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </SlideContainer>
  );
}
