import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";
import type { CurrencyCode } from "@/lib/utils";

interface Props {
  className?: string;
}

export function CurrencySwitcher({ className }: Props) {
  const { currency, setCurrency, currencyList } = useCurrency();

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-small font-medium text-foreground">
        Moneda
      </label>
      <div className="flex flex-wrap gap-2">
        {currencyList.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => setCurrency(c.code as CurrencyCode)}
            className={cn(
              "rounded-button border px-4 py-2 text-small font-medium transition-all",
              currency === c.code
                ? "border-primary bg-brand-50 text-primary dark:bg-brand-600/15"
                : "border-border bg-surface text-muted-foreground hover:text-foreground hover:shadow-sm"
            )}
          >
            {c.symbol} {c.code}
          </button>
        ))}
      </div>
    </div>
  );
}
