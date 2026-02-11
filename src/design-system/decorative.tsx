import { cn } from "@/lib/utils";

export type IconSymbol = "star" | "cross" | "dots" | "asterisk" | "x" | "arrow" | "plus";

const SYMBOLS: Record<IconSymbol, string> = {
  star: "✦",
  cross: "⊕",
  dots: "::",
  asterisk: "✱",
  x: "×",
  arrow: "→",
  plus: "+",
};

export function IndustrialIcon({
  symbol,
  size = "md",
  className,
}: {
  symbol: IconSymbol;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-[10px]",
    md: "text-[14px]",
    lg: "text-[18px]",
  };

  return (
    <span
      className={cn(sizeClasses[size], "inline-block", className)}
      style={{ color: "var(--color-text-muted)" }}
    >
      {SYMBOLS[symbol]}
    </span>
  );
}

export function IconRow({
  icons,
  gap = "md",
  className,
}: {
  icons: IconSymbol[];
  gap?: "sm" | "md" | "lg";
  className?: string;
}) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  return (
    <div className={cn("flex items-center", gapClasses[gap], className)}>
      {icons.map((icon, i) => (
        <IndustrialIcon key={i} symbol={icon} />
      ))}
    </div>
  );
}

export function LogoMark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-[28px] font-bold tracking-[-0.02em] italic",
        className
      )}
      style={{
        fontFamily: "var(--font-heading)",
        color: "var(--color-text-primary)",
      }}
    >
      {text}
    </div>
  );
}

export function NavLink({
  children,
  active = false,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-[12px] tracking-[0.1em] uppercase font-medium cursor-pointer",
        active ? "underline underline-offset-4" : "",
        className
      )}
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
      }}
    >
      {children}
    </span>
  );
}

export function MenuIcon({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className="w-5 h-0.5"
        style={{ backgroundColor: "var(--color-text-primary)" }}
      />
      <div
        className="w-5 h-0.5"
        style={{ backgroundColor: "var(--color-text-primary)" }}
      />
      <div
        className="w-5 h-0.5"
        style={{ backgroundColor: "var(--color-text-primary)" }}
      />
    </div>
  );
}

export function CategoryGrid({
  items,
  className,
}: {
  items: Array<{
    title: string;
    subtitle?: string;
    icon?: IconSymbol;
  }>;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-4 gap-px", className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className="py-4 pl-4 border-l first:border-l-0 first:pl-0"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="text-[13px] font-semibold tracking-[0.05em] uppercase mb-1"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-text-primary)",
            }}
          >
            {item.title}
          </div>
          {item.subtitle && (
            <div
              className="text-[11px] tracking-[0.02em]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-secondary)",
              }}
            >
              {item.subtitle}
            </div>
          )}
          {item.icon && (
            <div className="mt-3">
              <IndustrialIcon symbol={item.icon} size="sm" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function FeatureBlock({
  eyebrow,
  title,
  description,
  icon,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: IconSymbol;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {eyebrow && (
        <div
          className="text-[11px] tracking-[0.1em] uppercase"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-muted)",
          }}
        >
          {eyebrow}
        </div>
      )}
      {icon && (
        <div className="text-[32px]">
          <IndustrialIcon symbol={icon} size="lg" />
        </div>
      )}
      <div
        className="text-[32px] leading-[1] uppercase"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </div>
      {description && (
        <div
          className="text-[14px] leading-[1.5]"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-secondary)",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}

export function CrosshairMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: 96, md: 160, lg: 256 };
  const px = dims[size];
  const tick = Math.round(px * 0.06);
  const ringSize = Math.round(px * 0.35);

  return (
    <div
      className={cn("relative", className)}
      style={{ width: px, height: px }}
    >
      {/* Vertical hair */}
      <div
        className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
        style={{ width: 1, backgroundColor: "var(--color-border)", opacity: 0.25 }}
      />
      {/* Horizontal hair */}
      <div
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
        style={{ height: 1, backgroundColor: "var(--color-border)", opacity: 0.25 }}
      />
      {/* Center ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: ringSize,
          height: ringSize,
          border: "1px solid var(--color-border)",
          opacity: 0.5,
        }}
      />
      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 4, height: 4, backgroundColor: "var(--color-border)" }}
      />
      {/* Corner ticks — top-left */}
      <div className="absolute top-0 left-0" style={{ width: tick, height: 1, backgroundColor: "var(--color-border)", opacity: 0.4 }} />
      <div className="absolute top-0 left-0" style={{ width: 1, height: tick, backgroundColor: "var(--color-border)", opacity: 0.4 }} />
      {/* Corner ticks — top-right */}
      <div className="absolute top-0 right-0" style={{ width: tick, height: 1, backgroundColor: "var(--color-border)", opacity: 0.4 }} />
      <div className="absolute top-0 right-0" style={{ width: 1, height: tick, backgroundColor: "var(--color-border)", opacity: 0.4 }} />
      {/* Corner ticks — bottom-left */}
      <div className="absolute bottom-0 left-0" style={{ width: tick, height: 1, backgroundColor: "var(--color-border)", opacity: 0.4 }} />
      <div className="absolute bottom-0 left-0" style={{ width: 1, height: tick, backgroundColor: "var(--color-border)", opacity: 0.4 }} />
      {/* Corner ticks — bottom-right */}
      <div className="absolute bottom-0 right-0" style={{ width: tick, height: 1, backgroundColor: "var(--color-border)", opacity: 0.4 }} />
      <div className="absolute bottom-0 right-0" style={{ width: 1, height: tick, backgroundColor: "var(--color-border)", opacity: 0.4 }} />
    </div>
  );
}

export function RuleGrid({
  className,
  divisions = 8,
  majorEvery = 4,
}: {
  className?: string;
  divisions?: number;
  majorEvery?: number;
}) {
  const lines = Array.from({ length: divisions - 1 }, (_, i) => i + 1);

  return (
    <div
      className={cn("w-full h-full relative", className)}
      style={{ border: "1px solid var(--color-border)", opacity: 0.8 }}
    >
      {lines.map((i) => {
        const pct = (i / divisions) * 100;
        const isMajor = i % majorEvery === 0;
        return (
          <div key={`v-${i}`}>
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: `${pct}%`,
                width: 1,
                backgroundColor: "var(--color-border)",
                opacity: isMajor ? 0.3 : 0.1,
              }}
            />
            <div
              className="absolute left-0 right-0"
              style={{
                top: `${pct}%`,
                height: 1,
                backgroundColor: "var(--color-border)",
                opacity: isMajor ? 0.3 : 0.1,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
