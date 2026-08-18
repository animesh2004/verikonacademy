import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about the Edge AI workshop, campus sessions, or private cohorts.`,
};

const cards = [
  {
    icon: Mail,
    title: "Email",
    body: null,
    link: { href: `mailto:${site.email}`, label: site.email },
    note: "Replies within two working days.",
  },
  {
    icon: Phone,
    title: "Phone",
    body: null,
    link: { href: `tel:${site.phone.replace(/\s/g, "")}`, label: site.phone },
    note: "Weekdays, 10 AM – 6 PM IST.",
  },
  {
    icon: MapPin,
    title: "Where we run",
    body: site.location,
    link: null,
    note: "Campus sessions run in person; open cohorts run live online.",
  },
  {
    icon: Building2,
    title: "Campus & in-house sessions",
    body: "A student group or company team, with the hardware brought to you.",
    link: {
      href: `mailto:${site.email}?subject=Edge%20AI%20workshop%20-%20campus%20session`,
      label: "Start a conversation",
    },
    note: null,
  },
];

export default function ContactPage() {
  return (
    <section className="relative pt-32 sm:pt-36 md:pt-44 pb-24 sm:pb-28 overflow-hidden">
      <div
        className="absolute top-0 right-0 size-[22rem] md:size-[30rem] rounded-full glow-blue pointer-events-none"
        aria-hidden="true"
      />
      <div className="shell relative">
        <div className="max-w-2xl">
          <div className="eyebrow mb-4">Contact</div>
          <h1 className="font-display font-bold tracking-tightest text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-balance text-white">
            Talk to a person
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            If you are registering for the workshop, the{" "}
            <Link
              href="/register"
              className="text-white underline underline-offset-4 hover:text-accent transition-colors duration-250"
            >
              registration form
            </Link>{" "}
            is faster, and it reaches the same inbox with the context we need. For anything else,
            here is how to find us.
          </p>
        </div>

        <div className="mt-14 grid gap-px bg-[#1a1a1a] border border-[#1a1a1a] rounded-3xl overflow-hidden sm:grid-cols-2">
          {cards.map((c) => (
            <div key={c.title} className="bg-[#0f1012] p-8 sm:p-10">
              <c.icon className="size-5 text-accent" aria-hidden="true" />
              <h2 className="mt-4 font-display font-bold text-xl text-white">{c.title}</h2>
              {c.body && <p className="mt-2 text-muted leading-relaxed">{c.body}</p>}
              {c.link && (
                <a
                  href={c.link.href}
                  className="mt-2 inline-block text-muted hover:text-white transition-colors duration-250"
                >
                  {c.link.label}
                </a>
              )}
              {c.note && <p className="mt-3 text-sm text-subtle">{c.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
