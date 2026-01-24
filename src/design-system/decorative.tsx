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
          className="py-4 border-l first:border-l-0"
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

export function WireframeBox({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
  };

  return (
    <svg
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      style={{ color: "var(--color-border)" }}
    >
      <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" />
      <path d="M50 10 L50 50" />
      <path d="M90 30 L50 50" />
      <path d="M10 30 L50 50" />
      <path d="M50 50 L50 90" />
      <path d="M50 50 L90 70" opacity="0.3" />
      <path d="M50 50 L10 70" opacity="0.3" />
      <rect x="20" y="40" width="20" height="20" />
      <rect x="60" y="40" width="20" height="20" />
      <path d="M30 60 L30 80 L70 80 L70 60" strokeDasharray="2 2" />
    </svg>
  );
}

export function IsometricGrid({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      style={{ color: "var(--color-border)" }}
    >
      <defs>
        <pattern id="iso-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 L10 0 M10 20 L20 10" />
          <path d="M0 10 L10 20 M10 0 L20 10" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#iso-grid)" />
      <rect x="60" y="80" width="40" height="40" strokeWidth="2" />
      <path d="M60 80 L80 60 L120 60 L100 80" strokeWidth="2" />
      <path d="M100 80 L120 60 L120 100 L100 120" strokeWidth="2" />
      <rect x="80" y="100" width="40" height="40" strokeWidth="1.5" opacity="0.6" />
      <path d="M80 100 L100 80 L140 80 L120 100" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}
