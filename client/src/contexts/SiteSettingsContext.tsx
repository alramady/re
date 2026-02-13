import { createContext, useContext, ReactNode } from "react";
import { trpc } from "@/lib/trpc";

type SiteSettings = Record<string, string>;

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  get: (key: string, fallback?: string) => string;
  getAr: (key: string, fallback?: string) => string;
  getEn: (key: string, fallback?: string) => string;
  getByLang: (baseKey: string, lang: string, fallback?: string) => string;
  refetch: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: {},
  isLoading: true,
  get: () => "",
  getAr: () => "",
  getEn: () => "",
  getByLang: () => "",
  refetch: () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, refetch } = trpc.siteSettings.getAll.useQuery(undefined, {
    staleTime: 60_000, // cache for 1 minute
    refetchOnWindowFocus: false,
  });

  const settings: SiteSettings = data ?? {};

  function get(key: string, fallback = ""): string {
    return settings[key] || fallback;
  }

  function getAr(key: string, fallback = ""): string {
    return settings[key + "Ar"] || fallback;
  }

  function getEn(key: string, fallback = ""): string {
    return settings[key + "En"] || fallback;
  }

  function getByLang(baseKey: string, lang: string, fallback = ""): string {
    const suffix = lang === "ar" ? "Ar" : "En";
    return settings[baseKey + suffix] || settings[baseKey + (lang === "ar" ? "En" : "Ar")] || fallback;
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading, get, getAr, getEn, getByLang, refetch }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
