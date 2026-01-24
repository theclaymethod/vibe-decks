import {
  SlideContainer,
  Eyebrow,
  SectionHeader,
  MonoText,
  type SlideMode,
} from "@/design-system";

interface TeamMember {
  name: string;
  role: string;
  imageUrl?: string;
  initials?: string;
}

interface TeamTemplateProps {
  eyebrow?: string;
  title: string;
  members: TeamMember[];
  columns?: 3 | 4 | 5 | 6;
  mode?: SlideMode;
}

export function TeamTemplate({
  eyebrow,
  title,
  members,
  columns = 4,
  mode = "white",
}: TeamTemplateProps) {
  const isLight = mode === "white" || mode === "yellow";

  const colClass = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[columns];

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
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
          >
            {title}
          </SectionHeader>
        </div>

        <div className={`flex-1 grid ${colClass} gap-6 items-center`}>
          {members.map((person, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 overflow-hidden"
                style={{
                  backgroundColor: person.imageUrl
                    ? "transparent"
                    : isLight
                      ? "#1a1a1a"
                      : "rgba(255,255,255,0.1)",
                }}
              >
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-2xl"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: isLight ? "#fff" : "var(--color-text-inverse)",
                    }}
                  >
                    {person.initials || person.name.split(" ").map(n => n[0]).join("")}
                  </span>
                )}
              </div>

              <h3
                className="text-[26px] transition-colors duration-300 group-hover:[color:var(--color-primary)]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: isLight
                    ? "var(--color-text-primary)"
                    : "var(--color-text-inverse)",
                }}
              >
                {person.name}
              </h3>

              <MonoText
                className="text-[14px] mt-1"
                style={{
                  color: isLight
                    ? "var(--color-text-muted)"
                    : "rgba(255,255,255,0.6)",
                }}
              >
                {person.role}
              </MonoText>
            </div>
          ))}
        </div>
      </div>
    </SlideContainer>
  );
}
