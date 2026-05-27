import Link from 'next/link';
import { getJournalPosts } from '@/lib/content';
import Reveal from '@/components/Reveal';

export const revalidate = 60;
export const metadata = { title: 'Journal' };

export default async function JournalPage() {
  const journal = await getJournalPosts();
  const featured = journal[0];
  const rest = journal.slice(1);

  return (
    <div>
      <section className="pt-44 pb-16">
        <div className="container-luxe">
          <Reveal>
            <div className="eyebrow">The Journal</div>
            <h1 className="hero-headline mt-6 max-w-3xl">Writing on craft, design, and hospitality.</h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-28">
        <div className="container-luxe">
          {featured && (
            <Reveal>
              <Link href={`/journal/${featured.slug}`} className="group block mb-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                  <div className="md:col-span-7 relative aspect-[16/10] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] group-hover:scale-105"
                      style={{ backgroundImage: `url(${featured.image})` }}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>
                      Featured · {featured.category}
                    </div>
                    <h2 className="font-display text-3xl md:text-5xl mt-4 leading-tight">{featured.title}</h2>
                    <p className="mt-6 leading-relaxed" style={{ color: 'var(--c-muted)' }}>{featured.excerpt}</p>
                    <div className="mt-6 text-[0.7rem] tracking-luxe" style={{ color: 'var(--c-muted)' }}>
                      {new Date(featured.publishedAt).toLocaleDateString()} · {featured.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-12" style={{ borderColor: 'var(--c-line)' }}>
              {rest.map((j, i) => (
                <Reveal key={j.id} delay={i * 80}>
                  <Link href={`/journal/${j.slug}`} className="block group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] group-hover:scale-105"
                        style={{ backgroundImage: `url(${j.image})` }}
                      />
                    </div>
                    <div className="mt-5">
                      <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>{j.category}</div>
                      <h3 className="font-display text-2xl mt-3 leading-tight">{j.title}</h3>
                      <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--c-muted)' }}>{j.excerpt}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
