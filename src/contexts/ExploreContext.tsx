import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { emitRefetch } from "@/lib/utils";
import type {
  Transaction,
  Category,
  Budget,
  CategoryType,
  BudgetPeriodicity,
  Alert,
} from "@/types/database.types";

function genId() {
  return crypto.randomUUID();
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ---- Semilla de categorías de demostración ----
const SEED_CATEGORIES: Category[] = [
  {
    id: genId(),
    user_id: "explore",
    name: "Salario",
    type: "ingreso",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    name: "Freelance",
    type: "ingreso",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    name: "Alquiler",
    type: "gasto",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    name: "Comida",
    type: "gasto",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    name: "Transporte",
    type: "gasto",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    name: "Ocio",
    type: "gasto",
    created_at: new Date().toISOString(),
  },
];

const [salario, freelance, alquiler, comida, transporte, ocio] =
  SEED_CATEGORIES;

// ---- Semilla de transacciones de demostración ----
const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: genId(),
    user_id: "explore",
    amount: 2500,
    date: daysAgo(1),
    description: "Nómina mensual",
    category_id: salario.id,
    type: "ingreso",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 500,
    date: daysAgo(3),
    description: "Diseño web",
    category_id: freelance.id,
    type: "ingreso",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 800,
    date: daysAgo(2),
    description: "Pago alquiler",
    category_id: alquiler.id,
    type: "gasto",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 65,
    date: daysAgo(1),
    description: "Supermercado",
    category_id: comida.id,
    type: "gasto",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 120,
    date: daysAgo(4),
    description: "Cena restaurante",
    category_id: comida.id,
    type: "gasto",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 40,
    date: daysAgo(5),
    description: "Gasolina",
    category_id: transporte.id,
    type: "gasto",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 30,
    date: daysAgo(6),
    description: "Cine",
    category_id: ocio.id,
    type: "gasto",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 350,
    date: daysAgo(7),
    description: "Manutención freelance",
    category_id: freelance.id,
    type: "ingreso",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 55,
    date: daysAgo(8),
    description: "Taxi",
    category_id: transporte.id,
    type: "gasto",
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 200,
    date: daysAgo(9),
    description: "Ropa",
    category_id: ocio.id,
    type: "gasto",
    created_at: new Date().toISOString(),
  },
];

// ---- Semilla de presupuestos ----
const SEED_BUDGETS: Budget[] = [
  {
    id: genId(),
    user_id: "explore",
    amount: 900,
    periodicity: "mensual",
    category_id: alquiler.id,
    start_date: null,
    end_date: null,
    created_at: new Date().toISOString(),
  },
  {
    id: genId(),
    user_id: "explore",
    amount: 400,
    periodicity: "mensual",
    category_id: comida.id,
    start_date: null,
    end_date: null,
    created_at: new Date().toISOString(),
  },
];

// ---- Semilla de alertas ----
const SEED_ALERTS: Alert[] = [
  {
    id: genId(),
    user_id: "explore",
    budget_id: SEED_BUDGETS[1].id,
    transaction_id: SEED_TRANSACTIONS[4].id,
    amount_exceeded: 35,
    created_at: new Date().toISOString(),
  },
];

// --- Tipos para las operaciones de mutación ---
interface ExploreStore {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  alerts: Alert[];
}

type ExploreContextValue = ExploreStore & {
  setTransactions: (
    updater: Transaction[] | ((prev: Transaction[]) => Transaction[])
  ) => void;
  setCategories: (
    updater: Category[] | ((prev: Category[]) => Category[])
  ) => void;
  setBudgets: (updater: Budget[] | ((prev: Budget[]) => Budget[])) => void;
};

const ExploreContext = createContext<ExploreContextValue | null>(null);

export function ExploreProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    () => SEED_TRANSACTIONS
  );
  const [categories, setCategories] = useState<Category[]>(
    () => SEED_CATEGORIES
  );
  const [budgets, setBudgets] = useState<Budget[]>(() => SEED_BUDGETS);
  const [alerts] = useState<Alert[]>(() => SEED_ALERTS);

  const value: ExploreContextValue = {
    transactions,
    categories,
    budgets,
    alerts,
    setTransactions,
    setCategories,
    setBudgets,
  };

  return (
    <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>
  );
}

export function useExploreContext() {
  return useContext(ExploreContext);
}

// --------------- Mutaciones (usadas por los mutation hooks) ---------------
export function exploreCreateTransaction(
  ctx: ExploreContextValue,
  input: Omit<Transaction, "id" | "created_at" | "user_id">
): Transaction {
  const now = new Date().toISOString();
  const tx: Transaction = { ...input, id: genId(), user_id: "explore", created_at: now };
  ctx.setTransactions((prev) => [tx, ...prev]);
  emitRefetch("transactions:changed");
  emitRefetch("dashboard:changed");
  return tx;
}

export function exploreUpdateTransaction(
  ctx: ExploreContextValue,
  id: string,
  input: Partial<Omit<Transaction, "id" | "created_at" | "user_id">>
): Transaction {
  let updated: Transaction | undefined;
  ctx.setTransactions((prev) =>
    prev.map((t) => {
      if (t.id === id) {
        updated = { ...t, ...input };
        return updated;
      }
      return t;
    })
  );
  if (!updated) throw new Error("Transacción no encontrada");
  emitRefetch("transactions:changed");
  emitRefetch("dashboard:changed");
  return updated;
}

export function exploreDeleteTransaction(ctx: ExploreContextValue, id: string) {
  ctx.setTransactions((prev) => prev.filter((t) => t.id !== id));
  emitRefetch("transactions:changed");
  emitRefetch("dashboard:changed");
}

// --------------- Categorías ---------------
export function exploreCreateCategory(
  ctx: ExploreContextValue,
  input: { name: string; type: CategoryType }
): Category {
  const now = new Date().toISOString();
  const cat: Category = { ...input, id: genId(), user_id: "explore", created_at: now };
  ctx.setCategories((prev) => [...prev, cat]);
  emitRefetch("categories:changed");
  return cat;
}

export function exploreUpdateCategory(
  ctx: ExploreContextValue,
  id: string,
  input: Partial<{ name: string; type: CategoryType }>
): Category {
  let updated: Category | undefined;
  ctx.setCategories((prev) =>
    prev.map((c) => {
      if (c.id === id) {
        updated = { ...c, ...input };
        return updated;
      }
      return c;
    })
  );
  if (!updated) throw new Error("Categoría no encontrada");
  emitRefetch("categories:changed");
  return updated;
}

export function exploreDeleteCategory(ctx: ExploreContextValue, id: string) {
  const hasTransactions = ctx.transactions.some(
    (t) => t.category_id === id
  );
  if (hasTransactions) {
    throw new Error(
      "No se puede eliminar: tiene transacciones asociadas. Reasigna o elimina primero esas transacciones."
    );
  }
  ctx.setCategories((prev) => prev.filter((c) => c.id !== id));
  emitRefetch("categories:changed");
}

// --------------- Presupuestos ---------------
export function exploreCreateBudget(
  ctx: ExploreContextValue,
  input: {
    amount: number;
    periodicity: BudgetPeriodicity;
    category_id: string | null;
    start_date?: string | null;
    end_date?: string | null;
  }
): Budget {
  const now = new Date().toISOString();
  const b: Budget = {
    ...input,
    id: genId(),
    user_id: "explore",
    start_date: input.start_date ?? null,
    end_date: input.end_date ?? null,
    created_at: now,
  };
  ctx.setBudgets((prev) => [...prev, b]);
  emitRefetch("budgets:changed");
  return b;
}

export function exploreUpdateBudget(
  ctx: ExploreContextValue,
  id: string,
  input: Partial<{
    amount: number;
    periodicity: BudgetPeriodicity;
    category_id: string | null;
    start_date: string | null;
    end_date: string | null;
  }>
): Budget {
  let updated: Budget | undefined;
  ctx.setBudgets((prev) =>
    prev.map((b) => {
      if (b.id === id) {
        updated = { ...b, ...input };
        return updated;
      }
      return b;
    })
  );
  if (!updated) throw new Error("Tope no encontrado");
  emitRefetch("budgets:changed");
  return updated;
}

export function exploreDeleteBudget(ctx: ExploreContextValue, id: string) {
  ctx.setBudgets((prev) => prev.filter((b) => b.id !== id));
  emitRefetch("budgets:changed");
}
