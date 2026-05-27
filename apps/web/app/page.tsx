import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  getHero,
  getServices,
  getProjects,
  getAbout,
  getSite,
} from '@/lib/content';
import Reveal from '@/components/Reveal';
import ServiceIcon from '@/components/ServiceIcon';
import HeroLinesLazy from '@/components/HeroLinesLazy';

export const revalidate = 60;

export default async function Home() {
  const [site, hero, services, projects, about] = await Promise.all([
    getSite(),
    getHero(),
    getServices(),
    getProjects({ featuredOnly: true }),
    getAbout(),
  ]);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hero.image})` }} />
        <div className="absolute inset-0 hero-gradient" />
        <HeroLinesLazy accent={site.themeAccent} />

        <div className="relative container-luxe pt-40 md:pt-52 pb-24">
          <Reveal>
            <div className="eyebrow" style={{ color: 'var(--c-accent)' }}>{hero.eyebrow}</div>
          </Reveal>
          <h1 className="hero-headline mt-6 max-w-3xl">
            {hero.headlineLines.map((line, i) => (
              <Reveal key={i} as="span" delay={i * 120} className="block">
                {line}
              </Reveal>
            ))}
          </h1>
          <Reveal delay={500}>
            <p className="mt-8 max-w-md text-sm md:text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              {hero.description}
            </p>
          </Reveal>
          <Reveal delay={650}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/work" className="btn-primary">
                {hero.primaryCta} <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={850}>
            <div className="absolute right-4 md:right-12 bottom-32 md:bottom-40 flex items-center gap-3 hide-mobile">
              <Sparkles size={18} style={{ color: 'var(--c-accent)' }} />
              <span className="text-[0.65rem] tracking-luxe leading-tight" style={{ color: 'var(--c-muted)' }}>
                {hero.trustBadge}
              </span>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          <div
            className="container-luxe grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t"
            style={{ borderColor: 'var(--c-line)', background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(10px)' }}
          >
            {services.slice(0, 4).map((s, i) => (
              <Reveal key={s.id} delay={i * 100}>
                <Link
                  href="/services"
                  className="service-card block h-full"
                  style={{ borderLeft: i > 0 ? '1px solid var(--c-line)' : 'none' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-[color:var(--c-accent)] mt-1"><ServiceIcon name={s.icon} /></div>
                    <div className="flex-1">
                      <h3 className="text-[0.85rem] tracking-luxe uppercase">{s.title}</h3>
                      <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                        {s.description}
                      </p>
                      <span className="link-explore mt-5">Explore</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="py-28">
        <div className="container-luxe">
          <Reveal>
            <div className="flex items-end justify-between gap-6 mb-12">
              <div>
                <div className="eyebrow">Featured Work</div>
                <h2 className="section-headline mt-4">Recent stories we&apos;ve crafted.</h2>
              </div>
              <Link href="/work" className="link-explore hide-mobile">View All Projects</Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
            {projects.slice(0, 5).map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <Link href={`/work/${p.slug}`} className="tile block">
                  <div className="tile-image" style={{ backgroundImage: `url(${p.image})` }} />
                  <div className="tile-overlay" />
                  <div className="tile-content">
                    <div className="text-[0.6rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>
                      {p.category}
                    </div>
                    <h3 className="mt-2 font-display text-xl leading-tight">{p.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="only-mobile mt-8">
            <Link href="/work" className="link-explore">View All Projects</Link>
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="py-28">
        <div className="container-luxe grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <Reveal className="md:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${about.image})` }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.6))' }} />
            </div>
          </Reveal>
          <Reveal delay={150} className="md:col-span-6">
            <div className="eyebrow">{about.eyebrow}</div>
            <h2 className="section-headline mt-5">{about.headline}</h2>
            <p className="mt-8 text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              {about.body}
            </p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              {about.stats.map((st) => (
                <div key={st.id}>
                  <div className="font-display text-3xl md:text-4xl" style={{ color: 'var(--c-accent)' }}>{st.value}</div>
                  <div className="text-[0.7rem] tracking-luxe uppercase mt-2" style={{ color: 'var(--c-muted)' }}>{st.label}</div>
                </div>
              ))}
            </div>
            <Link href="/about" className="link-explore mt-10 inline-flex">Discover the studio</Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="container-luxe text-center">
          <Reveal>
            <div className="eyebrow justify-center inline-flex">Collaborate</div>
            <h2 className="section-headline mt-6 max-w-3xl mx-auto">
              We work with hotels that want to be remembered.
            </h2>
            <p className="mt-6 max-w-xl mx-auto text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              Tell us about your property, your audience, and your ambition. We will reply within two business days.
            </p>
            <Link href="/contact" className="btn-primary mt-10">
              Start a Conversation <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
