import Section from "./Section";
import Reveal from "./Reveal";
import { workshop } from "@/lib/workshop";

export default function Curriculum() {
  return (
    <Section
      id="curriculum"
      eyebrow="Curriculum"
      title={`${workshop.sessions} sessions, ${workshop.hours} hours, one working demo`}
      description="Every session ends with something running. The last one ends with your own model on your own board, in front of the room."
      glow="orange"
    >
      <div className="divide-y divide-[#1a1a1a] border-y border-[#1a1a1a]">
        {workshop.curriculum.map((m, i) => (
          <Reveal key={m.title} delay={i * 0.05}>
            <div className="py-8 sm:py-10 grid gap-6 md:grid-cols-[16rem_1fr] lg:grid-cols-[20rem_1fr]">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                {m.title}
              </h3>
              <ul className="space-y-3">
                {m.points.map((p) => (
                  <li key={p} className="flex gap-3 text-muted leading-relaxed">
                    <span
                      className="mt-2.5 size-1 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
