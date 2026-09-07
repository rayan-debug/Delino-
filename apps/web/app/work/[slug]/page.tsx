import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getProjectBySlug, getProjects } from '@/lib/content';
import Reveal from '@/components/Reveal';
import GalleryMedia from '@/components/GalleryMedia';

export const revalidate = 60;

/**
 * Disciplines shot vertically. Their work is reels — 1080x1920 — so a landscape
 * card would pillarbox every clip and waste most of the frame.
 *
 * Matched as whole words in the project's category, which is free text edited
 * in the admin: "Products Production" and "Product Shots" both need to resolve
 * to the same shape without anyone remembering to update this list. Whole words
 * rather than substrings, because "Production" contains "product" — a substring
 * match turns "F&B Photo & Video Production" vertical by accident.
 */
const PORTRAIT_WORDS = new Set([
  'product',
  'products',
  'reel',
  'reels',
  'social',
  'tiktok',
  'vertical',
]);

function galleryShape(category: string) {
  const words = category.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  const portrait = words.some((w) => PORTRAIT_WORDS.has(w));
  return portrait
    ? // Reels are tall, so three to a row keeps them from dominating the page.
      // Three from the small breakpoint up, not just on large screens — a tall
      // card two-up on a laptop takes over the whole viewport.
      { aspect: 'aspect-[9/16]', grid: 'grid-cols-2 sm:grid-cols-3' }
    : { aspect: 'aspect-video', grid: 'grid-cols-1 sm:grid-cols-2' };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  return { title: p?.title ?? 'Project' };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) notFound();

  const all = await getProjects();
  const idx = all.findIndex((x) => x.slug === slug);
  const next = all[(idx + 1) % Math.max(all.length, 1)] ?? all[0];

  return (
    <div>
      <section className="pt-32 pb-12">
        <div className="container-luxe">
          <Link href="/work" className="link-explore" style={{ flexDirection: 'row-reverse' }}>
            <ArrowLeft size={14} /> Back to work
          </Link>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-luxe">
          <Reveal>
            <div className="text-[0.7rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>
              {p.category}{p.year ? ` · ${p.year}` : ''}
            </div>
            <h1 className="hero-headline mt-5 max-w-4xl">{p.title}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t" style={{ borderColor: 'var(--c-line)' }}>
              <div>
                <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-muted)' }}>Client</div>
                <div className="mt-2 font-display text-xl">{p.client ?? '—'}</div>
              </div>
              <div>
                <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-muted)' }}>Year</div>
                <div className="mt-2 font-display text-xl">{p.year ?? '—'}</div>
              </div>
              <div>
                <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-muted)' }}>Discipline</div>
                <div className="mt-2 font-display text-xl">{p.category}</div>
              </div>
              <div>
                <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-muted)' }}>Scope</div>
                <div className="mt-2 font-display text-xl">{(p.tags ?? []).join(', ') || '—'}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <section>
          <div className="container-luxe">
            <GalleryMedia src={p.image} aspect="aspect-[16/9]" />
          </div>
        </section>
      </Reveal>

      <section className="py-24">
        <div className="container-luxe grid grid-cols-1 md:grid-cols-12 gap-12">
          <Reveal className="md:col-span-4">
            <div className="eyebrow">The Brief</div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-8">
            <p className="text-lg md:text-xl leading-relaxed">{p.description}</p>
            <p className="mt-6 leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              We approached the work with restraint and intention. From the first sketches to the final cut, every decision was guided by one principle: feel inevitable.
            </p>
          </Reveal>
        </div>
      </section>

      {p.gallery && p.gallery.length > 0 && (
        <section className="pb-28">
          {/* Card shape follows the discipline — reels get tall cards, everything
              else landscape. `contain` fits each piece inside its card, so an odd
              one out is shown whole rather than cropped. */}
          <div className={`container-luxe grid ${galleryShape(p.category).grid} gap-6`}>
            {p.gallery.map((src, i) => (
              <GalleryMedia
                key={i}
                src={src}
                poster={p.image}
                aspect={galleryShape(p.category).aspect}
                fit="contain"
              />
            ))}
          </div>
        </section>
      )}

      {next && next.slug !== p.slug && (
        <section className="py-20 border-t" style={{ borderColor: 'var(--c-line)' }}>
          <div className="container-luxe flex items-center justify-between gap-6">
            <div className="text-[0.7rem] tracking-luxe uppercase" style={{ color: 'var(--c-muted)' }}>Next Project</div>
            <Link href={`/work/${next.slug}`} className="group flex items-center gap-6">
              <div className="text-right">
                <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>{next.category}</div>
                <div className="font-display text-2xl md:text-3xl">{next.title}</div>
              </div>
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
