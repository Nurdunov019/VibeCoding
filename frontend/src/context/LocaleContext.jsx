import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../i18n/translations'
import { readStorage, writeStorage } from '../utils/safeStorage'

const LocaleContext = createContext(null)
const STORAGE_KEY = 'proverkakg_lang'

function get(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj) ?? path
}

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(() => readStorage(STORAGE_KEY, 'ky'))

  useEffect(() => {
    writeStorage(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'ky' ? 'ky' : lang
  }, [lang])

  const t = (key, vars) => {
    let str = get(translations[lang], key)
    if (typeof str !== 'string') return key
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replaceAll(`{${k}}`, String(v))
      })
    }
    return str
  }

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
