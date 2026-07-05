import { CategoriesManager } from "@/components/categories/CategoriesManager";
import { BudgetsManager } from "@/components/budgets/BudgetsManager";
import { Card } from "@/components/ui/Card";
import { CurrencySwitcher } from "@/components/ui/CurrencySwitcher";

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1 font-bold text-foreground">Configuración</h1>
        <p className="mt-1 text-small text-muted-foreground">
          Gestiona tus categorías y topes de gasto.
        </p>
      </div>

      <Card title="Preferencias">
        <CurrencySwitcher />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoriesManager />
        <BudgetsManager />
      </div>
    </div>
  );
}
