import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-40 pb-32">
      <div className="shell text-center">
        <div className="eyebrow mb-4">404</div>
        <h1 className="font-display font-bold tracking-tightest text-4xl sm:text-5xl text-white">
          We could not find that page
        </h1>
        <p className="mt-5 text-muted">The link may be out of date.</p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary">
            Back home
          </Link>
          <Link href="/register" className="btn btn-ghost">
            Reserve a seat
          </Link>
        </div>
      </div>
    </section>
  );
}
