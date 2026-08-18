import { Cog, Cpu, Network, Terminal, Zap } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import { branches } from "@/lib/workshop";

const icons: Record<string, typeof Cpu> = {
  CSE: Terminal,
  IT: Network,
  ECE: Cpu,
  EE: Zap,
  ME: Cog,
};

export default function Branches() {
  return (
    <Section
      id="branches"
      eyebrow="Every branch"
      title="Wherever you study, this touches your subject"
      description="Edge AI sits where software, electronics, power and machines meet, which is why this is not a computer-science event. Here is what the same two days look like from each department."
      glow="orange"
    >
      <div className="grid gap-px bg-[#1a1a1a] border border-[#1a1a1a] rounded-3xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((b, i) => {
          const Icon = icons[b.code] ?? Cpu;
          return (
            <Reveal
              key={b.code}
              delay={i * 0.05}
              className="bg-[#0f1012] p-8 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <span className="grid place-items-center size-10 rounded-2xl border border-[#1a1a1a] bg-[#16181b]">
                  <Icon className="size-4 text-accent" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-white leading-none">
                    {b.code}
                  </h3>
                  <p className="mt-1 text-xs text-subtle">{b.name}</p>
                </div>
              </div>

              <p className="mt-6 text-white font-medium leading-snug">{b.hook}</p>
              <p className="mt-3 text-muted leading-relaxed">{b.body}</p>

              <div className="mt-auto pt-6">
                <p className="text-xs uppercase tracking-[0.16em] text-subtle">
                  You could leave with
                </p>
                <p className="mt-2 text-sm text-muted-strong leading-relaxed">{b.project}</p>
              </div>
            </Reveal>
          );
        })}

        {/* Fills the trailing grid cell so the 5-card row does not end ragged. */}
        <Reveal
          delay={branches.length * 0.05}
          className="bg-[#0f1012] p-8 flex flex-col justify-center"
        >
          <p className="font-display font-bold text-lg text-white leading-snug">
            Not on this list?
          </p>
          <p className="mt-3 text-muted leading-relaxed">
            Civil, chemical, biotech, instrumentation. If your field measures anything with a
            sensor, there is an Edge AI problem in it. Tell us your branch when you register
            and we will point the capstone at something you actually care about.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
