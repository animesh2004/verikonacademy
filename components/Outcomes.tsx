import { Check } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import { workshop } from "@/lib/workshop";

export default function Outcomes() {
  return (
    <Section
      id="outcomes"
      eyebrow="Outcomes"
      title="What you will be able to do afterwards"
      description="Stated as capabilities, not topics covered. If you can't do these by the end, the workshop did not work."
    >
      <ul className="grid gap-px bg-[#1a1a1a] border border-[#1a1a1a] rounded-3xl overflow-hidden sm:grid-cols-2">
        {workshop.outcomes.map((o, i) => (
          <Reveal
            as="li"
            key={o}
            delay={i * 0.05}
            className="bg-[#0f1012] p-7 sm:p-8 flex gap-4"
          >
            <Check className="size-5 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
            <span className="text-muted-strong leading-relaxed">{o}</span>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
