import { formatClientPrice } from "@/lib/formatters/currency";

interface PriceSummaryProps {
  price: number | undefined | null;
  label?: string;
  className?: string;
  large?: boolean;
}

export function PriceSummary({
  price,
  label = "Investment",
  className = "",
  large = false,
}: PriceSummaryProps) {
  const isPending = !price || price === 0;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </span>
      <span
        className={`price text-primary ${
          large ? "text-2xl font-medium" : "text-lg font-medium"
        } ${isPending ? "text-muted-foreground/60 text-sm" : ""}`}
      >
        {formatClientPrice(price)}
      </span>
    </div>
  );
}
