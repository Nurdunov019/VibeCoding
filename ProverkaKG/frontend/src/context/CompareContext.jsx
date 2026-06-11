import { createContext, useContext, useEffect, useState } from 'react'

const CompareContext = createContext(null)
const STORAGE_KEY = 'proverkakg_compare'
const MAX = 4

export function CompareProvider({ children }) {
  const [slugs, setSlugs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
  }, [slugs])

  const toggle = (slug) => {
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug)
      if (prev.length >= MAX) return prev
      return [...prev, slug]
    })
  }

  const remove = (slug) => setSlugs((prev) => prev.filter((s) => s !== slug))
  const clear = () => setSlugs([])

  return (
    <CompareContext.Provider value={{ slugs, toggle, remove, clear, isSelected: (s) => slugs.includes(s), max: MAX }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  return useContext(CompareContext)
}
