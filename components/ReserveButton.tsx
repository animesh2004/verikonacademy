"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowUpRight, Loader2 } from "lucide-react";

type Props = {
  className?: string;
  children?: React.ReactNode;
  /** Text shown while the route transition is pending. */
  pendingLabel?: string;
  showArrow?: boolean;
};

/**
 * Navigates to /register while showing an immediate pending state.
 *
 * A plain <Link> gives no feedback until the new route paints, which on a slow
 * connection reads as a dead button and gets tapped twice. useTransition lets us
 * flip the label the instant it is pressed.
 */
export default function ReserveButton({
  className,
  children = "Reserve a seat",
  pendingLabel = "Preparing a seat for you…",
  showArrow = false,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      aria-live="polite"
      onClick={() => startTransition(() => router.push("/register"))}
      className={clsx("group", className)}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        <>
          {children}
          {showArrow && (
            <ArrowUpRight
              className="size-4 transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </button>
  );
}
