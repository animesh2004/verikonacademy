"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { branches, formatDate, workshop } from "@/lib/workshop";

type Status = "idle" | "submitting" | "done" | "error";

const experienceOptions = [
  "Student, no professional experience yet",
  "Just starting out",
  "1–3 years in the field",
  "3–7 years",
  "7+ years",
];

const attendingAs = [
  "Myself",
  "A student group / college",
  "A company team",
];

export default function RegisterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again, or email us directly.");
        return;
      }

      setStatus("done");
      setMessage(data.message ?? null);
    } catch {
      setStatus("error");
      setMessage("We could not reach the server. Please check your connection and try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-[#1a1a1a] bg-[#0f1012] p-10 text-center">
        <CheckCircle2 className="mx-auto size-10 text-accent" aria-hidden="true" />
        <h2 className="mt-5 font-display font-bold text-2xl text-white">Registration received</h2>
        <p className="mt-3 text-muted leading-relaxed max-w-md mx-auto">
          {message ??
            "We will email you within two working days with dates, joining details, and a short prep list. If it is urgent, just reply to that email."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-[#1a1a1a] bg-[#0f1012] p-7 sm:p-10"
    >
      <input type="hidden" name="courseSlug" value={workshop.slug} />

      <div className="grid gap-6 sm:grid-cols-2">
        {workshop.batches.length > 0 && (
          <div className="sm:col-span-2">
            <label className="label" htmlFor="batchStartsOn">
              Preferred dates
            </label>
            <select id="batchStartsOn" name="batchStartsOn" className="field" defaultValue="">
              <option value="">No preference, tell me what is available</option>
              {workshop.batches.map((b) => (
                <option key={b.startsOn} value={b.startsOn}>
                  {formatDate(b.startsOn)} · {b.where}
                  {b.seatsLeft === 0 ? " · waitlist" : ` · ${b.seatsLeft} seats left`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input id="name" name="name" className="field" autoComplete="name" required />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="phone">
            Phone <span className="font-normal text-subtle">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" className="field" autoComplete="tel" />
        </div>

        <div>
          <label className="label" htmlFor="organisation">
            College or company <span className="font-normal text-subtle">(optional)</span>
          </label>
          <input
            id="organisation"
            name="organisation"
            className="field"
            autoComplete="organization"
          />
        </div>

        <div>
          <label className="label" htmlFor="attendingAs">
            Registering as
          </label>
          <select id="attendingAs" name="attendingAs" className="field" defaultValue={attendingAs[0]}>
            {attendingAs.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="branch">
            Your branch
          </label>
          <select id="branch" name="branch" className="field" defaultValue="">
            <option value="">Select a branch</option>
            {branches.map((b) => (
              <option key={b.code} value={b.code}>
                {b.code} ({b.name})
              </option>
            ))}
            <option value="Other">Other / not listed</option>
            <option value="N/A">Not a student</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="experience">
            Where are you starting from?
          </label>
          <select id="experience" name="experience" className="field" defaultValue="">
            <option value="">Prefer not to say</option>
            {experienceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="goal">
            What do you want to walk away with?
          </label>
          <textarea
            id="goal"
            name="goal"
            rows={4}
            className="field"
            placeholder="A sentence is plenty. If you have a device or a use case in mind, tell us. It shapes what we cover."
          />
        </div>
      </div>

      {status === "error" && message && (
        <p role="alert" className="mt-6 text-sm text-[color:var(--destructive)]">
          {message}
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
          {status === "submitting" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {status === "submitting" ? "Reserving your seat…" : "Reserve my seat"}
        </button>
        <p className="text-sm text-muted">No payment now. We confirm your seat by email first.</p>
      </div>
    </form>
  );
}
