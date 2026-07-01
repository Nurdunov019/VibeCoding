import { createContext, useContext, useEffect, useState } from 'react'

const WeddingThemeContext = createContext(null)

const STORAGE_KEY = 'chakyruu-wedding-theme'

export function WeddingThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'day'
    return localStorage.getItem(STORAGE_KEY) || 'day'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-wedding-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'day' ? 'night' : 'day'))

  return (
    <WeddingThemeContext.Provider value={{ theme, setTheme, toggleTheme, isNight: theme === 'night' }}>
      {children}
    </WeddingThemeContext.Provider>
  )
}

export function useWeddingTheme() {
  const ctx = useContext(WeddingThemeContext)
  if (!ctx) throw new Error('useWeddingTheme must be used within WeddingThemeProvider')
  return ctx
}
