import Section from "./Section";
import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Reserve a seat",
    body: "Tell us where you are starting from: student, embedded developer, or somewhere in between. We read every registration and reply within two working days.",
  },
  {
    n: "02",
    title: "Get the prep list",
    body: "A short setup email: the toolchain to install and a repository to clone. Budget an hour. Nothing to buy, the boards are ours.",
  },
  {
    n: "03",
    title: "Two days on hardware",
    body: "Four sessions, each ending with something running. You spend more time at a terminal and a board than looking at slides.",
  },
  {
    n: "04",
    title: "Leave with it working",
    body: "Your model, quantized, deployed, and benchmarked on a real device, plus the code, the notes, and a channel with your cohort that stays open.",
  },
];

export default function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Four steps, no surprises"
      description="We run this the way we would want one run for us: clear scope, small rooms, real hardware."
    >
      <ol className="grid gap-px bg-[#1a1a1a] border border-[#1a1a1a] rounded-3xl overflow-hidden sm:grid-cols-2">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 0.06} className="bg-[#0f1012] p-8 sm:p-10">
            <span className="font-display font-bold text-sm text-accent tabular">{s.n}</span>
            <h3 className="mt-3 font-display font-bold text-xl text-white">{s.title}</h3>
            <p className="mt-3 text-muted leading-relaxed">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
