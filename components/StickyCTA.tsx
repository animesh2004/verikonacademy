"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ReserveButton from "./ReserveButton";
import { workshop } from "@/lib/workshop";

/**
 * Always-available registration CTA.
 *
 * The navbar CTA is hidden below md, so on phones the only way to register was
 * to open the hamburger menu. This keeps the action one tap away at any scroll
 * position. It hides itself on /register (you are already there) and whenever
 * the big closing CTA is on screen, so the same button never appears twice.
 */
export default function StickyCTA() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [closingCtaVisible, setClosingCtaVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById("closing-cta");
    if (!target) {
      setClosingCtaVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setClosingCtaVisible(entry.isIntersecting),
      { rootMargin: "-80px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  const show = pathname !== "/register" && scrolledPastHero && !closingCtaVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 pointer-events-none"
        >
          {/* Phones: full-width bar with context, so the price/format is visible
              at the moment of decision. */}
          <div className="md:hidden pointer-events-auto border-t border-[#1a1a1a] bg-[rgba(9,10,12,0.92)] backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{workshop.title}</p>
                <p className="text-xs text-muted truncate">
                  {workshop.days} days · seats are limited
                </p>
              </div>
              <ReserveButton
                className="btn btn-primary h-11 px-5 shrink-0 whitespace-nowrap"
                pendingLabel="Preparing…"
              />
            </div>
          </div>

          {/* Desktop: a compact floating pill, bottom-right, out of the way of
              the reading column. */}
          <div className="hidden md:block pointer-events-auto">
            <div className="flex justify-end p-6 lg:p-8">
              <ReserveButton
                className="btn btn-primary shadow-[0_10px_40px_-10px_rgba(255,107,53,0.6)]"
                showArrow
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
