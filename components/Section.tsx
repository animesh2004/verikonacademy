import clsx from "clsx";
import Reveal from "./Reveal";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  centered?: boolean;
  action?: React.ReactNode;
  /** Ambient colour wash behind the section. */
  glow?: "orange" | "blue" | "none";
};

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  centered = false,
  action,
  glow = "blue",
}: Props) {
  return (
    <section
      id={id}
      className={clsx(
        "py-20 sm:py-24 md:py-28 lg:py-32 border-t border-[#1a1a1a] relative overflow-hidden",
        className
      )}
    >
      {glow !== "none" && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className={clsx(
              "absolute top-0 right-1/4 size-[20rem] md:size-[28rem] lg:size-[30rem] rounded-full",
              glow === "orange" ? "glow-orange" : "glow-blue"
            )}
          />
        </div>
      )}

      <div className="shell relative">
        <Reveal
          as="header"
          className={clsx(
            "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
            centered && "md:flex-col md:items-center text-center"
          )}
        >
          <div className={clsx("max-w-3xl", centered && "mx-auto")}>
            {eyebrow && <div className="eyebrow mb-4 sm:mb-5">{eyebrow}</div>}
            <h2 className="font-display font-bold tracking-tightest text-4xl sm:text-5xl md:text-6xl text-balance text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </Reveal>
        {children && <div className="mt-12 sm:mt-14 md:mt-16">{children}</div>}
      </div>
    </section>
  );
}
