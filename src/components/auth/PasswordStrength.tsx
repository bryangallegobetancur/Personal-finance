import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { passwordSchema } from "@/schemas/auth.schema";
import { cn } from "@/lib/utils";

const RULES = [
  { id: "len", label: "Mínimo 8 caracteres", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "Una mayúscula", test: (v: string) => /[A-Z]/.test(v) },
  { id: "num", label: "Un número", test: (v: string) => /[0-9]/.test(v) },
  { id: "special", label: "Un carácter especial", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export function PasswordStrength({ value }: { value: string }) {
  const passed = useMemo(
    () => RULES.filter((r) => r.test(value)),
    [value]
  );
  const ok = passwordSchema.safeParse(value).success;
  const pct = (passed.length / RULES.length) * 100;

  return (
    <div className="space-y-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-200 ease-out",
            ok ? "bg-success" : pct >= 50 ? "bg-amber-500" : "bg-error"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="grid grid-cols-2 gap-1 text-caption">
        {RULES.map((r) => {
          const done = r.test(value);
          return (
            <li
              key={r.id}
              className={cn(
                "flex items-center gap-1",
                done ? "text-success" : "text-muted-foreground"
              )}
            >
              {done ? (
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              ) : (
                <XCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
              )}
              {r.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
