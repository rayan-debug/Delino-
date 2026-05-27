'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string | null;
  image: string;
};

export default function WorkGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <section className="pb-8">
        <div className="container-luxe">
          <div className="flex flex-wrap items-center gap-3 md:gap-6 border-t border-b py-5" style={{ borderColor: 'var(--c-line)' }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className="text-[0.7rem] tracking-luxe uppercase transition-colors"
                style={{ color: active === c ? 'var(--c-accent)' : 'var(--c-muted)' }}
                data-hover
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="container-luxe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {filtered.map((p) => (
              <Link key={p.id} href={`/work/${p.slug}`} className="group block">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] group-hover:scale-105"
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>
                      {p.category}{p.year ? ` · ${p.year}` : ''}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl mt-2 leading-tight">{p.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-16" style={{ color: 'var(--c-muted)' }}>No projects in this category yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
