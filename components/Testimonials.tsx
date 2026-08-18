import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import { testimonials, venueBySlug } from "@/lib/workshop";

function Avatar({
  photo,
  initials,
  name,
}: {
  photo: string | null;
  initials: string;
  name: string;
}) {
  if (photo) {
    return (
      <div className="relative size-12 shrink-0 rounded-full overflow-hidden border border-[#262626]">
        <Image src={photo} alt={name} fill sizes="48px" className="object-cover" />
      </div>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="grid place-items-center size-12 shrink-0 rounded-full bg-[#16181b] border border-[#262626] font-display font-bold text-sm text-muted"
    >
      {initials}
    </span>
  );
}

export default function Testimonials() {
  return (
    <Section
      eyebrow="From past cohorts"
      title="What attendees said afterwards"
      description="Quotes from the students who sat through it, named by the campus where they attended."
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {testimonials.map((t, i) => {
          const venue = venueBySlug(t.venue);
          return (
            <Reveal
              key={`${t.name}-${i}`}
              delay={i * 0.06}
              className="flex flex-col rounded-3xl border border-[#1a1a1a] bg-[#0f1012] p-8"
            >
              <blockquote className="text-lg leading-relaxed text-muted-strong text-balance">
                “{t.quote}”
              </blockquote>

              <footer className="mt-auto pt-7 flex items-center gap-4">
                <Avatar photo={t.photo} initials={t.initials} name={t.name} />
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{t.name}</p>
                  <p className="text-sm text-muted truncate">{t.role}</p>
                  {venue && (
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-accent truncate">
                      {venue.name}
                    </p>
                  )}
                </div>
              </footer>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
