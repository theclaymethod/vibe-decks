import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  type SlideMode,
} from "@/design-system";

interface ComparisonRow {
  feature: string;
  before: boolean;
  after: boolean;
}

interface ComparisonTableTemplateProps {
  eyebrow?: string;
  title: string;
  rows: ComparisonRow[];
  beforeLabel?: string;
  afterLabel?: string;
  mode?: SlideMode;
}

export function ComparisonTableTemplate({
  eyebrow,
  title,
  rows,
  beforeLabel = "Before",
  afterLabel = "After",
  mode = "white",
}: ComparisonTableTemplateProps) {
  return (
    <SlideContainer mode={mode}>
      <div className="h-full flex flex-col">
        <div className="mb-10">
          {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
          <SectionHeader style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}>
            {title}
          </SectionHeader>
        </div>

        <div className="flex-1 flex items-center">
          <div
            className="w-full border-2"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div
              className="grid grid-cols-3 border-b-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div
                className="p-6 text-[18px] font-semibold uppercase tracking-[0.05em]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text-primary)",
                }}
              >
                Feature
              </div>
              <div
                className="p-6 text-center text-[18px] font-semibold uppercase tracking-[0.05em]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text-muted)",
                }}
              >
                {beforeLabel}
              </div>
              <div
                className="p-6 text-center text-[18px] font-semibold uppercase tracking-[0.05em]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text-primary)",
                  backgroundColor: "var(--color-yellow)",
                }}
              >
                {afterLabel}
              </div>
            </div>

            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b last:border-0 transition-colors duration-200 hover:bg-[var(--color-border)]/15"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className="p-6 text-[20px]"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {row.feature}
                </div>
                <div
                  className="p-6 text-center text-[28px] font-bold"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: row.before
                      ? "var(--color-text-primary)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {row.before ? "+" : "—"}
                </div>
                <div
                  className="p-6 text-center text-[28px] font-bold"
                  style={{
                    fontFamily: "var(--font-body)",
                    backgroundColor: "var(--color-yellow)",
                    color: "var(--color-black)",
                  }}
                >
                  {row.after ? "+" : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideContainer>
  );
}
