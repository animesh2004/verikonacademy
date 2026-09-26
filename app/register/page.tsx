import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import { site } from "@/lib/site";
import { workshop } from "@/lib/workshop";

export const metadata: Metadata = {
  title: "Institutional Registration — Verikon Academy",
  description: `Register your college, university, or company cohort for the ${workshop.title} workshop. We bring hardware directly to your campus.`,
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
          <div className="eyebrow mb-4">Institutional Registration</div>
          <h1 className="font-display font-bold tracking-tightest text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-balance text-white">
            Host an Edge AI workshop at your campus
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Book hands-on hardware training for your college, university department, or organization.
            We bring real NVIDIA Jetson hardware, AI sensors, and full curriculum directly to your campus or lab.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_18rem] lg:gap-14">
          <RegisterForm />

          <aside className="lg:pt-4 space-y-8 text-sm">
            <div>
              <h2 className="font-display font-bold text-lg text-white">Campus delivery</h2>
              <p className="mt-2 text-muted leading-relaxed">
                We travel with NVIDIA Jetson development boards, camera sensors, and toolkits.
                Your campus only needs to provide standard workstations or laptops and a projector.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-lg text-white">Cohort sizes</h2>
              <p className="mt-2 text-muted leading-relaxed">
                Whether organizing for a focused 40-student lab or a 200+ student college-wide
                bootcamp, we calibrate our instructor-to-student ratio and hardware kits accordingly.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-lg text-white">Direct coordination</h2>
              <p className="mt-2 text-muted leading-relaxed">
                Need official proposals, MoUs, or custom curriculum tailoring for your department?
                Reach our workshops team directly:
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 inline-block text-white underline underline-offset-4 hover:text-accent transition-colors duration-250"
              >
                {site.email}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
