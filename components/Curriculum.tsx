"use client";

import Section from "./Section";
import Reveal from "./Reveal";
import { workshop } from "@/lib/workshop";
import { Clock, Calendar, Cpu, Sparkles, CheckCircle2 } from "lucide-react";

export default function Curriculum() {
  return (
    <Section
      id="curriculum"
      eyebrow="Curriculum"
      title={`${workshop.sessions} sessions, ${workshop.hours} hours across 2 intensive days`}
      description="From NVIDIA Jetson setup & OpenCV pipelines to TensorRT optimization, local SLMs, and Multimodal Vision-Language capstone build."
      glow="orange"
    >
      <div className="space-y-12 sm:space-y-16">
        {workshop.curriculum.map((dayPlan, dayIdx) => (
          <Reveal key={dayPlan.dayNumber} delay={dayIdx * 0.1}>
            <div className="relative rounded-3xl bg-[#0d0e10] border border-[#1f2128] overflow-hidden shadow-2xl">
              {/* Day Header */}
              <div className="p-6 sm:p-8 md:p-10 border-b border-[#1f2128] bg-gradient-to-r from-[#14161c] via-[#0d0e10] to-[#14161c] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent/15 text-accent border border-accent/30 flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      Day {dayPlan.dayNumber}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/5 text-muted border border-white/10 flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {dayPlan.totalHours}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                    {dayPlan.dayTitle}
                  </h3>
                  <p className="text-muted text-sm sm:text-base max-w-3xl">
                    {dayPlan.subtitle}
                  </p>
                </div>
              </div>

              {/* Sessions Grid / Timeline */}
              <div className="p-6 sm:p-8 md:p-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dayPlan.sessions.map((session, sessionIdx) => (
                  <div
                    key={session.session}
                    className="group relative flex flex-col justify-between rounded-2xl bg-[#0f1013] border border-[#1a1c23] p-6 hover:border-accent/40 hover:bg-[#121419] transition-all duration-300 shadow-lg hover:shadow-accent/5"
                  >
                    <div>
                      {/* Top Session Badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
                          {session.session}
                        </span>
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Clock className="size-3" />
                          {session.duration}
                        </span>
                      </div>

                      {/* Session Title */}
                      <h4 className="font-display font-bold text-lg text-white group-hover:text-accent transition-colors duration-200 mb-4 leading-snug">
                        {session.title}
                      </h4>

                      {/* Points list */}
                      <ul className="space-y-3">
                        {session.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex gap-2.5 text-sm text-muted leading-relaxed">
                            <CheckCircle2 className="size-4 text-accent/70 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
