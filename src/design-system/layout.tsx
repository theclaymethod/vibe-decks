import { cn } from "@/lib/utils";
import type { SlideMode } from "./typography";

export function SlideContainer({
  children,
  className,
  mode = "white",
}: {
  children: React.ReactNode;
  className?: string;
  mode?: SlideMode;
}) {
  return (
    <div
      className={cn("w-full h-full p-[64px] overflow-hidden relative", className)}
      data-slide-mode={mode}
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      {children}
    </div>
  );
}

export function Divider({
  className,
  thickness = "thin",
}: {
  className?: string;
  thickness?: "thin" | "medium" | "thick";
}) {
  const heightMap = {
    thin: "h-px",
    medium: "h-0.5",
    thick: "h-1",
  };

  return (
    <div
      className={cn(heightMap[thickness], "w-full", className)}
      style={{ backgroundColor: "var(--color-border)" }}
    />
  );
}

export function TwoColumnLayout({
  left,
  right,
  className,
  ratio = "1:1",
  gap = "lg",
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  ratio?: "1:1" | "2:1" | "1:2" | "3:2" | "2:3";
  gap?: "sm" | "md" | "lg" | "xl";
}) {
  const ratioClasses = {
    "1:1": "grid-cols-2",
    "2:1": "grid-cols-[2fr_1fr]",
    "1:2": "grid-cols-[1fr_2fr]",
    "3:2": "grid-cols-[3fr_2fr]",
    "2:3": "grid-cols-[2fr_3fr]",
  };

  const gapClasses = {
    sm: "gap-6",
    md: "gap-8",
    lg: "gap-12",
    xl: "gap-16",
  };

  return (
    <div
      className={cn(
        "grid h-full",
        ratioClasses[ratio],
        gapClasses[gap],
        className
      )}
    >
      <div className="flex flex-col justify-center">{left}</div>
      <div className="flex flex-col justify-center">{right}</div>
    </div>
  );
}

export function GridSection({
  children,
  columns = 2,
  gap = "md",
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}) {
  const colClasses = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div className={cn("grid", colClasses[columns], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

export function CenterContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full text-center",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Container({
  children,
  className,
  maxWidth = "lg",
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
}

export function HeaderBar({
  left,
  center,
  right,
  className,
}: {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex-1">{left}</div>
      {center && <div className="flex-shrink-0">{center}</div>}
      <div className="flex-1 flex justify-end">{right}</div>
    </div>
  );
}
