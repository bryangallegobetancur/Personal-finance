import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Moneda dinámica
// ---------------------------------------------------------------------------
export type CurrencyCode = "EUR" | "USD" | "COP" | "MXN" | "ARS" | "CLP" | "PEN" | "GBP";

const ALL_CURRENCIES: CurrencyCode[] = [
  "EUR", "USD", "COP", "MXN", "ARS", "CLP", "PEN", "GBP",
];

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  EUR: "es-ES",
  USD: "en-US",
  COP: "es-CO",
  MXN: "es-MX",
  ARS: "es-AR",
  CLP: "es-CL",
  PEN: "es-PE",
  GBP: "en-GB",
};

function loadStoredCurrency(): CurrencyCode {
  try {
    const stored = localStorage.getItem("fp-currency");
    if (stored && ALL_CURRENCIES.includes(stored as CurrencyCode)) {
      return stored as CurrencyCode;
    }
  } catch {
    // localStorage no disponible
  }
  return "EUR";
}

let _currentCurrency: CurrencyCode = "EUR";

try {
  _currentCurrency = loadStoredCurrency();
} catch {
  _currentCurrency = "EUR";
}

export function isValidCurrency(value: unknown): value is CurrencyCode {
  return ALL_CURRENCIES.includes(value as CurrencyCode);
}

export function getCurrentCurrency(): CurrencyCode {
  return _currentCurrency;
}

export function setCurrentCurrency(code: CurrencyCode) {
  _currentCurrency = code;
  try {
    localStorage.setItem("fp-currency", code);
  } catch {
    // ignorar
  }
}

export function formatCurrency(value: number | string | null | undefined) {
  if (value == null || value === "") return "—";
  const currency = _currentCurrency;
  const locale = CURRENCY_LOCALES[currency];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(value));
}

export const currencyList: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "USD", label: "Dólar estadounidense", symbol: "$" },
  { code: "COP", label: "Peso colombiano", symbol: "$" },
  { code: "MXN", label: "Peso mexicano", symbol: "$" },
  { code: "ARS", label: "Peso argentino", symbol: "$" },
  { code: "CLP", label: "Peso chileno", symbol: "$" },
  { code: "PEN", label: "Sol peruano", symbol: "S/" },
  { code: "GBP", label: "Libra esterlina", symbol: "£" },
];

// ---------------------------------------------------------------------------
// Fechas
// ---------------------------------------------------------------------------
export function formatDate(value: string | Date) {
  let d: Date;
  if (typeof value === "string") {
    if (value.includes("T")) {
      d = new Date(value);
    } else {
      const [y, m, day] = value.split("-");
      d = new Date(Number(y), Number(m) - 1, Number(day));
    }
  } else {
    d = value;
  }
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function currentMonthIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function formatMonthLabel(monthIso: string) {
  const [yearStr, monthStr] = monthIso.split("-");
  const monthIndex = Number(monthStr) - 1;
  return `${MONTH_NAMES[monthIndex] ?? monthStr} ${yearStr}`;
}

export function changeMonth(monthIso: string, delta: number) {
  const [yearStr, monthStr] = monthIso.split("-");
  let year = Number(yearStr);
  let month = Number(monthStr) + delta;
  if (month > 12) { year += 1; month = 1; }
  if (month < 1) { year -= 1; month = 12; }
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function isCurrentMonth(monthIso: string) {
  return monthIso === currentMonthIso();
}

export function isFutureMonth(monthIso: string) {
  const [yearStr, monthStr] = monthIso.split("-");
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (year > currentYear) return true;
  if (year === currentYear && month > currentMonth) return true;
  return false;
}

export function todayLocal() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function firstDayOfMonthIso(monthIso: string) {
  const [yearStr, monthStr] = monthIso.split("-");
  return `${yearStr}-${monthStr}-01`;
}

export function dateRangeFromMonth(monthIso: string) {
  const [yearStr, monthStr] = monthIso.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const to = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;
  return { from, to };
}

export function addDaysIso(dateIso: string, days: number) {
  const [y, m, d] = dateIso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate()
  ).padStart(2, "0")}`;
}

export type DashboardView = "month" | "category" | "range";

// ---------------------------------------------------------------------------
// Pub/sub para reemplazar invalidateQueries de TanStack Query
// ---------------------------------------------------------------------------
type RefetchListener = () => void;
const refetchMap = new Map<string, Set<RefetchListener>>();

export function onRefetch(event: string, fn: RefetchListener) {
  if (!refetchMap.has(event)) refetchMap.set(event, new Set());
  refetchMap.get(event)!.add(fn);
  return () => {
    refetchMap.get(event)?.delete(fn);
  };
}

export function emitRefetch(event: string) {
  refetchMap.get(event)?.forEach((fn) => fn());
}
