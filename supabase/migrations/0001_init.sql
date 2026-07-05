-- ============================================================================
-- Finanzas Personales · Migración inicial (Supabase / PostgreSQL)
-- ----------------------------------------------------------------------------
-- Contenido:
--   1. Enums de dominio
--   2. Tabla profiles (extensión de auth.users)
--   3. Tabla categories
--   4. Tabla transactions  (CHECK: amount > 0, date <= CURRENT_DATE)
--   5. Tabla budgets       (category_id NULLABLE => tope global)
--   6. Tabla alerts_history
--   7. Foreign keys + comportamiento ON DELETE (justificado)
--   8. Row Level Security (RLS) por usuario (auth.uid())
--   9. Trigger: creación automática de profile al registrarse
--  10. Función + trigger de lógica de alertas (server-side)
--  11. Realtime sobre alerts_history
-- ============================================================================

-- Extensiones necesarias
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUMS DE DOMINIO
-- ----------------------------------------------------------------------------
do $$ begin
  create type category_type as enum ('ingreso', 'gasto');
exception when duplicate_object then null; end $$;

do $$ begin
  create type transaction_type as enum ('ingreso', 'gasto');
exception when duplicate_object then null; end $$;

do $$ begin
  create type budget_periodicity as enum ('mensual', 'anual');
exception when duplicate_object then null; end $$;


-- ----------------------------------------------------------------------------
-- 2. PROFILES (extensión de auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ----------------------------------------------------------------------------
-- 3. CATEGORIES (creadas dinámicamente por el usuario)
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  type       category_type not null,
  created_at timestamptz not null default now(),
  unique (user_id, name, type)
);


-- ----------------------------------------------------------------------------
-- 4. TRANSACTIONS
--    CHECK: amount > 0  |  date <= CURRENT_DATE (no fechas futuras)
-- ----------------------------------------------------------------------------
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  amount      numeric(14,2) not null,
  date        date not null,
  description text not null,
  category_id uuid references public.categories (id),
  type        transaction_type not null,
  created_at  timestamptz not null default now(),
  constraint transactions_amount_positive check (amount > 0),
  constraint transactions_date_not_future check (date <= current_date)
);


-- ----------------------------------------------------------------------------
-- 5. BUDGETS
--    category_id NULLABLE => tope GLOBAL.  type no se guarda: los topes
--    aplican siempre sobre GASTOS (semántica financiera estándar).
-- ----------------------------------------------------------------------------
create table if not exists public.budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  amount      numeric(14,2) not null,
  periodicity budget_periodicity not null default 'mensual',
  category_id uuid references public.categories (id) on delete cascade,
  created_at  timestamptz not null default now(),
  constraint budgets_amount_positive check (amount > 0)
);
create index if not exists idx_budgets_user on public.budgets (user_id);
create index if not exists idx_budgets_category on public.budgets (category_id);


-- ----------------------------------------------------------------------------
-- 6. ALERTS_HISTORY
-- ----------------------------------------------------------------------------
create table if not exists public.alerts_history (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  budget_id        uuid not null references public.budgets (id) on delete cascade,
  transaction_id   uuid references public.transactions (id) on delete set null,
  amount_exceeded  numeric(14,2) not null check (amount_exceeded > 0),
  created_at       timestamptz not null default now()
);
create index if not exists idx_alerts_user_created on public.alerts_history (user_id, created_at desc);


-- ----------------------------------------------------------------------------
-- 7. FOREIGN KEYS + COMPORTAMIENTO ON DELETE (justificación)
-- ----------------------------------------------------------------------------
-- DECISIÓN DE DISEÑO para transactions -> categories:
--   Se elige ON DELETE RESTRICT. Justificación: la integridad del histórico
--   financiero es crítica; nunca se debe perder la atribución de categoría de
--   una transacción de forma silenciosa. RESTRICT obliga a reasignar las
--   transacciones antes de borrar la categoría (el frontend bloquea el
--   borrado y ofrece reasignar a otra categoría), evitando datos huérfanos
--   y manteniendo la trazabilidad de los reportes históricos.
--   (La alternativa SET DEFAULT con una categoría "Sin categoría" se descarta
--    porque mezclaría movimientos en una categoría comodín y degradaría los
--    reportes por categoría.)
alter table public.transactions
  drop constraint if exists transactions_category_id_fkey;
alter table public.transactions
  add constraint transactions_category_id_fkey
  foreign key (category_id) references public.categories (id)
  on delete restrict;

-- budgets -> categories: ON DELETE CASCADE (borrar la categoría elimina sus
-- topes asociados; no tiene sentido conservar un tope huérfano).
alter table public.budgets
  drop constraint if exists budgets_category_id_fkey;
alter table public.budgets
  add constraint budgets_category_id_fkey
  foreign key (category_id) references public.categories (id)
  on delete cascade;


-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (aislamiento por auth.uid())
-- ----------------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.categories      enable row level security;
alter table public.transactions    enable row level security;
alter table public.budgets         enable row level security;
alter table public.alerts_history  enable row level security;

-- profiles: el usuario solo ve/edita SU perfil
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- categories
drop policy if exists "categories_select_own" on public.categories;
create policy "categories_select_own" on public.categories
  for select using (auth.uid() = user_id);

drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own" on public.categories
  for insert with check (auth.uid() = user_id);

drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own" on public.categories
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own" on public.categories
  for delete using (auth.uid() = user_id);

-- transactions
drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

-- budgets
drop policy if exists "budgets_select_own" on public.budgets;
create policy "budgets_select_own" on public.budgets
  for select using (auth.uid() = user_id);

drop policy if exists "budgets_insert_own" on public.budgets;
create policy "budgets_insert_own" on public.budgets
  for insert with check (auth.uid() = user_id);

drop policy if exists "budgets_update_own" on public.budgets;
create policy "budgets_update_own" on public.budgets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "budgets_delete_own" on public.budgets;
create policy "budgets_delete_own" on public.budgets
  for delete using (auth.uid() = user_id);

-- alerts_history: lectura propia; el INSERT lo hace el trigger (mismo user)
drop policy if exists "alerts_select_own" on public.alerts_history;
create policy "alerts_select_own" on public.alerts_history
  for select using (auth.uid() = user_id);

drop policy if exists "alerts_insert_own" on public.alerts_history;
create policy "alerts_insert_own" on public.alerts_history
  for insert with check (auth.uid() = user_id);

drop policy if exists "alerts_delete_own" on public.alerts_history;
create policy "alerts_delete_own" on public.alerts_history
  for delete using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 9. TRIGGER: crear profile automáticamente al registrarse en auth.users
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================================
-- 10. LÓGICA DE ALERTAS (server-side, en un trigger AFTER INSERT/UPDATE)
-- ----------------------------------------------------------------------------
-- Semántica:
--   * Los topes (budgets) aplican sobre GASTOS.
--   * "Período vigente" se calcula con date_trunc sobre la fecha de la
--     transacción: 'month' para mensual, 'year' para anual. Así se evita
--     ambigüedad: el período es [inicio_período, inicio_período + 1 unidad).
--   * Se inserta UNA alerta por (budget, período) cuando el gasto acumulado
--     del período SUPERA el tope, y solo si todavía no existe una alerta
--     registrada para ese budget + período (idempotente ante re-updates).
-- ============================================================================

-- Helper: límites [start, end) del período que contiene p_date según periodicidad
create or replace function public.get_period_bounds(
  p_periodicity budget_periodicity,
  p_date date
) returns table (period_start timestamptz, period_end timestamptz)
language sql immutable
as $$
  select
    case p_periodicity
      when 'mensual' then date_trunc('month', p_date::timestamptz)
      when 'anual'   then date_trunc('year',  p_date::timestamptz)
    end as period_start,
    case p_periodicity
      when 'mensual' then date_trunc('month', p_date::timestamptz) + interval '1 month'
      when 'anual'   then date_trunc('year',  p_date::timestamptz) + interval '1 year'
    end as period_end;
$$;

create or replace function public.check_budget_exceeded()
returns trigger
language plpgsql
-- security invoker: opera con los privilegios/RLS del usuario autenticado.
-- Todos los datos tocados pertenecen al propio usuario, por lo que el
-- aislamiento RLS se mantiene íntegro.
as $$
declare
  b           record;
  bounds      record;
  spent       numeric(14,2);
  exceeded_by numeric(14,2);
begin
  -- Solo aplica a gastos (los topes limitan gastos)
  if new.type <> 'gasto' then
    return new;
  end if;

  -- Recorremos los topes candidatos del usuario:
  --   * global (category_id IS NULL)
  --   * de la categoría de la transacción (category_id = new.category_id)
  for b in
    select id, amount, periodicity, category_id
    from public.budgets
    where user_id = new.user_id
      and (category_id is null or category_id = new.category_id)
  loop
    -- Período vigente según la fecha de la transacción
    select * into bounds
    from public.get_period_bounds(b.periodicity, new.date);

    -- Gasto acumulado del período (incluye la transacción actual)
    select coalesce(sum(amount), 0) into spent
    from public.transactions
    where user_id = new.user_id
      and type = 'gasto'
      and date >= bounds.period_start::date
      and date <  bounds.period_end::date
      and (b.category_id is null or category_id = b.category_id);

    if spent > b.amount then
      exceeded_by := spent - b.amount;

      -- Idempotencia: una sola alerta por (budget, período)
      if not exists (
        select 1 from public.alerts_history
        where budget_id = b.id
          and created_at >= bounds.period_start
          and created_at <  bounds.period_end
      ) then
        insert into public.alerts_history
          (user_id, budget_id, transaction_id, amount_exceeded)
        values
          (new.user_id, b.id, new.id, exceeded_by);
      end if;
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists trg_check_budget_exceeded on public.transactions;
create trigger trg_check_budget_exceeded
  after insert or update of amount, date, category_id, type on public.transactions
  for each row execute function public.check_budget_exceeded();


-- ----------------------------------------------------------------------------
-- 11. REALTIME: publicar alertas para que el frontend escuche cambios
-- ----------------------------------------------------------------------------
do $$ begin
  alter publication supabase_realtime add table public.alerts_history;
exception when duplicate_object then null; end $$;
