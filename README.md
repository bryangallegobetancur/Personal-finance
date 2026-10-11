# Finanzas Personales

App web de gestión financiera personal con **React + Vite + TypeScript + Tailwind**,
estado/sincronización con **TanStack Query**, formularios validados con **Zod + React Hook Form**
y backend en **Supabase (PostgreSQL + Auth + Realtime)**.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Estado/Cache | TanStack Query (React Query) |
| Formularios | React Hook Form + Zod (`@hookform/resolvers`) |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| Gráficos | Recharts · Iconos: lucide-react · Toasts: sonner |

## Puesta en marcha

1. **Dependencias**
   ```bash
   npm install
   ```
2. **Variables de entorno** — copia `.env.example` a `.env` y completa con las
   credenciales de tu proyecto Supabase:
   ```
   VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=TU-CLAVE-ANON-PUBLICA
   ```
3. **Base de datos** — ejecuta el script SQL completo en el SQL Editor de
   Supabase (o como migración con la CLI):
   ```
   supabase/migrations/0001_init.sql
   ```
   Esto crea tablas, RLS, constraints, el trigger de alertas y habilita
   Realtime sobre `alerts_history`.
4. **Auth** — en Supabase Dashboard > Authentication > URL Configuration, asegúrate
   de que el redirect permitido incluya `http://localhost:5173/update-password`.
5. **Dev server**
   ```bash
   npm run dev
   ```
6. **Typecheck / lint / build**
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

## Estructura de carpetas

```
Finanzas_Personales/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── supabase/
│   └── migrations/
│       └── 0001_init.sql          # Schema, RLS, FKs, trigger de alertas, Realtime
└── src/
    ├── main.tsx                   # Entry: QueryClientProvider + AuthProvider + Router + Toaster
    ├── router.tsx                 # Rutas públicas/privadas (React Router)
    ├── index.css
    ├── vite-env.d.ts
    ├── lib/
    │   ├── supabase.ts            # Cliente Supabase tipado
    │   ├── queryClient.ts         # TanStack Query + queryKeys centralizados
    │   ├── auth.ts                # Capa de servicios de autenticación
    │   └── utils.ts                # cn(), formatCurrency, formatDate, currentMonthIso
    ├── types/
    │   └── database.types.ts      # Tipos del dominio + interfaz Database para el cliente
    ├── schemas/                   # Validación Zod (1 por entidad)
    │   ├── auth.schema.ts
    │   ├── transaction.schema.ts
    │   ├── category.schema.ts
    │   └── budget.schema.ts
    ├── contexts/
    │   └── AuthContext.tsx        # Sesión + onAuthStateChange
    ├── routes/
    │   ├── ProtectedRoute.tsx     # Guard de rutas privadas
    │   └── PublicRoute.tsx        # Redirige a usuarios ya logueados
    ├── hooks/
    │   ├── queries/               # useQuery (lecturas + Realtime)
    │   │   ├── useProfile.ts
    │   │   ├── useCategories.ts
    │   │   ├── useTransactions.ts
    │   │   ├── useBudgets.ts
    │   │   ├── useAlerts.ts        # ← suscripción Realtime + toasts
    │   │   └── useDashboard.ts
    │   └── mutations/             # useMutation (escrituras + invalidación)
    │       ├── useTransactionMutations.ts
    │       ├── useCategoryMutations.ts
    │       └── useBudgetMutations.ts
    ├── components/
    │   ├── ui/                    # Primitivas reutilizables
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx          # Input + Select
    │   │   ├── Card.tsx
    │   │   ├── Modal.tsx
    │   │   └── Spinner.tsx
    │   ├── layout/
    │   │   ├── AppLayout.tsx      # Sidebar + Outlet (privado)
    │   │   └── AuthLayout.tsx     # Layout auth
    │   ├── auth/
    │   │   ├── LoginForm.tsx
    │   │   ├── RegisterForm.tsx
    │   │   ├── ForgotPasswordForm.tsx
    │   │   ├── UpdatePasswordForm.tsx
    │   │   └── PasswordStrength.tsx  # Validación de contraseña en tiempo real
    │   ├── dashboard/
    │   │   ├── BalanceCard.tsx
    │   │   ├── IncomeExpenseChart.tsx
    │   │   └── RecentAlerts.tsx
    │   ├── transactions/
    │   │   ├── TransactionsList.tsx
    │   │   ├── TransactionForm.tsx
    │   │   └── TransactionDialog.tsx
    │   ├── categories/
    │   │   ├── CategoriesManager.tsx
    │   │   └── CategoryForm.tsx
    │   └── budgets/
    │       ├── BudgetsManager.tsx
    │       └── BudgetForm.tsx
    └── pages/
        ├── LoginPage.tsx
        ├── RegisterPage.tsx
        ├── ForgotPasswordPage.tsx
        ├── UpdatePasswordPage.tsx
        ├── DashboardPage.tsx       # Balance + gráfico + alertas recientes
        ├── TransactionsPage.tsx    # CRUD de transacciones
        └── SettingsPage.tsx        # Gestión de categorías + topes
```

## Lógica de alertas (server-side)

La verificación de tope **no depende del frontend**. Al insertar/actualizar una
transacción de tipo `gasto`, el trigger `trg_check_budget_exceeded` (función
`check_budget_exceeded`) ejecuta en PostgreSQL:

1. Calcula el **período vigente** con `date_trunc` sobre la fecha de la
   transacción (`'month'` para mensual, `'year'` para anual) → `[inicio, fin)`.
2. Recorre los topes candidatos del usuario (global `category_id IS NULL` y el
   de la categoría de la transacción).
3. Suma los gastos del período; si superan el tope, inserta una fila en
   `alerts_history` (con idempotencia: una alerta por budget+período).
4. El frontend escucha `alerts_history` vía **Supabase Realtime**, invalida las
   queries de dashboard/alertas y muestra un **toast** inmediato.

## Comportamiento ON DELETE

- `transactions.category_id → categories`: **ON DELETE RESTRICT** (no se puede
  borrar una categoría con transacciones; el frontend bloquea y muestra mensaje).
  *Justificación: preserva la integridad del histórico financiero.*
- `budgets.category_id → categories`: **ON DELETE CASCADE** (borrar la categoría
  elimina sus topes).
- `alerts_history.budget_id → budgets`: **CASCADE**; `alerts_history.transaction_id → transactions`:
  **SET NULL** (conserva el historial aunque se borre la transacción).
- Todas las tablas hijas referencian `auth.users` con **ON DELETE CASCADE**.

## Seguridad (RLS)

Todas las tablas tienen Row Level Security activado con políticas
`auth.uid() = user_id` (o `id` en `profiles`). Cada usuario solo accede a sus
datos. El trigger de alertas corre como `SECURITY INVOKER`, operando sobre los
propios registros del usuario.

## Licencia

**[Proyecto UCN IIA](https://github.com/bryangallegobetancur/ProyectoUCNIIA)**  
© 2026 · [Bryan Stiven Gallego Betancur, John Alejandro Alvarez Muñoz, & Daniel Santiago Naranjo Rodriguez](https://github.com/bryangallegobetancur)

Esta obra está bajo la licencia **[Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)**.

<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es">
  <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="Creative Commons" width="32" height="32">
  <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="Atribución" width="32" height="32">
  <img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="No comercial" width="32" height="32">
  <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="Compartir igual" width="32" height="32">
</a>
