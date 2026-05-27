import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80svh] flex items-center justify-center text-center px-6">
      <div>
        <div className="eyebrow justify-center inline-flex">404</div>
        <h1 className="hero-headline mt-6">Not all paths lead here.</h1>
        <p className="mt-6 max-w-md mx-auto" style={{ color: 'var(--c-muted)' }}>
          The page you&apos;re looking for has moved, or was never written.
        </p>
        <Link href="/" className="btn-primary mt-10">Return Home</Link>
      </div>
    </div>
  );
}
