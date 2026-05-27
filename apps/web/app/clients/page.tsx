import { getClients } from '@/lib/content';
import Reveal from '@/components/Reveal';

export const revalidate = 60;
export const metadata = { title: 'Clients' };

export default async function ClientsPage() {
  const clients = await getClients();
  return (
    <div>
      <section className="pt-44 pb-16">
        <div className="container-luxe">
          <Reveal>
            <div className="eyebrow">Trusted Worldwide</div>
            <h1 className="hero-headline mt-6 max-w-3xl">Partners we are proud to serve.</h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              A constellation of luxury hospitality groups and independent properties across the globe.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-luxe">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px border-t border-l" style={{ background: 'var(--c-line)', borderColor: 'var(--c-line)' }}>
            {clients.map((c, i) => (
              <Reveal key={c.id} delay={i * 50}>
                <div
                  className="aspect-[3/1.4] flex items-center justify-center px-6 transition-colors hover:bg-[color:var(--c-surface)]"
                  style={{ background: 'var(--c-bg)' }}
                  data-hover
                >
                  {c.logoUrl ? (
                    <img src={c.logoUrl} alt={c.name} className="max-h-12 w-auto opacity-80" />
                  ) : (
                    <span className="font-display text-xl md:text-2xl tracking-wide-luxe text-center">{c.name}</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
