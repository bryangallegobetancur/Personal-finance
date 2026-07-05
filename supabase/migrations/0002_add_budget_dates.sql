-- ============================================================================
-- Finanzas Personales · Migración 0002 — Rangos de fecha en budgets
-- ----------------------------------------------------------------------------
-- Añade start_date y end_date a la tabla budgets para delimitar el período
-- de vigencia. Cuando periodicity = 'mensual', el tope aplica a cada mes
-- individual dentro de [start_date, end_date).
-- ============================================================================

-- 1. Añadir columnas (nullable, sin romper registros existentes)
alter table public.budgets
  add column if not exists start_date date,
  add column if not exists end_date   date;

-- 2. Actualizar get_period_bounds para respetar el rango de fechas
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

-- 3. Actualizar check_budget_exceeded para filtrar por rango de fechas del budget
create or replace function public.check_budget_exceeded()
returns trigger
language plpgsql
as $$
declare
  b           record;
  bounds      record;
  spent       numeric(14,2);
  exceeded_by numeric(14,2);
begin
  if new.type <> 'gasto' then
    return new;
  end if;

  for b in
    select id, amount, periodicity, category_id, start_date, end_date
    from public.budgets
    where user_id = new.user_id
      and (category_id is null or category_id = new.category_id)
  loop
    -- Si el budget tiene rango de fechas, la transacción debe estar dentro
    if b.start_date is not null and new.date < b.start_date then
      continue;
    end if;
    if b.end_date is not null and new.date >= b.end_date then
      continue;
    end if;

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
