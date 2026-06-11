import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../i18n/translations'

const LocaleContext = createContext(null)
const STORAGE_KEY = 'proverkakg_lang'

function get(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj) ?? path
}

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'ky')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'ky' ? 'ky' : lang
  }, [lang])

  const t = (key) => get(translations[lang], key)

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
