import fs from "fs";
import path from "path";

// On Vercel / serverless functions, only /tmp is writable.
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "verikon_data")
  : path.join(process.cwd(), "data");

const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");

export type StoredRegistration = {
  id: string;
  created_at: string;
  organisation: string;
  name: string;
  email: string;
  phone: string;
  role?: string | null;
  cohort_size?: string | null;
  format?: string | null;
  notes?: string | null;
  status: string;
  stored_in: "supabase" | "local_fallback";
};

export function isLocalDuplicate(email: string, courseSlug: string): boolean {
  try {
    const list = getLocalRegistrations() as Array<{ email?: string; course_slug?: string }>;
    const cleanEmail = email.trim().toLowerCase();
    return list.some(
      (r) =>
        r.email?.trim().toLowerCase() === cleanEmail &&
        r.course_slug === courseSlug
    );
  } catch {
    return false;
  }
}

export function saveLocalRegistration(record: Record<string, unknown>): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let existing: Array<Record<string, unknown>> = [];
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      try {
        const fileContent = fs.readFileSync(REGISTRATIONS_FILE, "utf-8");
        existing = JSON.parse(fileContent);
        if (!Array.isArray(existing)) existing = [];
      } catch {
        existing = [];
      }
    }

    existing.unshift({
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...record,
      status: (record.status as string) || "new",
      stored_in: "local_fallback",
    });

    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(existing, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[storage] Failed to save local fallback registration:", err);
    return false;
  }
}

export function getLocalRegistrations(): Array<Record<string, unknown>> {
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const fileContent = fs.readFileSync(REGISTRATIONS_FILE, "utf-8");
      const parsed = JSON.parse(fileContent);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error("[storage] Failed to read local registrations:", err);
  }
  return [];
}

export function deleteLocalRegistration(id: string): boolean {
  try {
    if (!fs.existsSync(REGISTRATIONS_FILE)) return false;
    const fileContent = fs.readFileSync(REGISTRATIONS_FILE, "utf-8");
    const parsed = JSON.parse(fileContent);
    if (!Array.isArray(parsed)) return false;

    const filtered = parsed.filter((r) => r.id !== id);
    if (filtered.length === parsed.length) return false;

    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[storage] Failed to delete local registration:", err);
    return false;
  }
}

export function updateLocalRegistrationStatus(id: string, status: string): boolean {
  try {
    if (!fs.existsSync(REGISTRATIONS_FILE)) return false;
    const fileContent = fs.readFileSync(REGISTRATIONS_FILE, "utf-8");
    const parsed = JSON.parse(fileContent);
    if (!Array.isArray(parsed)) return false;

    let updated = false;
    const nextList = parsed.map((r) => {
      if (r.id === id) {
        updated = true;
        return { ...r, status };
      }
      return r;
    });

    if (!updated) return false;

    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(nextList, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[storage] Failed to update local registration status:", err);
    return false;
  }
}
