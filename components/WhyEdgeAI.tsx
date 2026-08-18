import { Banknote, Gauge, ShieldCheck, WifiOff } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import { workshop } from "@/lib/workshop";

const icons = [Gauge, ShieldCheck, Banknote, WifiOff];

export default function WhyEdgeAI() {
  return (
    <Section
      id="why-edge-ai"
      eyebrow="Why Edge AI"
      title="Four reasons the model belongs on the device"
      description="Not every problem needs edge inference. These are the four that make it non-negotiable, and the workshop is honest about the cases where a cloud API is simply the better answer."
      glow="orange"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
        {workshop.whyItMatters.map((p, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Reveal key={p.title} delay={i * 0.06} className="flex gap-5">
              <span className="shrink-0 grid place-items-center size-11 rounded-2xl border border-[#1a1a1a] bg-[#0f1012]">
                <Icon className="size-5 text-accent" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display font-bold text-xl text-white">{p.title}</h3>
                <p className="mt-2 text-muted leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
