import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
  color,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  const resolvedColor =
    color ?? (clamped >= 80 ? "var(--color-accent)" : "var(--color-text-muted)");

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute text-[14px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-text-primary)",
        }}
      >
        {Math.round(clamped)}
      </span>
    </div>
  );
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setCurrent(v));
    return unsubscribe;
  }, [display]);

  return (
    <span className={className}>
      {prefix}
      {current}
      {suffix}
    </span>
  );
}

export function TrendIndicator({
  trend,
  value,
  size = "md",
  className,
}: {
  trend: "up" | "down" | "flat";
  value?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const iconSize = { sm: 12, md: 16, lg: 20 }[size];
  const textSize = { sm: "14px", md: "16px", lg: "18px" }[size];

  const colors = {
    up: "var(--color-accent)",
    down: "var(--color-text-muted)",
    flat: "var(--color-text-muted)",
  };

  const arrows = {
    up: `M ${iconSize / 2} 2 L ${iconSize - 2} ${iconSize - 2} L 2 ${iconSize - 2} Z`,
    down: `M ${iconSize / 2} ${iconSize - 2} L ${iconSize - 2} 2 L 2 2 Z`,
    flat: `M 2 ${iconSize / 2 - 2} L ${iconSize - 2} ${iconSize / 2 - 2} L ${iconSize - 2} ${iconSize / 2 + 2} L 2 ${iconSize / 2 + 2} Z`,
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`}>
        <path d={arrows[trend]} fill={colors[trend]} />
      </svg>
      {value && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: textSize,
            color: colors[trend],
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  color,
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const trendUp = data[data.length - 1] > data[0];
  const resolvedColor =
    color ?? (trendUp ? "var(--color-accent)" : "var(--color-text-muted)");

  const lastX = padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2);
  const lastY =
    height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={resolvedColor}
        strokeWidth={1.5}
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      <rect
        x={lastX - 2.5}
        y={lastY - 2.5}
        width={5}
        height={5}
        fill={resolvedColor}
      />
    </svg>
  );
}

export function HarveyBall({
  rating,
  size = 24,
  className,
}: {
  rating: 0 | 1 | 2 | 3 | 4;
  size?: number;
  className?: string;
}) {
  const center = size / 2;
  const radius = size / 2 - 1;

  const fractions: Record<number, number> = { 0: 0, 1: 0.25, 2: 0.5, 3: 0.75, 4: 1 };
  const fraction = fractions[rating];

  const getArcPath = (f: number): string => {
    if (f === 0 || f === 1) return "";
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + 2 * Math.PI * f;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const large = f > 0.5 ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      <rect
        x={1}
        y={1}
        width={size - 2}
        height={size - 2}
        fill="var(--color-bg-secondary)"
      />
      {fraction === 1 ? (
        <rect
          x={1}
          y={1}
          width={size - 2}
          height={size - 2}
          fill="var(--color-text-primary)"
        />
      ) : fraction > 0 ? (
        <path d={getArcPath(fraction)} fill="var(--color-text-primary)" />
      ) : null}
      <rect
        x={1}
        y={1}
        width={size - 2}
        height={size - 2}
        fill="none"
        stroke="var(--color-text-primary)"
        strokeWidth={1}
      />
    </svg>
  );
}

export function MagnitudeBar({
  value,
  max = 5,
  color,
  className,
}: {
  value: number;
  max?: number;
  color?: string;
  className?: string;
}) {
  const clamped = Math.min(max, Math.max(0, value));
  const resolvedColor = color ?? "var(--color-accent)";

  return (
    <div className={cn("flex gap-[3px]", className)}>
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className="h-[14px] w-[14px]"
          style={{
            backgroundColor: i < clamped ? resolvedColor : "var(--color-bg-secondary)",
          }}
        />
      ))}
    </div>
  );
}
