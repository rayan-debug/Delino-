import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getServices, getSite } from '@/lib/content';
import Reveal from '@/components/Reveal';
import ServiceIcon from '@/components/ServiceIcon';
import AmbientSceneLazy from '@/components/AmbientSceneLazy';

export const revalidate = 60;
export const metadata = { title: 'Services' };

export default async function ServicesPage() {
  const [services, site] = await Promise.all([getServices(), getSite()]);

  return (
    <div>
      <section className="relative pt-44 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <AmbientSceneLazy accent={site.themeAccent} />
        </div>
        <div className="container-luxe relative">
          <Reveal>
            <div className="eyebrow">What we do</div>
            <h1 className="hero-headline mt-6 max-w-3xl">Services crafted for hospitality.</h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              Four disciplines, one studio. We work end-to-end or alongside your in-house team — wherever the work needs craft.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-28">
        <div className="container-luxe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'var(--c-line)' }}>
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <div className="p-10 md:p-14 h-full" style={{ background: 'var(--c-bg)' }}>
                  <div className="flex items-start justify-between gap-6">
                    <div className="text-[color:var(--c-accent)]"><ServiceIcon name={s.icon} size={40} /></div>
                    <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-muted)' }}>
                      0{i + 1}
                    </div>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl mt-8 leading-tight">{s.title}</h2>
                  <p className="mt-5 text-sm md:text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                    {s.description}
                  </p>
                  <Link href="/contact" className="link-explore mt-10">Brief us</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'var(--c-line)' }}>
        <div className="container-luxe text-center">
          <Reveal>
            <h2 className="section-headline">Ready to start?</h2>
            <p className="mt-6 max-w-lg mx-auto" style={{ color: 'var(--c-muted)' }}>
              Send us a short brief. We will respond with directions and next steps.
            </p>
            <Link href="/contact" className="btn-primary mt-10">Start a brief <ArrowRight size={14} /></Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
