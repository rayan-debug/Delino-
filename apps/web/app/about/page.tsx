import { getAbout, getSite } from '@/lib/content';
import Reveal from '@/components/Reveal';
import AmbientSceneLazy from '@/components/AmbientSceneLazy';

export const revalidate = 60;
export const metadata = { title: 'About' };

export default async function AboutPage() {
  const [about, site] = await Promise.all([getAbout(), getSite()]);

  return (
    <div>
      <section className="relative pt-32 sm:pt-40 lg:pt-44 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <AmbientSceneLazy accent={site.themeAccent} />
        </div>
        <div className="container-luxe relative">
          <Reveal>
            <div className="eyebrow">{about.eyebrow}</div>
            <h1 className="hero-headline mt-5 sm:mt-6 max-w-4xl text-balance">{about.headline}</h1>
          </Reveal>
        </div>
      </section>

      {/* Stays stacked through iPad portrait — splitting at Tailwind's md
          (768px) left the copy in a ~280px column right where the navbar is
          still in its mobile state. */}
      <section className="pb-16 sm:pb-24">
        <div className="container-luxe grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          <Reveal className="lg:col-span-7">
            <div
              className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] bg-cover bg-center"
              style={{ backgroundImage: `url(${about.image})` }}
            />
          </Reveal>
          <Reveal delay={150} className="lg:col-span-5">
            <p className="text-base sm:text-lg leading-relaxed">{about.body}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-x-5 gap-y-8 mt-8 sm:mt-10">
              {about.stats.map((st) => (
                <div key={st.id} className="min-w-0">
                  <div className="font-display text-3xl sm:text-4xl" style={{ color: 'var(--c-accent)' }}>
                    {st.value}
                  </div>
                  <div
                    className="text-[0.65rem] sm:text-[0.7rem] tracking-luxe uppercase mt-2 break-words"
                    style={{ color: 'var(--c-muted)' }}
                  >
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24 border-t" style={{ borderColor: 'var(--c-line)' }}>
        <div className="container-luxe">
          <Reveal><div className="eyebrow">Our Values</div></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px mt-8 sm:mt-10" style={{ background: 'var(--c-line)' }}>
            {about.values.map((v, i) => (
              <Reveal key={v.id} delay={i * 80}>
                <div className="p-6 sm:p-8 h-full" style={{ background: 'var(--c-bg)' }}>
                  <div className="font-display text-2xl sm:text-3xl" style={{ color: 'var(--c-accent)' }}>0{i + 1}</div>
                  <h3 className="mt-4 sm:mt-6 font-display text-xl sm:text-2xl">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
