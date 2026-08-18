import { Loader2 } from "lucide-react";
import { workshop } from "@/lib/workshop";

/**
 * Route-level loading UI for /register. Shown by Next.js while the page
 * streams in — pairs with the pending state on ReserveButton so there is
 * never a moment where a tap appears to have done nothing.
 */
export default function RegisterLoading() {
  return (
    <section className="relative pt-32 sm:pt-36 md:pt-44 pb-24 overflow-hidden">
      <div
        className="absolute top-0 right-0 size-[22rem] md:size-[30rem] rounded-full glow-blue pointer-events-none"
        aria-hidden="true"
      />
      <div className="shell relative">
        <div
          className="flex flex-col items-center text-center py-16"
          role="status"
          aria-live="polite"
        >
          <span className="relative grid place-items-center size-16">
            <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
            <Loader2 className="size-8 text-accent animate-spin" aria-hidden="true" />
          </span>

          <h1 className="mt-8 font-display font-bold tracking-tightest text-3xl sm:text-4xl text-white">
            Preparing a seat for you…
          </h1>
          <p className="mt-4 max-w-md text-muted leading-relaxed">
            Just a moment while we open the {workshop.title} registration form.
          </p>
        </div>

        {/* Skeleton of the form beneath, so the layout does not jump when it
            arrives. */}
        <div
          className="mt-4 rounded-3xl border border-[#1a1a1a] bg-[#0f1012] p-7 sm:p-10 animate-pulse"
          aria-hidden="true"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-28 rounded bg-[#1a1a1a]" />
                <div className="mt-2 h-12 rounded-2xl bg-[#16181b]" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <div className="h-3 w-44 rounded bg-[#1a1a1a]" />
              <div className="mt-2 h-28 rounded-2xl bg-[#16181b]" />
            </div>
          </div>
          <div className="mt-8 h-12 w-44 rounded-full bg-[#1a1a1a]" />
        </div>
      </div>
    </section>
  );
}
