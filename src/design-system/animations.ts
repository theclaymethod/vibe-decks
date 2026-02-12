import type { Variants } from "motion/react";

const DURATION_DEFAULT = 0.35;
const DURATION_FAST = 0.25;
const EASE_SHARP = [0.4, 0, 0.2, 1] as const;

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION_FAST, ease: EASE_SHARP },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_DEFAULT, ease: EASE_SHARP },
  },
};

export const slideUpLargeVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_DEFAULT, ease: EASE_SHARP },
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION_DEFAULT, ease: EASE_SHARP },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION_FAST, ease: EASE_SHARP },
  },
};

export function staggerContainerVariants(
  stagger = 0.08,
  delay = 0.15,
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

export const hoverLift = { y: -3, transition: { duration: 0.15 } };

export const hoverLiftLarge = { y: -6, transition: { duration: 0.15 } };

export const hoverScale = { scale: 1.01, transition: { duration: 0.15 } };

export const hoverScaleLarge = { scale: 1.03, transition: { duration: 0.15 } };

export const pathDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut" },
  },
};
