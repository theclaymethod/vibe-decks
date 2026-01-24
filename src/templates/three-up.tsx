import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  type SlideMode,
} from "@/design-system";

interface ThreeUpItem {
  imageUrl: string;
  title: string;
  subtitle?: string;
}

interface ThreeUpTemplateProps {
  eyebrow?: string;
  title?: string;
  items: [ThreeUpItem, ThreeUpItem, ThreeUpItem];
  mode?: SlideMode;
  aspectRatio?: "square" | "portrait" | "landscape";
}

export function ThreeUpTemplate({
  eyebrow,
  title,
  items,
  mode = "white",
  aspectRatio = "portrait",
}: ThreeUpTemplateProps) {
  const isLight = mode === "white" || mode === "yellow";

  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-video",
  }[aspectRatio];

  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        {(eyebrow || title) && (
          <div className="mb-8 text-center">
            {eyebrow && (
              <Eyebrow
                className="text-[20px]"
                style={{ color: "var(--color-primary)" }}
              >
                {eyebrow}
              </Eyebrow>
            )}
            {title && (
              <SectionHeader
                className="mt-2"
                style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}
              >
                {title}
              </SectionHeader>
            )}
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
            {items.map((item, idx) => {
              const content = (
                <div className="flex flex-col group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                  <div className={`${aspectClass} rounded-lg overflow-hidden`}>
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url('${item.imageUrl}')` }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3
                      className="text-[26px]"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: isLight
                          ? "var(--color-text-primary)"
                          : "var(--color-text-inverse)",
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <MonoText
                        className="text-[20px] mt-1 block"
                        style={{
                          color: isLight
                            ? "var(--color-text-muted)"
                            : "rgba(255,255,255,0.6)",
                        }}
                      >
                        {item.subtitle}
                      </MonoText>
                    )}
                  </div>
                </div>
              );

              return <div key={idx}>{content}</div>;
            })}
          </div>
        </div>
      </div>
    </SlideContainer>
  );
}
