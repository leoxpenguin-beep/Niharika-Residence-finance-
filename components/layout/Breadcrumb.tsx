interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb — shows the Project → Floor → Area → Unit trail.
 * Used on floor, area, and unit detail pages.
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="px-5 pt-4 pb-1">
      <ol className="flex items-center flex-wrap gap-x-1.5 gap-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4 2.5L7.5 6L4 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: "var(--color-taupe-light)" }} />
              </svg>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-xs transition-colors"
                style={{ color: "var(--color-taupe)", fontFamily: "var(--font-body)" }}
              >
                {item.label}
              </a>
            ) : (
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-ink-soft)", fontFamily: "var(--font-body)" }}
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
