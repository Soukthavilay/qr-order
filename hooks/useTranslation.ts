import { translations } from "../data/mockData"
import type { Language } from "../types"

export function useTranslation(language: Language) {
  const t = (key: string): string => {
    return translations[language]?.[key] || key
  }

  return { t }
}
