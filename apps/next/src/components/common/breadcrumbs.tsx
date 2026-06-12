import Link from 'next/link';

interface BreadcrumbsProps {
  items: string[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 text-[#6B778C] text-sm">
      {items.map((item, idx) => (
        <div key={item} className="flex items-center gap-2">
          {idx === items.length - 1 ? (
            <span className="text-[#172B4D]">{item}</span>
          ) : (
            <Link href="#" className="hover:underline">
              {item}
            </Link>
          )}
          {idx < items.length - 1 && <span>/</span>}
        </div>
      ))}
    </div>
  );
}
