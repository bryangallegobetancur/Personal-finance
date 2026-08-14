interface Props {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

function inputClasses() {
  return "h-10 rounded-input border border-border bg-surface px-3 text-small text-foreground transition-colors duration-200 ease-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
}

export function DateRangePicker({ from, to, onFromChange, onToChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2">
        <span className="text-small font-medium text-foreground">Desde</span>
        <input
          type="date"
          value={from}
          max={to}
          onChange={(e) => onFromChange(e.target.value)}
          className={inputClasses()}
          aria-label="Fecha desde"
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="text-small font-medium text-foreground">Hasta</span>
        <input
          type="date"
          value={to}
          min={from}
          onChange={(e) => onToChange(e.target.value)}
          className={inputClasses()}
          aria-label="Fecha hasta"
        />
      </label>
    </div>
  );
}
