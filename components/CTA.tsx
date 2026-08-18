import Reveal from "./Reveal";
import ReserveButton from "./ReserveButton";
import { site } from "@/lib/site";

export default function CTA() {
  return (
    <section id="closing-cta" className="border-t border-[#1a1a1a] relative overflow-hidden">
      <div
        className="absolute bottom-0 left-1/4 size-[24rem] md:size-[32rem] rounded-full glow-orange pointer-events-none"
        aria-hidden="true"
      />
      <div className="shell py-20 sm:py-24 md:py-28 relative">
        <Reveal className="rounded-3xl border border-[#1a1a1a] bg-[#0f1012] px-8 py-14 sm:px-14 sm:py-20 text-center">
          <h2 className="font-display font-bold tracking-tightest text-4xl sm:text-5xl md:text-6xl text-balance max-w-[20ch] mx-auto text-white">
            Bring Edge AI to your campus or team.
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-muted leading-relaxed">
            Seats are limited by the hardware we can carry. Tell us the size of your group and
            we will come to you, or reserve a seat in the next open cohort.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <ReserveButton className="btn btn-primary" showArrow />
            <a href={`mailto:${site.email}`} className="btn btn-ghost">
              Ask a question
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
