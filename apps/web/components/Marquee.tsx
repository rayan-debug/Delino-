export default function Marquee<T extends { id: string; name?: string }>({
  items,
  render,
}: {
  items: T[];
  render?: (item: T) => React.ReactNode;
}) {
  const list = [...items, ...items, ...items];
  return (
    <div className="marquee py-2">
      <div className="marquee-track">
        {list.map((it, i) => (
          <div key={`${it.id}-${i}`} className="flex items-center">
            {render ? render(it) : <span className="font-display text-xl tracking-wide-luxe">{it.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
