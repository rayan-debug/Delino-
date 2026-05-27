export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header
      className="sticky top-0 z-10 px-8 py-5 border-b flex items-center justify-between"
      style={{ borderColor: 'var(--c-line)', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div>
        <h1 className="font-display text-2xl">{title}</h1>
        {subtitle && (
          <div className="text-[0.65rem] tracking-luxe mt-1" style={{ color: 'var(--c-muted)' }}>
            {subtitle}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
