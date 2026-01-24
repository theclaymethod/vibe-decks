import { SlideContainer, TechCode, type SlideMode } from "@/design-system";

interface TitleTemplateProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  code?: string;
  author?: string;
  date?: string;
  mode?: SlideMode;
}

export function TitleTemplate({
  eyebrow,
  title,
  subtitle,
  tag,
  code,
  author,
  date,
  mode = "dark",
}: TitleTemplateProps) {
  return (
    <SlideContainer mode={mode} className="relative flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center max-w-5xl">
          {eyebrow && (
            <div className="mb-6">
              <span
                className="text-[18px] tracking-[0.2em] uppercase font-medium"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text-muted)",
                }}
              >
                {eyebrow}
              </span>
            </div>
          )}

          <h1
            className="text-[clamp(6rem,14vw,10rem)] uppercase tracking-[-0.02em] leading-[0.85]"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-text-primary)",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="mx-auto mt-8 max-w-3xl text-[26px] leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-secondary)",
              }}
            >
              {subtitle}
            </p>
          )}

          {tag && (
            <div className="mt-10 flex items-center justify-center">
              <div
                className="px-6 py-3 text-[16px] tracking-[0.15em] uppercase font-medium border-2"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text-primary)",
                  borderColor: "var(--color-border)",
                }}
              >
                {tag}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          {code && <TechCode size="sm">{code}</TechCode>}
        </div>
        <div
          className="flex items-center gap-6 text-[16px] tracking-[0.15em] uppercase"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-muted)",
          }}
        >
          {author && <span>{author}</span>}
          {author && date && (
            <span
              className="h-4 w-px"
              style={{ backgroundColor: "var(--color-border)" }}
            />
          )}
          {date && <span>{date}</span>}
        </div>
      </div>
    </SlideContainer>
  );
}
