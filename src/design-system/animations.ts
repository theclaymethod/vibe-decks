import type { Variants } from "motion/react";

const DURATION_DEFAULT = 0.4;
const DURATION_FAST = 0.3;
const EASE_OUT = "easeOut" as const;

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION_FAST, ease: EASE_OUT },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_DEFAULT, ease: EASE_OUT },
  },
};

export const slideUpLargeVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_DEFAULT, ease: EASE_OUT },
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION_DEFAULT, ease: EASE_OUT },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION_FAST, ease: EASE_OUT },
  },
};

export function staggerContainerVariants(
  stagger = 0.1,
  delay = 0.2,
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

export const hoverLift = { y: -4, transition: { duration: 0.2 } };

export const hoverLiftLarge = { y: -8, transition: { duration: 0.2 } };

export const hoverScale = { scale: 1.02, transition: { duration: 0.2 } };

export const hoverScaleLarge = { scale: 1.05, transition: { duration: 0.2 } };
