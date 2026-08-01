"use client";

import type { Dictionary } from "@/lib/i18n/dictionary";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

const STORAGE_KEY = "pilu-locale";
const listeners = new Set<() => void>();
let cachedLocale: Locale | null = null;

function readStoredLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && isLocale(stored) ? stored : defaultLocale;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Never reachable during SSR, so the server snapshot always falls back to the default locale.
function getSnapshot(): Locale {
  if (cachedLocale === null) cachedLocale = readStoredLocale();
  return cachedLocale;
}

function getServerSnapshot(): Locale {
  return defaultLocale;
}

function setStoredLocale(next: Locale) {
  cachedLocale = next;
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((callback) => callback());
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <T>(select: (dictionary: Dictionary) => T) => T;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale: setStoredLocale,
    t: (select) => select(dictionaries[locale]),
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within a LocaleProvider");
  return context;
}
