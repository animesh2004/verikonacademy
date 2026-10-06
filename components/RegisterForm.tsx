"use client";

import { useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
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
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-[#1a1a1a] bg-[#0f1012] p-8 sm:p-12 text-center overflow-hidden relative"
      >
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-48 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Checkmark Badge */}
        <div className="relative mx-auto flex items-center justify-center size-20 sm:size-24 mb-6">
          {/* Breathing halo pulse */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-accent/25 blur-lg pointer-events-none"
          />

          {/* Outer circle badge with spring pop-in */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 22,
              delay: 0.05,
            }}
            className="absolute inset-0 rounded-full bg-[#161412] border border-accent/40 shadow-[0_0_25px_rgba(255,107,53,0.3)]"
          />

          {/* Animated SVG Circle & Tick */}
          <svg
            className="relative z-10 size-12 sm:size-14 text-accent"
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circle perimeter outline drawing in */}
            <motion.circle
              cx="26"
              cy="26"
              r="23"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0, rotate: -90 }}
              animate={{ pathLength: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
            />
            {/* Checkmark tick drawing in with delay */}
            <motion.path
              d="M15 27.5L22.5 35L37 19"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.32, ease: "easeOut" }}
            />
          </svg>
        </div>

        {/* Content with staggered fade-and-rise */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-accent/10 border border-accent/30 text-accent mb-3">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            Registration Confirmed
          </span>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            {submittedOrg ? `Registration received for ${submittedOrg}` : "Institutional Registration Received"}
          </h2>

          <p className="mt-3 text-muted leading-relaxed max-w-lg mx-auto text-sm sm:text-base">
            {message ??
              "Thank you for reaching out. We will review your campus requirements, hardware logistics, and cohort size, and get in touch within two working days to schedule a kickoff call."}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.55, ease: "easeOut" }}
            className="mt-7"
          >
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setMessage(null);
              }}
              className="inline-flex items-center gap-2 btn btn-ghost text-xs px-4 py-2.5 border border-[#262626] hover:border-accent/50 hover:bg-[#16181b] transition-all"
            >
              <RotateCcw className="size-3.5" />
              Submit another request
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
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
