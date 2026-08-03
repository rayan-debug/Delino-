import Link from 'next/link';
import { getContact } from '@/lib/content';

type SiteLike = {
  brandName: string;
  brandTagline: string;
  footerNote: string;
  footerCopyright: string;
};

export default async function Footer({ site }: { site: SiteLike }) {
  const contact = await getContact();

  return (
    <footer className="relative pt-16 sm:pt-24 lg:pt-28 pb-10 mt-16 sm:mt-24 border-t" style={{ borderColor: 'var(--c-line)' }}>
      {/* Three columns only once there is genuinely room for them — at 768px
          the 12-col split left the brand mark wider than its own column. */}
      <div className="container-luxe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
        <div className="sm:col-span-2 lg:col-span-5 min-w-0">
          <div className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-luxe break-words">
            {site.brandName}
          </div>
          <div className="text-[0.7rem] tracking-luxe mt-2 break-words" style={{ color: 'var(--c-muted)' }}>
            {site.brandTagline}
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            {site.footerNote}
          </p>
        </div>

        <div className="lg:col-span-3 min-w-0">
          <div className="eyebrow mb-5">Navigate</div>
          <ul className="space-y-3 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/work">Work</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-4 min-w-0">
          <div className="eyebrow mb-5">Studio</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>{contact.address}</p>
          <p className="text-sm mt-3 break-words"><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
          <p className="text-sm mt-1" style={{ color: 'var(--c-muted)' }}>{contact.phone}</p>
          <div className="flex flex-wrap gap-4 mt-6">
            {contact.socials.map((s) => (
              <a key={s.id} href={s.href} className="text-[0.7rem] tracking-luxe uppercase">{s.label}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-luxe mt-12 sm:mt-16 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderColor: 'var(--c-line)' }}>
        <div className="text-[0.7rem] tracking-luxe" style={{ color: 'var(--c-muted)' }}>
          {site.footerCopyright} · {new Date().getFullYear()}
        </div>
        <div className="text-[0.7rem] tracking-luxe" style={{ color: 'var(--c-muted)' }}>
          Crafted with care
        </div>
      </div>
    </footer>
  );
}
