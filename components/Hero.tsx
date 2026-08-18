"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Cpu } from "lucide-react";
import ReserveButton from "./ReserveButton";
import { venues, workshop } from "@/lib/workshop";

export default function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const stats = [
    { value: `${workshop.days}`, label: "days, hands-on" },
    { value: `${workshop.hours}`, label: "hours of instruction" },
    { value: `${venues.length}`, label: "campuses taught so far" },
  ];

  return (
    <section className="relative pt-28 sm:pt-32 md:pt-44 pb-20 sm:pb-24 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.08] pointer-events-none" aria-hidden="true" />
      <div
        className="absolute top-0 left-0 size-[24rem] md:size-[32rem] lg:size-[40rem] rounded-full glow-orange pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-40 right-0 size-[20rem] md:size-[28rem] lg:size-[35rem] rounded-full glow-blue pointer-events-none"
        aria-hidden="true"
      />

      <div className="shell relative">
        <motion.h1
          {...rise(0)}
          className="font-display font-bold tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] max-w-[15ch] text-white"
        >
          AI that runs <span className="text-accent">on the device</span>, not the cloud.
        </motion.h1>

        <motion.p
          {...rise(0.12)}
          className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-muted leading-relaxed"
        >
          {workshop.summary}
        </motion.p>

        <motion.div {...rise(0.2)} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
          <ReserveButton className="btn btn-primary" showArrow />
          <Link href="/#curriculum" className="btn btn-ghost">
            <Cpu className="size-4" aria-hidden="true" />
            See the curriculum
          </Link>
        </motion.div>

        <motion.dl
          {...rise(0.32)}
          className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a] rounded-3xl overflow-hidden"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-[#0f1012] px-6 py-7">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display font-bold text-3xl tabular text-white">
                  {s.value}
                </span>
                <span className="mt-1 block text-sm text-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
