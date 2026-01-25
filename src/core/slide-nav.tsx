import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { deckConfig } from "../../deck.config";
import { preloadSlide } from "@/deck/config";

export interface SlideNavItem {
  number: number;
  title: string;
  shortTitle: string;
}

interface SlideNavProps {
  slides: SlideNavItem[];
  currentSlide: number;
  onNavigate: (slide: number) => void;
}

export function SlideNav({ slides, currentSlide, onNavigate }: SlideNavProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const collapseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!deckConfig.navigation.autoCollapseNav) return;

    const autoCollapseTimer = setTimeout(() => {
      setIsExpanded(false);
    }, deckConfig.navigation.autoCollapseDelay);

    return () => clearTimeout(autoCollapseTimer);
  }, []);

  const handleMouseEnter = () => {
    if (collapseTimeout.current) {
      clearTimeout(collapseTimeout.current);
      collapseTimeout.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    collapseTimeout.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  const totalSlides = slides.length;

  return (
    <motion.nav
      className="h-full flex flex-col rounded-r-lg shadow-2xl shrink-0"
      style={{ backgroundColor: "var(--color-bg-dark)" }}
      initial={false}
      animate={{
        width: isExpanded ? 280 : 40,
        borderRadius: isExpanded ? "0 8px 8px 0" : "0 20px 20px 0",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            className="flex-1 flex flex-col items-center justify-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded-lg mb-3 cursor-pointer hover:bg-white/10 transition-colors"
              style={{ color: "var(--color-primary)" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <div
              className="text-[10px] text-white/50 font-medium"
              style={{
                fontFamily: "var(--font-body)",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                letterSpacing: "0.1em",
              }}
            >
              {String(currentSlide).padStart(2, "0")}/{totalSlides}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            className="flex-1 flex flex-col min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, delay: 0.1 }}
          >
            <div
              className="py-4 px-4 border-b flex items-center gap-3 shrink-0"
              style={{ borderColor: "var(--color-border-light)" }}
            >
              <div
                className="w-6 h-6 flex items-center justify-center shrink-0"
                style={{ color: "var(--color-primary)" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <span
                className="text-white text-xs tracking-[0.15em] uppercase font-medium whitespace-nowrap"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {deckConfig.title}
              </span>
            </div>

            <div
              className="flex-1 min-h-0 overflow-y-auto py-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.3) transparent",
              }}
            >
              {slides.map((slide) => {
                const isActive = currentSlide === slide.number;

                return (
                  <button
                    key={slide.number}
                    onClick={() => onNavigate(slide.number)}
                    onMouseEnter={() => preloadSlide(slide.number)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 transition-all relative text-left",
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute left-0 w-[3px] h-full"
                        style={{ backgroundColor: "var(--color-primary)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <span
                      className={cn(
                        "w-6 h-6 flex items-center justify-center text-[11px] shrink-0 rounded",
                        isActive ? "text-white bg-white/10" : "text-white/40"
                      )}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {String(slide.number).padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "text-[11px] tracking-[0.05em] whitespace-nowrap overflow-hidden",
                        isActive ? "text-white" : "text-white/60"
                      )}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {slide.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="py-4 px-4 border-t shrink-0"
              style={{ borderColor: "var(--color-border-light)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.15em] text-white/40 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Live Presentation
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
