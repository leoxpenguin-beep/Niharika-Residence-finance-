interface MaterialDirectionBlockProps {
  direction: string;
  className?: string;
}

export function MaterialDirectionBlock({ direction, className = "" }: MaterialDirectionBlockProps) {
  if (!direction) return null;

  return (
    <div className={`p-4 bg-muted/30 rounded-lg border border-border/50 ${className}`}>
      <h4 className="text-sm font-medium text-foreground mb-1">Material Direction</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{direction}</p>
    </div>
  );
}
