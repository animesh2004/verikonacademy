import Image from "next/image";
import { ImageIcon, MapPin, Users } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import { venues } from "@/lib/workshop";

function PhotoPlaceholder({ venue }: { venue: string }) {
  return (
    <div className="aspect-[4/3] rounded-2xl border border-dashed border-[#262626] bg-[#0a0b0d] grid place-items-center text-center px-4">
      <div>
        <ImageIcon className="mx-auto size-6 text-subtle" aria-hidden="true" />
        <p className="mt-3 text-xs text-subtle leading-relaxed">
          Photo pending
          <br />
          {/* Path hint is for you, not visitors — hidden on phones where it
              would wrap into an unreadable block. */}
          <span className="hidden sm:inline text-faint break-words">
            add to public/images/venues/ and list it in lib/workshop.ts
          </span>
        </p>
        <span className="sr-only">No photographs published yet for {venue}.</span>
      </div>
    </div>
  );
}

export default function Venues() {
  return (
    <Section
      id="venues"
      eyebrow="Where we've taught"
      title="Run on campus, with real boards on the desk"
      description="We bring the hardware to you. These are the places this workshop has already run."
      glow="orange"
    >
      <div className="space-y-12">
        {venues.map((v, i) => (
          <Reveal key={v.slug} delay={i * 0.06}>
            <article className="rounded-3xl border border-[#1a1a1a] bg-[#0f1012] p-7 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12 lg:items-start">
                <div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                    {v.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="size-4 shrink-0 text-accent" aria-hidden="true" />
                      {v.city}
                    </span>
                    <span>{v.when}</span>
                    {v.attendees !== null && (
                      <span className="inline-flex items-center gap-2">
                        <Users className="size-4 shrink-0 text-accent" aria-hidden="true" />
                        {v.attendees} attendees
                      </span>
                    )}
                  </div>

                  <p className="mt-5 text-muted leading-relaxed">{v.blurb}</p>
                </div>

                {/* One photo per row on phones — a 4:3 image in a half-width
                    column on a 360px screen is too small to read. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {v.photos.length > 0
                    ? v.photos.map((src) => (
                        <div
                          key={src}
                          className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#1a1a1a]"
                        >
                          <Image
                            src={src}
                            alt={`Edge AI workshop at ${v.name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                      ))
                    : [0, 1].map((k) => <PhotoPlaceholder key={k} venue={v.name} />)}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
