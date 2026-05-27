'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

type SiteLike = { brandName: string; brandTagline: string; brandLogoUrl?: string | null };

export default function Navbar({ site }: { site: SiteLike }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled || open ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled || open ? 'blur(16px) saturate(140%)' : 'none',
        borderBottom: `1px solid ${scrolled || open ? 'var(--c-line)' : 'transparent'}`,
      }}
    >
      <div className="container-luxe flex items-center justify-between py-5 md:py-6">
        <Link href="/" className="flex flex-col leading-none" aria-label="Home">
          {site.brandLogoUrl ? (
            <img src={site.brandLogoUrl} alt={site.brandName} className="h-10 w-auto object-contain" />
          ) : (
            <>
              <span className="font-display text-2xl md:text-3xl tracking-luxe">{site.brandName}</span>
              <span className="text-[0.55rem] md:text-[0.6rem] tracking-luxe mt-1" style={{ color: 'var(--c-muted)' }}>
                {site.brandTagline}
              </span>
            </>
          )}
        </Link>

        <nav className="hide-mobile flex items-center gap-9">
          {LINKS.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="relative text-[0.72rem] tracking-luxe uppercase transition-colors duration-300"
                style={{ color: active ? 'var(--c-accent)' : undefined }}
              >
                {l.label}
                <span
                  className="absolute -bottom-2 left-0 h-px bg-current transition-all duration-500"
                  style={{ width: active ? '100%' : '0%' }}
                />
              </Link>
            );
          })}
        </nav>

        <Link href="/contact" className="hide-mobile btn-ghost">
          Let&apos;s Collaborate
        </Link>

        <button className="only-mobile p-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="only-mobile flex flex-col items-center gap-6 pb-8 pt-2">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-display text-2xl tracking-tight">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-ghost mt-2">
            Let&apos;s Collaborate
          </Link>
        </nav>
      )}
    </header>
  );
}
