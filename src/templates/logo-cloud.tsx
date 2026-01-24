import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  type SlideMode,
} from "@/design-system";
import type { ReactNode } from "react";

interface LogoItem {
  name: string;
  label?: string;
  icon?: ReactNode;
  imageUrl?: string;
}

interface LogoCloudTemplateProps {
  eyebrow?: string;
  title: string;
  logos: LogoItem[];
  columns?: 3 | 4 | 5 | 6;
  mode?: SlideMode;
  centered?: boolean;
}

export function LogoCloudTemplate({
  eyebrow,
  title,
  logos,
  columns = 3,
  mode = "white",
  centered = false,
}: LogoCloudTemplateProps) {
  const isLight = mode === "white" || mode === "yellow";

  const colClass = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[columns];

  const rows = Math.ceil(logos.length / columns);
  const rowClass = rows === 1 ? "grid-rows-1" : rows === 2 ? "grid-rows-2" : "grid-rows-3";

  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        <div className={centered ? "text-center mb-8" : "mb-8"}>
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

        <div
          className={`flex-1 grid ${colClass} ${rowClass} gap-4 items-center justify-items-center`}
        >
          {logos.map((logo, i) => {
            const content = (
              <div
                className="w-40 h-24 flex flex-col items-center justify-center transition-all duration-300 grayscale hover:grayscale-0 hover:scale-105 hover:shadow-md hover:-translate-y-1 cursor-pointer"
                style={{
                  backgroundColor: isLight ? "#fff" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {logo.imageUrl ? (
                  <img
                    src={logo.imageUrl}
                    alt={logo.name}
                    className="h-8 w-auto object-contain"
                  />
                ) : logo.icon ? (
                  <div
                    className="text-3xl mb-1"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {logo.icon}
                  </div>
                ) : (
                  <span
                    className="text-lg font-medium"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: isLight
                        ? "var(--color-text-primary)"
                        : "var(--color-text-inverse)",
                    }}
                  >
                    {logo.name}
                  </span>
                )}
                {logo.label && (
                  <MonoText
                    className="text-[16px] mt-1"
                    style={{
                      color: isLight
                        ? "var(--color-text-muted)"
                        : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {logo.label}
                  </MonoText>
                )}
              </div>
            );

            return <div key={i}>{content}</div>;
          })}
        </div>
      </div>
    </SlideContainer>
  );
}
