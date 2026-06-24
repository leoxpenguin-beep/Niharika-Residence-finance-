import { formatClientPrice } from "@/lib/formatters/currency";

interface UpgradeOptionProps {
  label: string;
  price: number;
  description?: string;
  className?: string;
}

export function UpgradeOption({ label, price, description, className = "" }: UpgradeOptionProps) {
  return (
    <div className={`p-4 border border-border/50 rounded-lg bg-muted/20 ${className}`}>
      <div className="flex justify-between items-start gap-4 mb-2">
        <h4 className="font-medium text-sm text-foreground">Optional Upgrade: {label}</h4>
        <span className="price text-sm font-medium whitespace-nowrap">
          + {formatClientPrice(price)}
        </span>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
