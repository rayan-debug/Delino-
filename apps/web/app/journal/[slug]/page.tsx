import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getJournalBySlug } from '@/lib/content';
import Reveal from '@/components/Reveal';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = await getJournalBySlug(slug);
  return { title: j?.title ?? 'Journal' };
}

export default async function JournalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = await getJournalBySlug(slug);
  if (!j) notFound();

  return (
    <div>
      <section className="pt-32 pb-8">
        <div className="container-luxe">
          <Link href="/journal" className="link-explore" style={{ flexDirection: 'row-reverse' }}>
            <ArrowLeft size={14} /> Back to Journal
          </Link>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-luxe max-w-4xl">
          <Reveal>
            <div className="text-[0.7rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>
              {j.category} · {new Date(j.publishedAt).toLocaleDateString()} · {j.readTime}
            </div>
            <h1 className="hero-headline mt-5">{j.title}</h1>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <section className="pb-12">
          <div className="container-luxe">
            <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${j.image})` }} />
          </div>
        </section>
      </Reveal>

      <section className="py-12">
        <div className="container-luxe max-w-3xl">
          <Reveal>
            <p className="text-xl leading-relaxed">{j.excerpt}</p>
            <div className="mt-10 space-y-6 text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              {(j.body || '').split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
