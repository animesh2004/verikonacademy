"use client";

import { useEffect, useState } from "react";
import { Building2, Calendar, Mail, Phone, RefreshCw, Lock, LogOut, KeyRound } from "lucide-react";
import Link from "next/link";

type Registration = {
  id: string;
  created_at: string;
  organisation: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  cohort_size?: string;
  format?: string;
  goal?: string;
  notes?: string;
  status: string;
  stored_in?: string;
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [source, setSource] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("verikon_admin_key");
    if (saved) {
      setAdminKey(saved);
      fetchRegistrations(saved);
    }
  }, []);

  async function fetchRegistrations(keyToUse?: string) {
    const key = keyToUse || adminKey;
    if (!key) return;

    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/registrations", {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();

      if (res.status === 401 || !data.ok) {
        setIsAuthenticated(false);
        setAuthError(data.error || "Incorrect admin key. Access denied.");
        sessionStorage.removeItem("verikon_admin_key");
        return;
      }

      setIsAuthenticated(true);
      sessionStorage.setItem("verikon_admin_key", key);
      setRegistrations(data.registrations || []);
      setSource(data.source || "unknown");
    } catch {
      setAuthError("Failed to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAdminKey(keyInput.trim());
    fetchRegistrations(keyInput.trim());
  }

  function handleLogout() {
    sessionStorage.removeItem("verikon_admin_key");
    setIsAuthenticated(false);
    setAdminKey("");
    setKeyInput("");
    setRegistrations([]);
  }

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.organisation?.toLowerCase().includes(q) ||
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.toLowerCase().includes(q)
    );
  });

  // Render Passcode Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-36 pb-20 bg-[#090A0C] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#1a1a1a] bg-[#0f1012] p-8 sm:p-10 text-center">
          <div className="size-12 rounded-2xl bg-[#16181b] border border-[#262626] mx-auto grid place-items-center text-accent">
            <Lock className="size-6" />
          </div>

          <h1 className="mt-5 font-display font-bold text-2xl text-white">
            Admin Access Required
          </h1>
          <p className="mt-2 text-sm text-muted">
            Enter your admin passcode to access institutional registration records.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="field text-center tracking-widest text-sm"
                required
                autoFocus
              />
            </div>

            {authError && (
              <p role="alert" className="text-xs text-[color:var(--destructive)]">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary justify-center"
            >
              {loading ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Render Authenticated Dashboard
  return (
    <main className="min-h-screen pt-28 sm:pt-36 pb-20 bg-[#090A0C] text-white">
      <div className="shell">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a1a] pb-6">
          <div>
            <div className="eyebrow mb-2">Internal Dashboard</div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Institutional Registrations
            </h1>
            <p className="mt-1 text-sm text-muted">
              Live leads submitted via the Verikon Academy registration flow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchRegistrations()}
              className="btn btn-ghost text-xs px-3 py-2 border border-[#262626] hover:bg-[#16181B]"
              disabled={loading}
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-ghost text-xs px-3 py-2 border border-[#262626] hover:bg-[#16181B] text-muted hover:text-white"
            >
              <LogOut className="size-3.5" />
              Lock
            </button>
            <Link href="/" className="btn btn-ghost text-xs px-3 py-2 border border-[#262626]">
              View Site
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0f1012] p-5">
            <span className="text-xs uppercase tracking-wider text-subtle">Total Submissions</span>
            <div className="mt-2 font-display font-bold text-3xl text-white">
              {registrations.length}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0f1012] p-5">
            <span className="text-xs uppercase tracking-wider text-subtle">Backend Storage</span>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
              <span className="font-display font-semibold text-lg text-white">
                {source === "supabase" ? "Supabase Connected" : "Local Storage (Active)"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0f1012] p-5">
            <span className="text-xs uppercase tracking-wider text-subtle">Latest Request</span>
            <div className="mt-2 text-sm text-muted truncate">
              {registrations[0]
                ? `${registrations[0].organisation} (${new Date(registrations[0].created_at).toLocaleDateString()})`
                : "None yet"}
            </div>
          </div>
        </div>

        {/* Search & List */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by college, contact name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field max-w-md text-sm py-2 px-4"
            />
            <span className="text-xs text-subtle self-center">
              Showing {filtered.length} of {registrations.length} requests
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0f1012] p-12 text-center text-muted text-sm">
              <RefreshCw className="size-6 animate-spin mx-auto mb-3 text-accent" />
              Loading submissions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#262626] bg-[#0f1012] p-12 text-center">
              <Building2 className="size-10 text-subtle mx-auto mb-3" />
              <h3 className="font-display font-semibold text-lg text-white">No registrations found</h3>
              <p className="mt-1 text-sm text-muted max-w-sm mx-auto">
                {search ? "No leads matched your search query." : "When an institution registers, their request will appear here immediately."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#1a1a1a] bg-[#0f1012] p-6 hover:border-[#262626] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="font-display font-bold text-xl text-white">
                          {item.organisation}
                        </h2>
                        {item.role && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#16181b] border border-[#262626] text-muted">
                            {item.role}
                          </span>
                        )}
                        {item.stored_in && (
                          <span className="text-[10px] uppercase tracking-wider text-subtle">
                            via {item.stored_in}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                        <span className="font-medium text-white">{item.name}</span>
                        <a
                          href={`mailto:${item.email}`}
                          className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                        >
                          <Mail className="size-3.5 text-accent" />
                          {item.email}
                        </a>
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                        >
                          <Phone className="size-3.5 text-accent" />
                          {item.phone}
                        </a>
                      </div>
                    </div>

                    <div className="text-xs text-subtle shrink-0">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {new Date(item.created_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#16181b] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-subtle block uppercase tracking-wider text-[10px]">Cohort Size</span>
                      <span className="text-white font-medium mt-0.5 block">{item.cohort_size || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-subtle block uppercase tracking-wider text-[10px]">Format</span>
                      <span className="text-white font-medium mt-0.5 block">{item.format || "On-campus"}</span>
                    </div>
                    <div>
                      <span className="text-subtle block uppercase tracking-wider text-[10px]">Status</span>
                      <span className="text-accent font-medium mt-0.5 block uppercase tracking-wider text-[11px]">{item.status || "new"}</span>
                    </div>
                  </div>

                  {(item.notes || item.goal) && (
                    <div className="mt-4 pt-3 border-t border-[#16181b] text-xs text-muted">
                      <span className="text-subtle font-medium">Notes / Requirements: </span>
                      {item.notes || item.goal}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
