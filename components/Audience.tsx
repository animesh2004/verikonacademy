import { CircuitBoard } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import { workshop } from "@/lib/workshop";

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((x) => (
        <li key={x} className="flex gap-3 text-muted leading-relaxed">
          <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          {x}
        </li>
      ))}
    </ul>
  );
}

export default function Audience() {
  return (
    <Section
      id="who-its-for"
      eyebrow="Fit"
      title="Who this is for, and what you need first"
      description="Prerequisites are stated plainly and we mean them. If you are not there yet, tell us where you are and we will say so honestly."
    >
      <div className="grid gap-12 lg:grid-cols-3">
        <Reveal>
          <h3 className="font-display font-bold text-xl text-white">Who it is for</h3>
          <List items={workshop.forWhom} />
        </Reveal>

        <Reveal delay={0.06}>
          <h3 className="font-display font-bold text-xl text-white">What you need first</h3>
          <List items={workshop.prerequisites} />
        </Reveal>

        <Reveal delay={0.12}>
          <h3 className="font-display font-bold text-xl text-white">Hardware you will use</h3>
          <ul className="mt-6 space-y-3">
            {workshop.hardware.map((h) => (
              <li key={h} className="flex gap-3 text-muted leading-relaxed">
                <CircuitBoard className="size-4 shrink-0 mt-1 text-accent" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-subtle leading-relaxed">
            Boards and sensors are provided during the workshop, so you do not need to buy
            anything to attend.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
