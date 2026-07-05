-- ============================================================================
-- Finanzas Personales · Migración 0003 — Relajar restricción de fecha futura
-- ----------------------------------------------------------------------------
-- La restricción date <= CURRENT_DATE usa la zona horaria del servidor (UTC),
-- lo que bloquea fechas válidas en zonas horarias locales por delante de UTC.
-- Se permite un margen de 1 día para cubrir todas las zonas horarias.
-- La validación en frontend sigue impidiendo fechas futuras reales.
-- ============================================================================

alter table public.transactions
  drop constraint if exists transactions_date_not_future;

alter table public.transactions
  add constraint transactions_date_not_future
  check (date <= current_date + interval '1 day');
