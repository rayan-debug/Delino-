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

type Section = {
  id: string;
  slug: string;
  title: string;
  description: string;
  projects: Project[];
};

export default function WorkGrid({ sections }: { sections: Section[] }) {
  const withWork = useMemo(() => sections.filter((s) => s.projects.length > 0), [sections]);
  const [active, setActive] = useState('All');

  const visible = active === 'All' ? withWork : withWork.filter((s) => s.id === active);
  const total = withWork.reduce((n, s) => n + s.projects.length, 0);

  return (
    <>
      <section className="pb-8">
        <div className="container-luxe">
          <div
            className="flex flex-wrap items-center gap-3 md:gap-6 border-t border-b py-5"
            style={{ borderColor: 'var(--c-line)' }}
          >
            <button
              onClick={() => setActive('All')}
              className="text-[0.7rem] tracking-luxe uppercase transition-colors"
              style={{ color: active === 'All' ? 'var(--c-accent)' : 'var(--c-muted)' }}
              data-hover
            >
              All
            </button>
            {withWork.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="text-[0.7rem] tracking-luxe uppercase transition-colors"
                style={{ color: active === s.id ? 'var(--c-accent)' : 'var(--c-muted)' }}
                data-hover
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="container-luxe space-y-20 md:space-y-28">
          {visible.map((s) => (
            <div key={s.id}>
              <div
                className="flex flex-wrap items-end justify-between gap-4 pb-6 mb-8 border-b"
                style={{ borderColor: 'var(--c-line)' }}
              >
                <div className="max-w-2xl">
                  <h2 className="font-display text-3xl md:text-4xl leading-tight">{s.title}</h2>
                  {s.description && (
                    <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                      {s.description}
                    </p>
                  )}
                </div>
                <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>
                  {s.projects.length} {s.projects.length === 1 ? 'Work' : 'Works'}
                </div>
              </div>

              {/* The section's own grid — every project in it is clickable and
                  opens the full project page. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {s.projects.map((p) => (
                  <Link key={p.id} href={`/work/${p.slug}`} className="group block">
                    <div className="relative overflow-hidden aspect-[4/5]">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] group-hover:scale-105"
                        style={{ backgroundImage: `url(${p.image})` }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))' }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                        {p.year && (
                          <div className="text-[0.65rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>
                            {p.year}
                          </div>
                        )}
                        <h3 className="font-display text-xl md:text-2xl mt-2 leading-tight">{p.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {total === 0 && (
            <p className="text-center py-16" style={{ color: 'var(--c-muted)' }}>
              No projects published yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
