import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  AnimatedEntry,
} from "@/design-system";

const FRAME_COLOR = "#1a1a1a";

export function Slide12Mobile() {
  return (
    <SlideContainer mode="yellow">
      <div className="h-full flex flex-col items-center justify-center">
        <AnimatedEntry variant="slideUp" delay={0}>
          <Eyebrow className="mb-2">Mobile Experience</Eyebrow>
        </AnimatedEntry>

        <AnimatedEntry variant="slideUp" delay={0.1}>
          <SectionHeader className="mb-8 text-center" style={{ fontSize: "clamp(2.5rem, 4vw, 3rem)" }}>
            Native App Design
          </SectionHeader>
        </AnimatedEntry>

        <motion.div
          className="relative rounded-[40px] overflow-hidden"
          style={{
            border: `12px solid ${FRAME_COLOR}`,
            maxHeight: "65vh",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 rounded-full z-10"
            style={{ backgroundColor: FRAME_COLOR }}
          />

          <div
            className="bg-cover bg-center bg-no-repeat"
            style={{
              width: "280px",
              height: "600px",
              backgroundImage:
                "url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=560&h=1200&fit=crop')",
            }}
          />
        </motion.div>

        <AnimatedEntry variant="slideUp" delay={0.3}>
          <MonoText className="mt-8 text-center max-w-md block">
            Optimized for iOS and Android platforms
          </MonoText>
        </AnimatedEntry>
      </div>
    </SlideContainer>
  );
}
