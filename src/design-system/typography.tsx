import { cn } from "@/lib/utils";

export type SlideMode = "dark" | "yellow" | "white";

export function HeroTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-[140px] leading-[0.85] tracking-[-0.02em] uppercase",
        className
      )}
      style={{
        fontFamily: "var(--font-heading)",
        color: "var(--color-text-primary)",
      }}
    >
      {children}
    </h1>
  );
}

export function SectionHeader({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h2
      className={cn(
        "text-[72px] leading-[0.9] tracking-[-0.01em] uppercase",
        className
      )}
      style={{
        fontFamily: "var(--font-heading)",
        color: "var(--color-text-primary)",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export function CategoryLabel({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div
        className="text-[20px] font-semibold tracking-[0.05em] uppercase"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          className="text-[18px] tracking-[0.02em]"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-secondary)",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

export function TechCode({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-[14px]",
    md: "text-[18px]",
    lg: "text-[22px]",
  };

  return (
    <span
      className={cn(
        sizeClasses[size],
        "tracking-[0.1em] uppercase",
        className
      )}
      style={{
        fontFamily: "var(--font-mono)",
        color: "var(--color-text-muted)",
      }}
    >
      {children}
    </span>
  );
}

export function SectionMarker({
  number,
  label,
  className,
}: {
  number: number;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn("text-[18px] tracking-[0.05em]", className)}
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--color-text-secondary)",
      }}
    >
      <span className="font-medium">{String(number).padStart(2, "0")}.</span>{" "}
      <span>{label}</span>
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block text-[18px] tracking-[0.15em] uppercase font-medium",
        className
      )}
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--color-text-secondary)",
      }}
    >
      {children}
    </span>
  );
}

export function MonoText({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("text-[20px] leading-[1.6]", className)}
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--color-text-secondary)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function BodyText({
  children,
  className,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-[20px] leading-[1.5]",
    md: "text-[24px] leading-[1.6]",
    lg: "text-[28px] leading-[1.6]",
  };

  return (
    <p
      className={cn(sizeClasses[size], className)}
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--color-text-secondary)",
      }}
    >
      {children}
    </p>
  );
}

export function Quote({
  children,
  attribution,
  className,
}: {
  children: React.ReactNode;
  attribution?: string;
  className?: string;
}) {
  return (
    <blockquote className={cn("relative", className)}>
      <p
        className="text-[52px] leading-[1.2] uppercase"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        "{children}"
      </p>
      {attribution && (
        <cite
          className="block mt-6 text-[18px] tracking-[0.15em] uppercase not-italic font-medium"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-muted)",
          }}
        >
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}

export function SlideNumber({
  number,
  total,
  className,
}: {
  number: number;
  total: number;
  className?: string;
}) {
  return (
    <div
      className={cn("text-[18px] tracking-[0.15em] uppercase font-medium", className)}
      style={{
        fontFamily: "var(--font-mono)",
        color: "var(--color-text-muted)",
      }}
    >
      {String(number).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </div>
  );
}

export function ListItem({
  number,
  children,
  className,
}: {
  number: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <span
        className="text-[16px] font-bold shrink-0 w-9 h-9 flex items-center justify-center border-2"
        style={{
          fontFamily: "var(--font-mono)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-primary)",
        }}
      >
        {String(number).padStart(2, "0")}
      </span>
      <span
        className="text-[22px] leading-[1.6] pt-0.5"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-text-secondary)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

export function PipeList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={cn("text-[18px] tracking-[0.02em]", className)}
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--color-text-secondary)",
      }}
    >
      {items.map((item, i) => (
        <span key={i}>
          {item}
          {i < items.length - 1 && (
            <span className="mx-2 opacity-50">|</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function Label({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "primary" | "dark";
  className?: string;
}) {
  const variantStyles = {
    default: {
      backgroundColor: "transparent",
      color: "var(--color-text-primary)",
      borderColor: "var(--color-border)",
    },
    primary: {
      backgroundColor: "var(--color-yellow)",
      color: "var(--color-black)",
      borderColor: "var(--color-yellow)",
    },
    dark: {
      backgroundColor: "var(--color-black)",
      color: "var(--color-white)",
      borderColor: "var(--color-black)",
    },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-4 py-2 text-[16px] tracking-[0.1em] uppercase font-semibold border-2",
        className
      )}
      style={{
        fontFamily: "var(--font-body)",
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
