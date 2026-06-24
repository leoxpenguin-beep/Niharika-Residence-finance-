interface InclusionsListProps {
  inclusions: string;
  className?: string;
}

export function InclusionsList({ inclusions, className = "" }: InclusionsListProps) {
  if (!inclusions) return null;

  // Split comma-separated inclusions into an array and trim whitespace
  const items = inclusions.split(",").map((i) => i.trim()).filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h4 className="text-sm font-medium text-foreground">Included in Scope:</h4>
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
