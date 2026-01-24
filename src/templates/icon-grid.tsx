import { SlideContainer, Eyebrow, SectionHeader, MonoText, type SlideMode } from "@/design-system";

interface IconItem {
  icon: React.ReactNode;
  label: string;
  description?: string;
}

interface IconGridTemplateProps {
  eyebrow?: string;
  title: string;
  items: IconItem[];
  columns?: 3 | 4 | 5 | 6;
  mode?: SlideMode;
}

export function IconGridTemplate({
  eyebrow,
  title,
  items,
  columns = 4,
  mode = "white",
}: IconGridTemplateProps) {
  const colClass = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[columns];

  const isLight = mode === "white" || mode === "yellow";

  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        <div className="mb-10">
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
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
          >
            {title}
          </SectionHeader>
        </div>

        <div className="flex-1 flex items-center">
          <div className={`grid ${colClass} gap-8 w-full`}>
            {items.map((item, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  style={{
                    backgroundColor: isLight
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.1)",
                    color: "var(--color-primary)",
                  }}
                >
                  {item.icon}
                </div>
                <MonoText
                  className="text-[14px] font-medium uppercase tracking-wider block"
                  style={{
                    color: isLight
                      ? "var(--color-text-primary)"
                      : "var(--color-text-inverse)",
                  }}
                >
                  {item.label}
                </MonoText>
                {item.description && (
                  <MonoText
                    className="text-[18px] mt-1 block"
                    style={{
                      color: isLight
                        ? "var(--color-text-muted)"
                        : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {item.description}
                  </MonoText>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideContainer>
  );
}
