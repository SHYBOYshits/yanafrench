import Link from "next/link";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} className="breadcrumb__item">
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          {i < items.length - 1 && <span className="breadcrumb__sep" aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  );
}
