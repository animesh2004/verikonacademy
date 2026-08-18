import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Instructors from "@/components/Instructors";
import CTA from "@/components/CTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is the teaching arm of ${site.parent}, a hands-on Edge AI workshop taught by working engineers.`,
};

const principles = [
  {
    title: "One workshop, done properly",
    body: "We run Edge AI and nothing else. A narrow catalogue means the material gets rewritten after every cohort instead of being left to rot.",
  },
  {
    title: "Hardware on the desk",
    body: "You cannot learn on-device inference from slides. We bring the boards, the cameras, and the sensors, and you spend the two days with your hands on them.",
  },
  {
    title: "Teach what we ship",
    body: "The instructors work on production systems at Verikon the rest of the week. The examples come from work that went wrong last quarter, not from a textbook.",
  },
  {
    title: "Say when it is not a fit",
    body: "Turning away a registration costs us a seat. Taking someone who is not ready costs them two days and their money. We take the first cost.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-32 sm:pt-36 md:pt-44 pb-16 overflow-hidden">
        <div
          className="absolute top-0 left-0 size-[24rem] md:size-[32rem] rounded-full glow-orange pointer-events-none"
          aria-hidden="true"
        />
        <div className="shell relative">
          <div className="eyebrow mb-4">About</div>
          <h1 className="font-display font-bold tracking-tightest text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-balance max-w-[18ch] text-white">
            The teaching arm of {site.parent}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
            {site.parent} builds AI-native software for teams that need it to work in
            production. The same question kept arriving from clients, students, and their
            engineers: how do you get a model off a server and onto a device that has to answer
            in milliseconds, on battery, with no network. {site.name} is our answer: the same
            engineers, teaching the same material, in a room small enough to argue in.
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="shell">
          <div className="grid gap-px bg-[#1a1a1a] border border-[#1a1a1a] rounded-3xl overflow-hidden sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="bg-[#0f1012] p-8 sm:p-10">
                <h2 className="font-display font-bold text-xl text-white">{p.title}</h2>
                <p className="mt-3 text-muted leading-relaxed">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Instructors />
      <CTA />
    </>
  );
}
