import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "motion/react";
import { cn } from "@/lib/utils";
import {
  fadeInVariants,
  slideUpVariants,
  slideLeftVariants,
  scaleInVariants,
  staggerContainerVariants,
} from "./animations";

export function AccordionItem({
  trigger,
  children,
  defaultOpen = false,
  className,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn("border-b", className)}
      style={{ borderColor: "var(--color-border-light)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
      >
        <span>{trigger}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-[24px] leading-none select-none"
          style={{ color: "var(--color-text-muted)" }}
        >
          &darr;
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ExpandableCard({
  preview,
  detail,
  className,
}: {
  preview: React.ReactNode;
  detail: React.ReactNode;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setExpanded(false);
    }
  }, []);

  useEffect(() => {
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [expanded, handleClickOutside]);

  return (
    <motion.div
      ref={cardRef}
      layout
      onClick={() => setExpanded((v) => !v)}
      className={cn("cursor-pointer overflow-hidden", className)}
      style={{
        boxShadow: expanded ? "var(--shadow-xl)" : "none",
      }}
      transition={{ layout: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
    >
      <motion.div layout="position">{preview}</motion.div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {detail}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const LIFT_MAP = { sm: -3, md: -6, lg: -10 } as const;

export function HoverCard({
  children,
  lift = "md",
  shadow = true,
  scale = false,
  className,
}: {
  children: React.ReactNode;
  lift?: "sm" | "md" | "lg";
  shadow?: boolean;
  scale?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: LIFT_MAP[lift],
        scale: scale ? 1.01 : 1,
        boxShadow: shadow ? "var(--shadow-md)" : "none",
      }}
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverCaption({
  children,
  caption,
  position = "bottom",
  className,
}: {
  children: React.ReactNode;
  caption: React.ReactNode;
  position?: "bottom" | "top";
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  const isTop = position === "top";

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ y: isTop ? "-100%" : "100%" }}
            animate={{ y: 0 }}
            exit={{ y: isTop ? "-100%" : "100%" }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-x-0 p-4"
            style={{
              [isTop ? "top" : "bottom"]: 0,
              backgroundColor: "rgba(26, 10, 10, 0.9)",
              color: "#faf5f0",
            }}
          >
            {caption}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ENTRY_VARIANT_MAP = {
  fade: fadeInVariants,
  slideUp: slideUpVariants,
  slideLeft: slideLeftVariants,
  scale: scaleInVariants,
} as const;

export function AnimatedEntry({
  children,
  variant = "slideUp",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof ENTRY_VARIANT_MAP;
  delay?: number;
  className?: string;
}) {
  const variants = ENTRY_VARIANT_MAP[variant];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: variants.hidden,
        visible: {
          ...(typeof variants.visible === "object" ? variants.visible : {}),
          transition: {
            ...(typeof variants.visible === "object" &&
            variants.visible !== null &&
            "transition" in variants.visible
              ? (variants.visible.transition as Record<string, unknown>)
              : {}),
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  stagger = 0.08,
  delay = 0.15,
  className,
}: {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants(stagger, delay)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ShineBorder({
  children,
  color = "var(--color-accent)",
  radius = 500,
  borderWidth = 3,
  className,
}: {
  children: React.ReactNode;
  color?: string;
  radius?: number;
  borderWidth?: number;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const rect = currentTarget.getBoundingClientRect();
    const scaleX = currentTarget.offsetWidth / rect.width;
    const scaleY = currentTarget.offsetHeight / rect.height;
    mouseX.set((clientX - rect.left) * scaleX);
    mouseY.set((clientY - rect.top) * scaleY);
  }

  const background = useMotionTemplate`
    radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 70%)
  `;

  return (
    <div className={cn("relative group", className)} onMouseMove={handleMouseMove}>
      <motion.div
        className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          inset: `-${borderWidth}px`,
          background,
        }}
      />
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

export function PulseRing({
  size = 24,
  color = "var(--color-accent)",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="absolute"
        style={{ border: `2px solid ${color}` }}
        animate={{
          width: [size * 0.4, size],
          height: [size * 0.4, size],
          opacity: [0.6, 0],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <div
        style={{
          width: size * 0.4,
          height: size * 0.4,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

export function QuoteCarousel({
  quotes,
  interval = 5000,
  className,
}: {
  quotes: { text: string; attribution?: string }[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % quotes.length);
    }, interval);
    return () => clearInterval(timer);
  }, [quotes.length, interval]);

  const current = quotes[index];

  return (
    <div className={className}>
      <div className="relative overflow-hidden" style={{ minHeight: "4em" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <p
              className="text-[28px] leading-[1.25] italic"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text-primary)",
              }}
            >
              &ldquo;{current.text}&rdquo;
            </p>
            {current.attribution && (
              <p
                className="text-[14px] mt-3 tracking-[0.04em]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-text-muted)",
                }}
              >
                &mdash; {current.attribution}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {quotes.length > 1 && (
        <div className="flex gap-2 mt-4">
          {quotes.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className="h-[3px] transition-all duration-200 cursor-pointer"
              style={{
                width: i === index ? 32 : 6,
                backgroundColor:
                  i === index
                    ? "var(--color-accent)"
                    : "var(--color-border-light)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Tabs({
  items,
  className,
}: {
  items: { label: string; content: React.ReactNode }[];
  className?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className={className}>
      <div
        className="flex gap-0 border-b"
        style={{ borderColor: "var(--color-border-light)" }}
      >
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="px-5 py-3 text-[14px] tracking-[0.08em] uppercase cursor-pointer transition-colors duration-150"
            style={{
              fontFamily: "var(--font-mono)",
              color:
                i === active
                  ? "var(--color-text-primary)"
                  : "var(--color-text-muted)",
              backgroundColor: "transparent",
              borderBottom:
                i === active
                  ? "2px solid var(--color-accent)"
                  : "2px solid transparent",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="pt-6"
        >
          {items[active].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Tooltip({
  children,
  content,
  position = "top",
  className,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom";
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === "top" ? 4 : -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-1/2 -translate-x-1/2 z-50 px-3 py-2 whitespace-nowrap"
            style={{
              [position === "top" ? "bottom" : "top"]: "calc(100% + 8px)",
              backgroundColor: "var(--color-bg-dark, #1a0a0a)",
              color: "var(--color-text-inverse, #faf5f0)",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              border: "1px solid var(--color-border-light)",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SkeletonBlock({
  width,
  height = 20,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{
        width: width ?? "100%",
        height,
        backgroundColor: "var(--color-bg-secondary)",
      }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
