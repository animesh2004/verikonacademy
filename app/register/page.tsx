import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import { site } from "@/lib/site";
import { workshop } from "@/lib/workshop";

export const metadata: Metadata = {
  title: "Reserve a seat",
  description: `Register for the ${workshop.title} workshop. No payment upfront, we confirm your seat by email.`,
};

export default function RegisterPage() {
  return (
    <section className="relative pt-32 sm:pt-36 md:pt-44 pb-20 sm:pb-24 overflow-hidden">
      <div
        className="absolute top-0 right-0 size-[22rem] md:size-[30rem] rounded-full glow-blue pointer-events-none"
        aria-hidden="true"
      />
      <div className="shell relative">
        <div className="max-w-2xl">
          <div className="eyebrow mb-4">Registration</div>
          <h1 className="font-display font-bold tracking-tightest text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-balance text-white">
            Reserve a seat on {workshop.title}
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Registrations are read by a person, not a funnel. We reply within two working days
            with dates, joining details, and a short prep list. If we think the workshop is
            wrong for where you are, we will say so.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_18rem] lg:gap-14">
          <RegisterForm />

          <aside className="lg:pt-4 space-y-8 text-sm">
            <div>
              <h2 className="font-display font-bold text-lg text-white">Bringing a group?</h2>
              <p className="mt-2 text-muted leading-relaxed">
                Most of these run as campus or in-house sessions. Pick &ldquo;a student group&rdquo;
                or &ldquo;a company team&rdquo; above and tell us rough numbers. We bring the
                hardware to you.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-lg text-white">Prefer to talk first?</h2>
              <p className="mt-2 text-muted leading-relaxed">
                Email us with what you are trying to build and we will tell you whether this is
                the right workshop for it.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 inline-block text-white underline underline-offset-4 hover:text-accent transition-colors duration-250"
              >
                {site.email}
              </a>
            </div>

            <div>
              <h2 className="font-display font-bold text-lg text-white">Hardware</h2>
              <p className="mt-2 text-muted leading-relaxed">
                Boards, cameras, and sensors are provided. You only need a laptop.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
