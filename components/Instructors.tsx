import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import { instructors } from "@/lib/workshop";

export default function Instructors() {
  return (
    <Section
      id="instructors"
      eyebrow="Instructors"
      title="The people in the room"
      description="Engineers from the Verikon team who work on this professionally the rest of the week."
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {instructors.map((p, i) => (
          <Reveal
            key={p.slug}
            delay={i * 0.06}
            className="rounded-3xl border border-[#1a1a1a] bg-[#0f1012] p-8"
          >
            {p.photo ? (
              <div className="relative size-14 rounded-full overflow-hidden border border-[#262626]">
                <Image src={p.photo} alt={p.name} fill sizes="56px" className="object-cover" />
              </div>
            ) : (
              <span
                aria-hidden="true"
                className="grid place-items-center size-14 rounded-full bg-[#16181b] border border-[#262626] font-display font-bold text-muted"
              >
                {p.initials}
              </span>
            )}
            <h3 className="mt-5 font-display font-bold text-xl text-white">{p.name}</h3>
            <p className="mt-1 text-sm text-accent">{p.role}</p>
            <p className="mt-4 text-muted leading-relaxed">{p.bio}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
