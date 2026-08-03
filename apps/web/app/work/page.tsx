import { getWorkSections } from '@/lib/content';
import Reveal from '@/components/Reveal';
import WorkGrid from './WorkGrid';

export const revalidate = 60;
export const metadata = { title: 'Work' };

export default async function WorkPage() {
  const sections = await getWorkSections();
  return (
    <div>
      <section className="pt-40 pb-12">
        <div className="container-luxe">
          <Reveal>
            <div className="eyebrow">Selected Work</div>
            <h1 className="hero-headline mt-6 max-w-3xl">Projects that whisper.</h1>
          </Reveal>
        </div>
      </section>
      <WorkGrid sections={sections} />
    </div>
  );
}
