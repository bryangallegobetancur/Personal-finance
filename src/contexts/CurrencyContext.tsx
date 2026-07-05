import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import {
  getCurrentCurrency,
  setCurrentCurrency,
  isValidCurrency,
  currencyList,
} from "@/lib/utils";
import type { CurrencyCode } from "@/lib/utils";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyList: typeof currencyList;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(getCurrentCurrency);

  const setCurrency = useCallback((code: CurrencyCode) => {
    if (!isValidCurrency(code)) return;
    setCurrentCurrency(code);
    setCurrencyState(code);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencyList }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency debe usarse dentro de <CurrencyProvider>");
  return ctx;
}
