import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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
          transition={{ duration: 0.2 }}
          className="text-[24px] leading-none select-none"
          style={{ color: "var(--color-text-muted)" }}
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
        borderRadius: expanded ? "var(--radius-lg)" : "0",
      }}
      transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
    >
      <motion.div layout="position">{preview}</motion.div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {detail}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const LIFT_MAP = { sm: -4, md: -8, lg: -12 } as const;

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
        scale: scale ? 1.02 : 1,
        boxShadow: shadow ? "var(--shadow-md)" : "none",
      }}
      transition={{ duration: 0.2 }}
      className={className}
      style={{ borderRadius: "var(--radius-sm)" }}
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
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 p-4"
            style={{
              [isTop ? "top" : "bottom"]: 0,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              color: "#FFFFFF",
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
  stagger = 0.1,
  delay = 0.2,
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
