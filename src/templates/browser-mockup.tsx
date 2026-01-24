import { motion } from "motion/react";
import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  type SlideMode,
} from "@/design-system";

interface BrowserMockupTemplateProps {
  eyebrow?: string;
  title?: string;
  imageUrl: string;
  browserUrl?: string;
  caption?: string;
  mode?: SlideMode;
}

export function BrowserMockupTemplate({
  eyebrow,
  title,
  imageUrl,
  browserUrl = "example.com",
  caption,
  mode = "white",
}: BrowserMockupTemplateProps) {
  const isLight = mode === "white" || mode === "yellow";

  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col items-center justify-center">
        {eyebrow && (
          <Eyebrow className="mb-2" style={{ color: "var(--color-primary)" }}>
            {eyebrow}
          </Eyebrow>
        )}

        {title && (
          <SectionHeader
            className="mb-8 text-center"
            style={{ fontSize: "clamp(2.5rem, 4vw, 3rem)" }}
          >
            {title}
          </SectionHeader>
        )}

        <motion.div
          className="w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden"
          style={{
            border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div
            className="h-10 flex items-center px-4 gap-2"
            style={{
              backgroundColor: isLight ? "#f5f5f5" : "#2a2a2a",
              borderBottom: `1px solid ${isLight ? "#e5e5e5" : "#3a3a3a"}`,
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div
                className="rounded px-3 py-1 text-xs max-w-md mx-auto text-center"
                style={{
                  backgroundColor: isLight ? "#fff" : "#1a1a1a",
                  color: isLight ? "#999" : "#666",
                }}
              >
                {browserUrl}
              </div>
            </div>
          </div>

          <div
            className="aspect-video bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
        </motion.div>

        {caption && (
          <MonoText
            className="mt-6 text-center text-[20px]"
            style={{
              color: isLight
                ? "var(--color-text-muted)"
                : "rgba(255,255,255,0.6)",
            }}
          >
            {caption}
          </MonoText>
        )}
      </div>
    </SlideContainer>
  );
}
