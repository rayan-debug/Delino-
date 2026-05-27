import { getAbout, getSite } from '@/lib/content';
import Reveal from '@/components/Reveal';
import AmbientSceneLazy from '@/components/AmbientSceneLazy';

export const revalidate = 60;
export const metadata = { title: 'About' };

export default async function AboutPage() {
  const [about, site] = await Promise.all([getAbout(), getSite()]);

  return (
    <div>
      <section className="relative pt-44 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <AmbientSceneLazy accent={site.themeAccent} />
        </div>
        <div className="container-luxe relative">
          <Reveal>
            <div className="eyebrow">{about.eyebrow}</div>
            <h1 className="hero-headline mt-6 max-w-4xl">{about.headline}</h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-luxe grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <Reveal className="md:col-span-7">
            <div className="aspect-[4/5] bg-cover bg-center" style={{ backgroundImage: `url(${about.image})` }} />
          </Reveal>
          <Reveal delay={150} className="md:col-span-5">
            <p className="text-lg leading-relaxed">{about.body}</p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              {about.stats.map((st) => (
                <div key={st.id}>
                  <div className="font-display text-4xl" style={{ color: 'var(--c-accent)' }}>{st.value}</div>
                  <div className="text-[0.7rem] tracking-luxe uppercase mt-2" style={{ color: 'var(--c-muted)' }}>{st.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'var(--c-line)' }}>
        <div className="container-luxe">
          <Reveal><div className="eyebrow">Our Values</div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px mt-10" style={{ background: 'var(--c-line)' }}>
            {about.values.map((v, i) => (
              <Reveal key={v.id} delay={i * 80}>
                <div className="p-8 h-full" style={{ background: 'var(--c-bg)' }}>
                  <div className="font-display text-3xl" style={{ color: 'var(--c-accent)' }}>0{i + 1}</div>
                  <h3 className="mt-6 font-display text-2xl">{v.title}</h3>
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
