import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  type SlideMode,
} from "@/design-system";
import type { ReactNode } from "react";

interface DiagramBox {
  id: string;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  variant?: "default" | "primary" | "secondary" | "muted";
}

interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
}

interface DiagramTemplateProps {
  eyebrow?: string;
  title: string;
  boxes: DiagramBox[];
  connections?: DiagramConnection[];
  layout?: "horizontal" | "vertical" | "grid";
  mode?: SlideMode;
  caption?: string;
}

export function DiagramTemplate({
  eyebrow,
  title,
  boxes,
  layout = "horizontal",
  mode = "white",
  caption,
}: DiagramTemplateProps) {
  const isLight = mode === "white" || mode === "yellow";

  const getBoxStyle = (box: DiagramBox) => {
    const baseStyle = {
      borderColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
    };

    switch (box.variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: "var(--color-primary)",
          borderColor: "var(--color-primary)",
          color: "#fff",
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
        };
      case "muted":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderStyle: "dashed" as const,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: isLight ? "#fff" : "rgba(255,255,255,0.05)",
        };
    }
  };

  const layoutClass = {
    horizontal: "flex flex-row items-center justify-center gap-8",
    vertical: "flex flex-col items-center justify-center gap-6",
    grid: "grid grid-cols-3 gap-6 place-items-center",
  }[layout];

  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        <div className="mb-8">
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

        <div className="flex-1 flex items-center justify-center">
          <div className={layoutClass}>
            {boxes.map((box, idx) => (
              <div key={box.id} className="flex items-center gap-4">
                <div
                  className="relative px-8 py-6 rounded-lg border-2 min-w-[160px] text-center"
                  style={getBoxStyle(box)}
                >
                  {box.icon && (
                    <div
                      className="mb-3 flex justify-center"
                      style={{
                        color:
                          box.variant === "primary"
                            ? "#fff"
                            : "var(--color-primary)",
                      }}
                    >
                      {box.icon}
                    </div>
                  )}
                  <MonoText
                    className="text-[20px] font-medium uppercase tracking-wider block"
                    style={{
                      color:
                        box.variant === "primary"
                          ? "#fff"
                          : isLight
                            ? "var(--color-text-primary)"
                            : "var(--color-text-inverse)",
                    }}
                  >
                    {box.label}
                  </MonoText>
                  {box.sublabel && (
                    <MonoText
                      className="text-[16px] mt-1 block"
                      style={{
                        color:
                          box.variant === "primary"
                            ? "rgba(255,255,255,0.8)"
                            : isLight
                              ? "var(--color-text-muted)"
                              : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {box.sublabel}
                    </MonoText>
                  )}
                </div>
                {layout === "horizontal" && idx < boxes.length - 1 && (
                  <div
                    className="flex items-center"
                    style={{
                      color: isLight
                        ? "var(--color-text-muted)"
                        : "rgba(255,255,255,0.4)",
                    }}
                  >
                    <svg
                      width="32"
                      height="12"
                      viewBox="0 0 32 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M0 6h28M24 1l5 5-5 5" />
                    </svg>
                  </div>
                )}
                {layout === "vertical" && idx < boxes.length - 1 && (
                  <div
                    className="flex justify-center py-2"
                    style={{
                      color: isLight
                        ? "var(--color-text-muted)"
                        : "rgba(255,255,255,0.4)",
                    }}
                  >
                    <svg
                      width="12"
                      height="32"
                      viewBox="0 0 12 32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M6 0v28M1 24l5 5 5-5" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {caption && (
          <div className="mt-8 text-center">
            <MonoText
              className="text-[18px]"
              style={{
                color: isLight
                  ? "var(--color-text-muted)"
                  : "rgba(255,255,255,0.5)",
              }}
            >
              {caption}
            </MonoText>
          </div>
        )}
      </div>
    </SlideContainer>
  );
}
