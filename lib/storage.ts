import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
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

export function saveLocalRegistration(record: Record<string, unknown>): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let existing: unknown[] = [];
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
      status: "new",
      stored_in: "local_fallback",
    });

    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(existing, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[storage] Failed to save local registration fallback:", err);
    return false;
  }
}

export function getLocalRegistrations(): unknown[] {
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
