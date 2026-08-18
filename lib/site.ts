/**
 * Single source of truth for brand + contact details.
 * Change the venture name, domain, and contact info here — nothing else hardcodes them.
 */
export const site = {
  name: "Verikon Academy",
  shortName: "Academy",
  parent: "Verikon",
  parentUrl: "https://verikon.vercel.app",
  tagline: "Hands-on Edge AI workshops",
  description:
    "A two-day, hands-on Edge AI workshop from Verikon covering model compression, on-device inference, and real hardware. Run on campus and live online.",
  url: "https://academy.verikon.ai",
  email: "workshops@verikon.ai",
  phone: "+91 00000 00000",
  location: "Gorakhpur & Agra, India, and online",
  social: {
    linkedin: "https://www.linkedin.com/company/verikon",
    x: "https://x.com/verikon",
    instagram: "https://instagram.com/verikon",
  },
} as const;

export const nav = [
  { href: "/#curriculum", label: "Curriculum" },
  { href: "/#branches", label: "Every branch" },
  { href: "/#venues", label: "Where we've taught" },
  { href: "/about", label: "About" },
] as const;
