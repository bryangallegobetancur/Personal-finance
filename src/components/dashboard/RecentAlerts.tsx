import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useAlerts } from "@/hooks/queries/useAlerts";
import { formatCurrency, formatDate } from "@/lib/utils";

export function RecentAlerts() {
  const { data, isLoading, error } = useAlerts();

  return (
    <Card
      title="Alertas recientes"
      action={<AlertTriangle className="h-5 w-5 text-amber-500" strokeWidth={1.75} />}
    >
      {isLoading && (
        <div className="grid place-items-center py-8">
          <Spinner />
        </div>
      )}
      {error && <p className="text-small text-error">Error al cargar alertas</p>}
      {data && data.length === 0 && (
        <p className="py-8 text-center text-small text-muted-foreground">
          Sin alertas. ¡Vas dentro del presupuesto!
        </p>
      )}
      {data && data.length > 0 && (
        <ul className="divide-y divide-border">
          {data.slice(0, 6).map((a) => (
            <li key={a.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-error/10">
                  <AlertTriangle className="h-4 w-4 text-error" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-small font-medium text-foreground">Tope superado</p>
                  <p className="text-caption text-muted-foreground">
                    {formatDate(a.created_at)}
                  </p>
                </div>
              </div>
              <span className="text-small font-semibold text-error">
                +{formatCurrency(a.amount_exceeded)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
