"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { workshop } from "@/lib/workshop";

type Status = "idle" | "submitting" | "done" | "error";

const cohortSizes = [
  "30–60 students (Single batch)",
  "60–120 students (Department-wide)",
  "120–250 students (Campus-level / Multi-batch)",
  "250+ students (College summit / Hackathon)",
  "Custom / To be decided",
];

const roles = [
  "Faculty / Professor",
  "Head of Department (HOD) / Dean",
  "Training & Placement Officer (TPO)",
  "Student Club Lead / Student Representative",
  "Corporate Training Lead / HR",
  "Other",
];

const formats = [
  "On-campus (We bring edge hardware & kits to your campus)",
  "Live Online / Virtual",
  "Hybrid / Open to discussion",
];

export default function RegisterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [submittedOrg, setSubmittedOrg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const org = String(payload.organisation || "").trim();
    setSubmittedOrg(org);

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
        <CheckCircle2 className="mx-auto size-12 text-accent" aria-hidden="true" />
        <h2 className="mt-5 font-display font-bold text-2xl text-white">
          {submittedOrg ? `Registration received for ${submittedOrg}` : "Institutional Registration Received"}
        </h2>
        <p className="mt-3 text-muted leading-relaxed max-w-lg mx-auto">
          {message ??
            "Thank you for reaching out. We will review your campus requirements, hardware logistics, and cohort size, and get in touch within two working days to schedule a kickoff call."}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setMessage(null);
          }}
          className="mt-6 inline-flex items-center gap-2 btn btn-ghost text-xs px-4 py-2 border border-[#262626]"
        >
          <RotateCcw className="size-3.5" />
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-[#1a1a1a] bg-[#0f1012] p-7 sm:p-10"
    >
      {/* Bot honeypot trap */}
      <input
        type="text"
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: "none", position: "absolute", left: "-9999px" }}
      />
      <input type="hidden" name="courseSlug" value={workshop.slug} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="organisation">
            Institution / College / University name <span className="text-accent">*</span>
          </label>
          <input
            id="organisation"
            name="organisation"
            className="field"
            placeholder="e.g. Delhi Technological University, IIT Kanpur, or Company Name"
            autoComplete="organization"
            required
            minLength={2}
            maxLength={200}
          />
        </div>

        <div>
          <label className="label" htmlFor="name">
            Contact person name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            className="field"
            placeholder="e.g. Prof. Sharma / Dr. Verma / Animesh"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Official / Work email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field"
            placeholder="name@institution.edu or work email"
            autoComplete="email"
            required
            maxLength={200}
          />
        </div>

        <div>
          <label className="label" htmlFor="phone">
            Phone number <span className="text-accent">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="field"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            required
            minLength={7}
            maxLength={30}
          />
        </div>

        <div>
          <label className="label" htmlFor="role">
            Your role / designation
          </label>
          <select id="role" name="role" className="field" defaultValue={roles[0]}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="cohortSize">
            Expected cohort size <span className="text-accent">*</span>
          </label>
          <select id="cohortSize" name="cohortSize" className="field" defaultValue={cohortSizes[0]} required>
            {cohortSizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="format">
            Preferred format
          </label>
          <select id="format" name="format" className="field" defaultValue={formats[0]}>
            {formats.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="notes">
            Notes, preferred dates or lab details <span className="font-normal text-subtle">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            maxLength={2000}
            className="field"
            placeholder="Tell us about target student branches (e.g. CSE/ECE/AI), preferred dates or semester timeline, available lab setups, or any specific goals."
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
          {status === "submitting" ? "Submitting request…" : "Submit institutional registration"}
        </button>
        <p className="text-sm text-muted">
          No upfront payment. We reply within 2 working days with syllabus, hardware plan, and dates.
        </p>
      </div>
    </form>
  );
}
