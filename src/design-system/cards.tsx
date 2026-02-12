import { cn } from "@/lib/utils";
import type { IconSymbol } from "./decorative";
import { IndustrialIcon } from "./decorative";

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("p-6", className)}>
      {icon && <div className="text-[48px] mb-4">{icon}</div>}
      <h3
        className="text-[28px] mb-3"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h3>
      <p
        className="text-[20px] leading-[1.5]"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-text-secondary)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export function StatCard({
  value,
  label,
  sublabel,
  className,
}: {
  value: string;
  label: string;
  sublabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("p-6 text-center", className)}>
      <div
        className="text-[96px] leading-none mb-3"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        {value}
      </div>
      <div
        className="w-12 h-[3px] mx-auto mb-3"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
      <div
        className="text-[16px] tracking-[0.1em] uppercase font-medium"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-text-secondary)",
        }}
      >
        {label}
      </div>
      {sublabel && (
        <div
          className="text-[16px] mt-2"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-muted)",
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
}

export function QuoteCard({
  quote,
  attribution,
  role,
  className,
}: {
  quote: string;
  attribution: string;
  role?: string;
  className?: string;
}) {
  return (
    <div className={cn("p-8", className)}>
      <p
        className="text-[32px] leading-[1.25] italic mb-6"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 flex items-center justify-center"
          style={{ backgroundColor: "var(--color-text-primary)" }}
        >
          <span
            className="text-lg font-bold"
            style={{
              color: "var(--color-bg-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {attribution.charAt(0)}
          </span>
        </div>
        <div>
          <div
            className="text-[20px] font-medium"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-text-primary)",
            }}
          >
            {attribution}
          </div>
          {role && (
            <div
              className="text-[14px] tracking-[0.04em]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-muted)",
              }}
            >
              {role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function InfoCard({
  title,
  items,
  icon,
  className,
}: {
  title: string;
  items: string[];
  icon?: IconSymbol;
  className?: string;
}) {
  return (
    <div className={cn("pl-4", className)}>
      <div className="flex items-start justify-between mb-3">
        <h4
          className="text-[20px] font-semibold tracking-[0.04em] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-primary)",
          }}
        >
          {title}
        </h4>
        {icon && <IndustrialIcon symbol={icon} size="sm" />}
      </div>
      <div
        className="text-[18px]"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-text-secondary)",
        }}
      >
        {items.map((item, i) => (
          <span key={i}>
            {item}
            {i < items.length - 1 && (
              <span className="mx-2" style={{ color: "var(--color-text-muted)" }}>/</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProcessCard({
  number,
  title,
  description,
  className,
}: {
  number: number;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("p-5", className)}>
      <div
        className="text-[14px] font-mono mb-2"
        style={{ color: "var(--color-accent)" }}
      >
        {String(number).padStart(2, "0")}
      </div>
      <h4
        className="text-[26px] mb-3"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h4>
      {description && (
        <p
          className="text-[18px] leading-[1.5]"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-secondary)",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
