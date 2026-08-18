import Section from "./Section";
import Reveal from "./Reveal";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do I need an embedded or electronics background?",
    a: "No. We assume you can read and modify Python and that you have seen a machine-learning model before. Everything about the boards, flashing, and toolchains is covered from scratch.",
  },
  {
    q: "Do I need to buy any hardware?",
    a: "No. Boards, cameras, and sensors are provided during the workshop. If you want to keep working afterwards we will point you at a shopping list that costs less than you expect.",
  },
  {
    q: "Is it live, or recorded?",
    a: "Live, always. Campus sessions are in person with the hardware on the desk; the online cohort runs live over video with a shared remote board setup. Recordings are for revision, not a substitute.",
  },
  {
    q: "Can you run this at our college or company?",
    a: "Yes, that is how most of these have run so far. We bring the hardware and the instructors to you and adjust the depth to the group. Write to us with rough numbers and dates.",
  },
  {
    q: "What do I walk away with?",
    a: "A model you compressed yourself, running on a real device, plus the code and benchmarks that produced it. That artefact is worth more than a certificate, though you get one of those too.",
  },
  {
    q: "What if I miss a session?",
    a: "You get the recording and the session notes, and you can bring questions to the next office hour. Because this runs over two consecutive days, we would rather move you to the next cohort than have you miss half of it.",
  },
];

export default function FAQ() {
  return (
    <Section eyebrow="Questions" title="Before you register" centered glow="none">
      <div className="mx-auto max-w-3xl divide-y divide-[#1a1a1a] border-y border-[#1a1a1a]">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <details className="group py-6">
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none text-left">
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">{f.q}</h3>
                <ChevronDown
                  className="size-5 shrink-0 mt-1 text-muted transition-transform duration-250 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-4 text-muted leading-relaxed max-w-2xl text-left">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
