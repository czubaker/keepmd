"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

// Import all translations
import enTranslations from "@/translations/en.json"
import deTranslations from "@/translations/de.json"
import frTranslations from "@/translations/fr.json"
import csTranslations from "@/translations/cs.json"
import plTranslations from "@/translations/pl.json"
import beTranslations from "@/translations/be.json"
import ukTranslations from "@/translations/uk.json"
import kkTranslations from "@/translations/kk.json"

export type LanguageCode = "en" | "de" | "fr" | "cs" | "pl" | "be" | "uk" | "kk"

const translations = {
  en: enTranslations,
  de: deTranslations,
  fr: frTranslations,
  cs: csTranslations,
  pl: plTranslations,
  be: beTranslations,
  uk: ukTranslations,
  kk: kkTranslations,
}

type TranslationsType = typeof enTranslations

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en")

  useEffect(() => {
    // Load language preference from localStorage on mount
    const savedLanguage = localStorage.getItem("language") as LanguageCode
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0] as LanguageCode
      if (Object.keys(translations).includes(browserLang)) {
        setLanguageState(browserLang)
      }
    }
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        // Fallback to English if translation is missing
        value = getNestedValue(enTranslations, keys)
        if (value === undefined) {
          return key // Return the key if translation is missing in all languages
        }
        break
      }
    }

    return typeof value === "string" ? value : key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Helper function to get nested value from object
function getNestedValue(obj: any, keys: string[]): any {
  let value = obj
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key]
    } else {
      return undefined
    }
  }
  return value
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
