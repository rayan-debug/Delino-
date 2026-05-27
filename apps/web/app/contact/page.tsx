import { getContact, getSite } from '@/lib/content';
import Reveal from '@/components/Reveal';
import AmbientSceneLazy from '@/components/AmbientSceneLazy';
import ContactForm from './ContactForm';
import { submitContact } from './actions';

export const revalidate = 60;
export const metadata = { title: 'Contact' };

export default async function ContactPage() {
  const [contact, site] = await Promise.all([getContact(), getSite()]);

  return (
    <div>
      <section className="relative pt-44 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <AmbientSceneLazy accent={site.themeAccent} />
        </div>
        <div className="container-luxe relative">
          <Reveal>
            <div className="eyebrow">Get in touch</div>
            <h1 className="hero-headline mt-6 max-w-4xl">{contact.headline}</h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-28">
        <div className="container-luxe grid grid-cols-1 md:grid-cols-12 gap-12">
          <Reveal className="md:col-span-5 space-y-10">
            <div>
              <div className="eyebrow mb-4">Studio</div>
              <p className="text-lg leading-relaxed">{contact.address}</p>
              <a href={`mailto:${contact.email}`} className="block mt-4">{contact.email}</a>
              <p className="mt-1" style={{ color: 'var(--c-muted)' }}>{contact.phone}</p>
            </div>
            <div>
              <div className="eyebrow mb-4">Offices</div>
              <ul className="space-y-4">
                {contact.studios.map((s) => (
                  <li key={s.id}>
                    <div className="font-display text-2xl">{s.city}</div>
                    <div className="text-sm" style={{ color: 'var(--c-muted)' }}>{s.address}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-4">Follow</div>
              <div className="flex flex-wrap gap-4">
                {contact.socials.map((s) => (
                  <a key={s.id} href={s.href} className="text-[0.7rem] tracking-luxe uppercase">{s.label}</a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="md:col-span-7">
            <ContactForm action={submitContact} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
