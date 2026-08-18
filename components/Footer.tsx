import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { nav, site } from "@/lib/site";
import { venues } from "@/lib/workshop";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0b0d]">
      {/* Extra bottom padding on phones so the sticky CTA bar never covers the
          last row of links. */}
      <div className="shell pt-16 sm:pt-20 pb-32 md:pb-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 max-w-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold tracking-tightest text-2xl text-white">
                {site.parent}
                <span className="text-accent">.</span>
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-subtle">
                {site.shortName}
              </span>
            </div>
            <p className="mt-4 text-muted leading-relaxed">{site.description}</p>
            <div className="mt-6 space-y-2 text-sm text-muted">
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-white transition-colors duration-250"
                >
                  {site.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                {site.location}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">The workshop</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors duration-250">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/register" className="text-accent hover:text-white transition-colors duration-250">
                  Reserve a seat
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Taught at</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {venues.map((v) => (
                <li key={v.slug}>
                  <Link href="/#venues" className="hover:text-white transition-colors duration-250">
                    {v.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-250">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href={site.parentUrl}
                  className="hover:text-white transition-colors duration-250"
                  target="_blank"
                  rel="noreferrer"
                >
                  {site.parent} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted">
          <p>
            © {year} {site.name}. A venture of{" "}
            <a
              href={site.parentUrl}
              className="text-white hover:text-accent transition-colors duration-250"
              target="_blank"
              rel="noreferrer"
            >
              {site.parent}
            </a>
            .
          </p>
          <div className="flex items-center gap-6">
            <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-250">
              LinkedIn
            </a>
            <a href={site.social.x} target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-250">
              X
            </a>
            <a href={site.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-250">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
